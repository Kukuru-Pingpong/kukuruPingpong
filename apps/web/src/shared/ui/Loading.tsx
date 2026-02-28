'use client';

interface LoadingProps {
  text: string;
}

export default function Loading({ text }: LoadingProps) {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner" />
      <p className="loading-text">{text}</p>
    </div>
  );
}
