import type { Metadata } from 'next';
import Providers from './providers';
import '@/shared/ui/styles/globals.css';

export const metadata: Metadata = {
  title: 'K-Drama Battle - 명대사 HP 배틀',
  description: 'K-드라마 명대사로 펼치는 성우 배틀! 캐릭터를 선택하고 HP를 깎아 KO 시키세요!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
