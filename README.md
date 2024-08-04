# Instagram Scraper and Widget Generator

This project is an open-source backend service that scrapes data from Instagram and generates widgets based on the scraped data. It utilizes Redis for caching and requires a proxy for making requests to Instagram.

## Features

- Scrapes Instagram user profile information and posts
- Caches responses in Redis to reduce the load on Instagram
- Generates widgets based on the scraped data
- Manages session handling with Instagram

## Requirements

- Node.js
- Redis
- Proxy service

## Installation

1. Clone the repository:

```sh
git clone https://github.com/hormold/instagram-scraper-widget.git
cd instagram-scraper-widget
```

2. Install dependencies:

```sh
npm install
```

3. Set up environment variables:

Create a `.env` file in the root of the project and add the following variables:

```env
REDIS_URL=redis://localhost:6379
PROXY_URL=https://your-proxy-service.com/{session}
```

My recommendation for a proxy service is [Scraper API](https://dashboard.suborbit.al/register?code=hormold), which provides a session-based proxy service for scraping Instagram and other websites. You can generate Residential or Datacenter proxies with unique sessions for each user.

## Usage

1. Start the Redis server:

```sh
redis-server
```

2. Run the backend service:

```sh
npm start
```

## API Endpoints

### Scrape Instagram Profile

```http
GET /scrape/{username}
```

#### Response

```json
{
  "username": "string",
  "fullname": "string",
  "description": "string",
  "profilePhoto": "string",
  "metrics": {
    "followers": "number",
    "following": "number",
    "posts": "number"
  },
  "posts": [
    {
      "shortcode": "string",
      "photo": "string",
      "accessibility_caption": "string",
      "caption": "string",
      "location": "string",
      "likes": "number",
      "comments": "number"
    }
  ]
}
```

## Session Management

- Generates a unique session ID for each user
- Stores session data in Redis with expiration
- Retrieves and reuses last working session if valid
- Revokes session if invalid response is received from Instagram
- Updates session activity to prevent expiration

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.