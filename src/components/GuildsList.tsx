import React from "react";
import Image from "next/image";
import { DiscordGuild } from "@/types/discord";
import { getGuildIconUrl } from "@/lib/discord";
import { Crown, Users, Server } from "lucide-react";

interface GuildsListProps {
  guilds?: DiscordGuild[];
}

export const GuildsList: React.FC<GuildsListProps> = ({ guilds = [] }) => {
  if (!guilds || guilds.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-discord-light/30 border border-white/5 text-center text-gray-400 text-sm">
        所属しているサーバー情報が取得できないか、guildsスコープが無効です。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {guilds.map((guild) => {
        const iconUrl = getGuildIconUrl(guild);
        return (
          <div
            key={guild.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-discord-light/40 hover:bg-discord-light/80 transition-colors border border-white/5"
          >
            {/* サーバーアイコン */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-discord-darkest flex-shrink-0 flex items-center justify-center border border-white/10">
              {iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconUrl}
                  alt={guild.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              ) : (
                <Server className="w-5 h-5 text-gray-500" />
              )}
            </div>

            {/* サーバー詳細 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white text-xs truncate" title={guild.name}>
                  {guild.name}
                </span>
                {guild.owner && (
                  <span title="サーバーオーナー">
                    <Crown className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">
                ID: {guild.id}
              </p>
              {guild.approximate_member_count !== undefined && (
                <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                  <Users className="w-3 h-3 text-gray-500" />
                  <span>約 {guild.approximate_member_count.toLocaleString()} 人</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
