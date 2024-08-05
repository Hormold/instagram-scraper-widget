export interface SocialMediaProfile {
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

export interface SessionData {
  csrfToken: string;
  mid: string;
  cookies: string;
  lastActive: number;
}

export interface IInstagramResponse {
  data: {
    user: {
      username: string;
      full_name: string;
      biography: string;
      profile_pic_url: string;
      edge_followed_by: {
        count: number;
      };
      edge_follow: {
        count: number;
      };
      edge_owner_to_timeline_media: {
        count: number;
        edges: Array<{
          node: {
            shortcode: string;
            display_url: string;
            accessibility_caption: string;
            edge_media_to_caption: {
              edges: Array<{
                node: {
                  text: string;
                };
              }>;
            };
            location: {
              name: string;
            };
            edge_liked_by: {
              count: number;
            };
            edge_media_to_comment: {
              count: number;
            };
          };
        }>;
      };
    };
  };
  status: string;
}
