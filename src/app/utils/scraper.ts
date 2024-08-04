import { advancedFetch, extractKeyValuePairs } from "./fetch";
import crypto from "crypto";
import redis from "./redis";

interface SocialMediaProfile {
  username: string;
  fullname: string;
  description: string;
  profilePhoto: string;
  metrics: {
    followers: number;
    following: number;
    posts: number;
  };
  posts: Array<{
    shortcode: string;
    photo: string;
    accessibility_caption: string;
    caption: string;
    location: string;
    likes: number;
    comments: number;
  }>;
}

interface SessionData {
  csrfToken: string;
  mid: string;
  cookies: string;
  lastActive: number;
}

// Cache expiration time (in seconds)
const CACHE_EXPIRATION = 3600; // 1 hour
const SESSION_EXPIRATION = 600; // 10 minutes

// Generate a unique session ID
function generateSessionId(): string {
  return crypto.randomBytes(8).toString("hex");
}

// Retrieve or create a new session
async function getSession(userName: string): Promise<{
  sessionId: string;
  sessionData: SessionData;
}> {
  // Try to get the last working session
  const lastWorkingSessionId = await redis.get(
    `instagram:last_working_session:${userName}`
  );
  if (lastWorkingSessionId) {
    const sessionData = await redis.get(
      `session:${userName}:${lastWorkingSessionId}`
    );
    if (sessionData) {
      const parsedSessionData = JSON.parse(sessionData);
      if (
        Date.now() - parsedSessionData.lastActive <
        SESSION_EXPIRATION * 1000
      ) {
        return {
          sessionId: lastWorkingSessionId,
          sessionData: parsedSessionData,
        };
      }
    }
  }

  const sessionId = generateSessionId();
  const proxyUrl = process.env.PROXY_URL!.replace("{session}", sessionId);

  // Fetch CSRF token and cookies from Instagram
  const response = await advancedFetch<string>(
    "https://www.instagram.com/" + userName + "/",
    proxyUrl,
    {
      method: "GET",
      responseType: "text",
      headers: {
        referrer: "https://www.instagram.com/" + userName + "/",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
    }
  );

  const cookies = extractKeyValuePairs(
    (response.headers!["set-cookie"] as string[]).join(", ")
  );

  if (!cookies) {
    throw new Error("Failed to retrieve CSRF token");
  }

  const sessionData: SessionData = {
    csrfToken: cookies.csrftoken,
    cookies: Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join("; "),
    mid: cookies.mid,
    lastActive: Date.now(),
  };

  // Store session data in Redis
  await redis.setex(
    `session:${userName}:${sessionId}`,
    SESSION_EXPIRATION,
    JSON.stringify(sessionData)
  );

  // Set this as the last working session
  await redis.set(`instagram:last_working_session:${userName}`, sessionId);
  return { sessionId, sessionData };
}

// Revoke a session
async function revokeSession(
  userName: string,
  sessionId: string
): Promise<void> {
  await redis.del(`session:${userName}:${sessionId}`);
  await redis.del(`instagram:last_working_session:${userName}`);
}

// Update session last active time
async function updateSessionActivity(
  userName: string,
  sessionId: string
): Promise<void> {
  const sessionData = await redis.get(`session:${userName}:${sessionId}`);
  if (sessionData) {
    const parsedSessionData = JSON.parse(sessionData);
    parsedSessionData.lastActive = Date.now();
    await redis.setex(
      `session:${userName}:${sessionId}`,
      SESSION_EXPIRATION,
      JSON.stringify(parsedSessionData)
    );
  }
}

export async function scrapeInstagram(
  url: string
): Promise<SocialMediaProfile> {
  try {
    const parsedUrl = new URL(url);
    const username = parsedUrl.pathname.replace(/\//g, "");
    let proxyUrl = process.env.PROXY_URL;
    let { sessionId, sessionData } = await getSession(username);
    proxyUrl = proxyUrl?.replace("{session}", sessionId);
    const CACHE_KEY = `1instagram:${username}`;

    // Check cache first
    const cachedData = await redis.get(CACHE_KEY);
    let body = null;
    if (cachedData) {
      body = JSON.parse(cachedData);
    } else {
      const responseObj = await advancedFetch(
        `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
        proxyUrl!,
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            pragma: "no-cache",
            "sec-ch-prefers-color-scheme": "dark",
            "sec-ch-ua":
              '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            "sec-ch-ua-full-version-list":
              '"Not/A)Brand";v="8.0.0.0", "Chromium";v="126.0.6478.127", "Google Chrome";v="126.0.6478.127"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-asbd-id": "129477",
            "x-csrftoken": sessionData.csrfToken,
            "x-ig-app-id": "936619743392459",
            "x-ig-www-claim": "0",
            "x-requested-with": "XMLHttpRequest",
            cookie: `${sessionData.cookies}; ig_did=90B91C5D-A6E9-404E-BE08-61D7AF04A02D; ig_nrcb=1; datr=9TqLZiOuXEWG1jqb2AjQ2qSy; wd=1712x285`,
            Referer: `https://www.instagram.com/${username}/`,
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
          responseType: "json",
          method: "GET",
        }
      );

      const response = responseObj.data;
      const data = response.data;

      if (response.status === "fail" || !data.user) {
        console.log("Invalid response from Instagram:", data.status, data.user);
        await revokeSession(username, sessionId);
        throw new Error("Invalid response from Instagram");
      }

      body = data;
      await redis.setex(CACHE_KEY, CACHE_EXPIRATION, JSON.stringify(body));
    }

    const result: SocialMediaProfile = {
      username: body.user.username,
      fullname: body.user.full_name,
      description: body.user.biography,
      profilePhoto: body.user.profile_pic_url,
      metrics: {
        followers: body.user.edge_followed_by.count,
        following: body.user.edge_follow.count,
        posts: body.user.edge_owner_to_timeline_media.count,
      },
      posts: [],
    };

    for (const post of body.user.edge_owner_to_timeline_media.edges) {
      result.posts.push({
        shortcode: post.node.shortcode,
        photo: post.node.display_url,
        accessibility_caption: post.node.accessibility_caption,
        caption: post?.node?.edge_media_to_caption?.edges[0]?.node?.text,
        location: post?.node?.location?.name,
        likes: post?.node?.edge_liked_by?.count,
        comments: post?.node?.edge_media_to_comment?.count,
      });
    }

    // Update session activity, so it doesn't expire
    await updateSessionActivity(username, sessionId);

    return result;
  } catch (error) {
    console.error("Error scraping Instagram:", error);
    throw error;
  }
}
