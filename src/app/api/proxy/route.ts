import redis from "@/src/app/utils/redis";

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url!);
  let query = searchParams.get("url");
  if (!query) {
    throw new Error("Missing URL parameter");
  }
  // unbase64 url
  query = Buffer.from(query, "base64").toString("utf-8");

  try {
    // Check if the image is already cached in Redis
    const cachedImage = await redis.get(query);
    if (cachedImage) {
      console.log("Cache hit");
      return new Response(Buffer.from(cachedImage, "base64"), {
        headers: {
          "content-type": "image/jpeg", // Adjust based on your needs
        },
      });
    }

    // If not cached, fetch the image
    const headers = {
      accept:
        "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      pragma: "no-cache",
      priority: "i",
      "sec-ch-ua":
        '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "image",
      "sec-fetch-mode": "no-cors",
      "sec-fetch-site": "cross-site",
      Referer: "https://www.instagram.com/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, lik" +
        "e Gecko) Chrome/126.0.0.0 Safari/537.36",
      dnt: "1",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    };
    const response = await fetch(query, {
      method: "GET",
      headers,
    });
    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to fetch image: " + response.statusText);
    }
    const image = Buffer.from(await response.arrayBuffer());

    // Cache the image in Redis
    await redis.set(query, image.toString("base64"), "EX", 60 * 60); // Cache for 1 hour

    return new Response(image, {
      headers: {
        "content-type": response.headers.get("content-type")!,
      },
    });
  } catch (error) {
    throw error;
  }
}
