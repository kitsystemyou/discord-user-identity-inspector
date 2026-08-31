import React from "react";
import { DiscordConnection } from "@/types/discord";
import { CheckCircle, Link2, ExternalLink } from "lucide-react";

interface ConnectionsListProps {
  connections?: DiscordConnection[];
}

export const ConnectionsList: React.FC<ConnectionsListProps> = ({ connections = [] }) => {
  if (!connections || connections.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-discord-light/30 border border-white/5 text-center text-gray-400 text-sm">
        連携されている外部サービスアカウントはありません。
      </div>
    );
  }

  const getServiceBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "github":
        return "bg-gray-800 text-white border-gray-700";
      case "steam":
        return "bg-blue-950 text-blue-300 border-blue-800";
      case "spotify":
        return "bg-emerald-950 text-emerald-300 border-emerald-800";
      case "twitch":
        return "bg-purple-950 text-purple-300 border-purple-800";
      case "youtube":
        return "bg-red-950 text-red-300 border-red-800";
      case "twitter":
      case "x":
        return "bg-sky-950 text-sky-300 border-sky-800";
      default:
        return "bg-discord-darkest text-gray-300 border-white/10";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {connections.map((conn) => (
        <div
          key={`${conn.type}-${conn.id}`}
          className="flex items-center justify-between p-3 rounded-lg bg-discord-light/40 hover:bg-discord-light/80 transition-colors border border-white/5"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider border ${getServiceBadgeColor(
                conn.type
              )}`}
            >
              {conn.type}
            </span>
            <div className="min-w-0">
              <span className="font-semibold text-white text-xs block truncate" title={conn.name}>
                {conn.name}
              </span>
              <span className="text-[10px] text-gray-400 font-mono block truncate">
                ID: {conn.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            {conn.verified && (
              <span title="認証済み">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </span>
            )}
            {conn.two_way_link && (
              <span title="相互連携">
                <Link2 className="w-3.5 h-3.5 text-blue-400" />
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
