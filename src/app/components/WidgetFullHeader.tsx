

import { SocialMediaProfile } from "@/src/types";
import { Camera } from "lucide-react";

const CompactInstagramProfile = ({ profile, showHeader = true, showCounters = true }: { profile: SocialMediaProfile; showHeader?: boolean; showCounters?: boolean }) => {
  const { username, fullname, profilePhoto, metrics } = profile;

  return (
    <>
	{showHeader && (
			<div className="flex items-center justify-between p-4 border-b">
				<div className="flex items-center space-x-2">
					<a href={`https://www.instagram.com/${username}/`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
					<div className="w-9 h-9 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center">
						<img src={`/api/proxy?url=${Buffer.from(profile.profilePhoto).toString('base64')}`} alt={profile.username} width={32} height={32} className="rounded-full" />
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
	</>
  );
};

export default CompactInstagramProfile;