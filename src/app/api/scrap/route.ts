import { NextApiRequest, NextApiResponse } from "next";
import { scrapeInstagram } from "../../utils/scraper";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url!);
  const username = searchParams.get("username");

  if (typeof username !== "string") {
    return NextResponse.json(
      { error: "Missing username parameter" },
      { status: 400 }
    );
  }

  try {
    const profile = await scrapeInstagram(
      `https://www.instagram.com/${username}/`
    );
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error scraping Instagram:", error);
    return NextResponse.json(
      { error: "Failed to scrape Instagram profile" },
      { status: 500 }
    );
  }
}
