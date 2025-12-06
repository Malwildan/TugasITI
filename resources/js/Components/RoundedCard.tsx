/*
Reusable pastel retro sticker card
Props:
- title: bold header text
- bgColor: 'pink' | 'blue' | 'purple' | 'mint' (default 'blue')
- className: extra tailwind classes
- children: card body content
*/
import React from 'react';

type RoundedCardProps = {
  title: string;
  bgColor?: 'pink' | 'blue' | 'purple' | 'mint';
  className?: string;
  children?: React.ReactNode;
};

const bgClassMap: Record<NonNullable<RoundedCardProps['bgColor']>, string> = {
  pink: 'card-pink',
  blue: 'card-blue',
  purple: 'card-purple',
  mint: 'card-mint',
};

export default function RoundedCard({ title, bgColor = 'blue', className = '', children }: RoundedCardProps) {
  const bgClass = bgClassMap[bgColor] ?? bgClassMap.blue;

  return (
    <div
      className={[
        'rounded-3xl border-2 border-black p-6',
        bgClass,
        'sticker-shadow transition-transform duration-200 hover:-translate-y-0.5 hover:drop-shadow-lg',
        className,
      ].join(' ')}
    >
      <h2 className="font-bold text-xl tracking-wider text-gray-900">{title}</h2>
      {children && <div className="mt-2 text-sm text-gray-800">{children}</div>}
    </div>
  );
}
