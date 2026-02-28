'use client';

interface CharacterAvatarProps {
  image: string;
  emoji: string;
  name?: string;
  size?: number;
  className?: string;
}

export default function CharacterAvatar({
  image,
  emoji,
  name,
  size = 48,
  className = '',
}: CharacterAvatarProps) {
  return (
    <img
      src={image}
      alt={name ?? emoji}
      className={className}
      style={{
        width: size >= 999 ? '100%' : size,
        height: size >= 999 ? '100%' : size,
        objectFit: 'contain',
      }}
    />
  );
}
