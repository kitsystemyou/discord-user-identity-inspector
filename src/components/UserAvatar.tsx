"use client";

import React, { useState } from "react";
import { DiscordUser } from "@/types/discord";
import { getAvatarUrl, getAvatarDecorationUrl, formatAccentColor } from "@/lib/discord";

interface UserAvatarProps {
  user: DiscordUser;
  /** UI上の表示サイズ (px)。初期値: 96 */
  size?: number;
  /** Discord CDN にリクエストする画像解像度。初期値: 256 */
  imageSize?: number;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 96,
  imageSize = 256,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);
  const [decorationError, setDecorationError] = useState(false);

  // 初期値256（2の累乗）をそのまま渡す
  const avatarUrl = getAvatarUrl(user, imageSize);
  const decorationUrl = getAvatarDecorationUrl(user, imageSize);
  const accentColorHex = formatAccentColor(user.accent_color) || "#5865F2";

  // 表示名またはユーザー名のイニシャル
  const initial = (user.global_name || user.username || "?").charAt(0).toUpperCase();

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* アバター本体 */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden bg-discord-light border-2 border-indigo-500/50 shadow-md flex items-center justify-center"
        style={{
          background: imageError
            ? `linear-gradient(135deg, ${accentColorHex}, #1e1f22)`
            : undefined,
        }}
      >
        {!imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={user.global_name || user.username}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            loading="eager"
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center text-white font-bold tracking-wider"
            style={{ fontSize: size * 0.4 }}
          >
            <span>{initial}</span>
          </div>
        )}
      </div>

      {/* アバター装飾（Avatar Decoration） */}
      {decorationUrl && !decorationError && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-15%",
            left: "-15%",
            width: "130%",
            height: "130%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={decorationUrl}
            alt="Avatar Decoration"
            className="w-full h-full object-contain"
            onError={() => setDecorationError(true)}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
};
