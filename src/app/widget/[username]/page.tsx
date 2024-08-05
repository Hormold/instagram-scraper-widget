"use client";
import { Camera, Heart, MessageCircle } from "lucide-react";
import WidgetCompactHeader from "@/src/app/components/WidgetCompactHeader";
import WidgetFullHeader from "@/src/app/components/WidgetFullHeader";

interface InstagramWidgetProps {
  profile: any;
  showHeader?: boolean;
  showCounters?: boolean;
  headerStyle?: "full" | "compact";
  photoCount?: number;
}

export default function InstagramWidget({ 
  profile, 
  showHeader = true, 
  showCounters = true, 
  headerStyle = "full", 
  photoCount = 6 
}: InstagramWidgetProps) {
  return (
    <div className="bg-transparent p-4 rounded-lg">
      {headerStyle === "full" ? (
        <WidgetFullHeader profile={profile} showHeader={showHeader} showCounters={showCounters} />
      ) : (
        <WidgetCompactHeader profile={profile} showHeader={showHeader} />
      )}
      <div className="grid grid-cols-3 gap-2">
        {profile.posts.slice(0, photoCount).map((post: any, index: number) => (
          <div key={index} className="relative group">
            <a href={`https://www.instagram.com/p/${post.shortcode}/`} target="_blank" rel="noopener noreferrer">
              <img
                src={post.photo}
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
}