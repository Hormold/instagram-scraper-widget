import { SocialMediaProfile } from "@/src/types";

const CompactInstagramProfile = ({ profile, showHeader = true, showCounters = true }: { profile: SocialMediaProfile; showHeader?: boolean; showCounters?: boolean }) => {
  const { username, fullname, profilePhoto, metrics } = profile;

  return (
    <>
    {showHeader && (
      <div className="flex items-center justify-between p-2 border rounded-lg shadow-sm mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <a href={`https://www.instagram.com/${username}/`} target="_blank" rel="noopener noreferrer">
              <img src={`/api/proxy?url=${Buffer.from(profile.profilePhoto).toString('base64')}`} alt={username} width={28} height={28} className="rounded-full" />
            </a>
          </div>
          
          <div className="flex items-center space-x-2">
            <a href={`https://www.instagram.com/${username}/`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
              <span className="font-semibold text-sm">{fullname}</span>
            </a>
            <a href={`https://www.instagram.com/${username}/`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">@{username}</span>
            </a>
            {showCounters && (
            <span className="text-xs text-gray-500">
              {metrics.posts} posts • {metrics.followers} followers • {metrics.following} following
            </span>
            )}
          </div>
        </div>
        <a className="bg-[#0095F6] text-white px-3 py-1 rounded-md text-xs font-semibold flex items-center" href={`https://www.instagram.com/${username}/`} target="_blank" rel="noopener noreferrer">
          Follow
        </a>
      </div>
      )}
    </>
  );
};

export default CompactInstagramProfile;