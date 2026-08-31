import React from "react";
import { FlagDefinition, PREMIUM_TYPE_LABELS } from "@/lib/constants";
import { parseUserFlags } from "@/lib/discord";
import { ShieldCheck, Sparkles, Award } from "lucide-react";

interface BadgeListProps {
  flags?: number;
  publicFlags?: number;
  premiumType?: number;
  showDescriptions?: boolean;
}

export const BadgeList: React.FC<BadgeListProps> = ({
  flags = 0,
  publicFlags = 0,
  premiumType = 0,
  showDescriptions = false,
}) => {
  // flags と public_flags をマージ
  const combinedFlags = flags | publicFlags;
  const badges = parseUserFlags(combinedFlags);
  const premiumInfo = PREMIUM_TYPE_LABELS[premiumType] || PREMIUM_TYPE_LABELS[0];

  if (badges.length === 0 && premiumType === 0) {
    return <span className="text-gray-400 text-sm">特別なバッジはありません</span>;
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Nitro バッジ */}
      {premiumType > 0 && (
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30 shadow-sm`}
          title={premiumInfo.description}
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>{premiumInfo.name}</span>
        </div>
      )}

      {/* フラグバッジ一覧 */}
      {badges.map((badge: FlagDefinition) => (
        <div
          key={badge.bit}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-white/10 ${badge.iconColor} shadow-sm transition-transform hover:scale-105`}
          title={`${badge.name} (Bit: ${badge.bit}) - ${badge.description}`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{badge.badgeName}</span>
        </div>
      ))}
    </div>
  );
};
