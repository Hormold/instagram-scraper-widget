"use server";
import { Camera, Heart, MessageCircle } from "lucide-react";
import { scrapeInstagram } from "../../utils/scraper";
import Image from 'next/image';

interface PageProps {
  params: { username: string };
  searchParams: { showHeader?: string; photoCount?: string, showCounters?: string };
}

export default async function InstagramWidget({ params, searchParams }: PageProps) {
  const username = params.username;
  const showHeader = searchParams.showHeader !== "false";
  const showCounters = searchParams.showCounters !== "false";
  const photoCount = parseInt(searchParams.photoCount || "6", 10);

  try {
    const profile = await scrapeInstagram(`https://www.instagram.com/${username}/`);

    return (
      <div className="bg-white p-4 rounded-lg shadow">
    	{showHeader && (
			<div className="flex items-center justify-between p-4 border-b">
				<div className="flex items-center space-x-2">
					<a href={`https://www.instagram.com/${username}/`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
					<div className="w-9 h-9 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center">
						<Image src={`/api/proxy?url=${Buffer.from(profile.profilePhoto).toString('base64')}`} alt={profile.username} width={32} height={32} className="rounded-full" />
					</div>
					<div>
						<span className="font-semibold text-md block">{profile.fullname}</span>
						<span className="text-sm text-gray-500 block">@{profile.username}</span>
					</div>
					</a>
				</div>
				<a className="bg-[#0095F6] text-white px-6 py-1 rounded-md text-sm font-semibold" href={`https://www.instagram.com/${username}/`} target="_blank" rel="noopener noreferrer">
					<Camera size={18} className="inline-block mr-2" />
					Follow
				</a>
			</div>
		)}
		{showCounters && (
		<div className="flex justify-around py-3 text-center border-b">
			<div>
				<div className="font-semibold">{profile.metrics.posts}</div>
				<div className="text-gray-500 text-sm">Posts</div>
			</div>
			<div>
				<div className="font-semibold">{profile.metrics.followers}</div>
				<div className="text-gray-500 text-sm">Followers</div>
			</div>
			<div>
				<div className="font-semibold">{profile.metrics.following}</div>
				<div className="text-gray-500 text-sm">Following</div>
			</div>
		</div>
		)}
		<div className="grid grid-cols-3 gap-2">
			{profile.posts.slice(0, photoCount).map((post: any, index: number) => (
				<div key={index} className="relative group">
					<a href={`https://www.instagram.com/p/${post.shortcode}/`} target="_blank" rel="noopener noreferrer">
					<Image
						src={`/api/proxy?url=${Buffer.from(post.photo).toString('base64')}`}
						alt={post.accessibility_caption || ""}
						width={320}
						height={320}
						className="w-full h-48 object-cover rounded"
					/>
					<div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded p-2">
						<div className="text-white flex flex-col items-center space-y-2">
						
						<div className="flex items-center space-x-4">
							<div className="flex items-center">
							<Heart size={20} className="mr-1 fill-white" />
							<span>{post.likes || 0}</span>
							</div>
							<div className="flex items-center">
							<MessageCircle size={20} className="mr-1 fill-white" />
							<span>{post.comments || 0}</span>
							</div>
						</div>
						{post.caption && (
						<div className="text-xs mt-2 text-center">
							<span>
							{post.caption.length > 100 ? post.caption.slice(0, 100) + '...' : post.caption}
							</span>
							</div>
						)}
						</div>
					</div>
					</a>
				</div>
				))}
		</div>
      </div>
    );
  } catch (error) {
    return (
		<div className="flex items-center justify-center w-full h-screen bg-red-100">
			<div className="bg-red-500 text-white p-4 rounded-lg shadow-md text-center max-w-md mx-auto">
				<h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
				<p>{(error as Error).message}</p>
			</div>
		</div>
	);
  }
}