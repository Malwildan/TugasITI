import { Link } from "@inertiajs/react";

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden px-4 pb-12 pt-10">
      {/* Neon grid background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#f8cdea_0%,#ffece5_30%,transparent_65%)] opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent,transparent_95%,rgba(0,0,0,0.12)_95%)] bg-[size:100%_60px] opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:80px_100%] opacity-20" />
      </div>

      {/* HUD ribbon */}
      <div className="mx-auto mb-12 flex max-w-6xl flex-col gap-4 text-center text-white">
      <div className="inline-flex items-center justify-center gap-4 rounded-full border-4 border-black bg-gradient-to-r from-[#FF7698] via-[#FFB4B4] to-[#89F7FE] px-8 py-3 shadow-[0_8px_0_#111]">
        <span className="pixel-font text-xs">STUDENT ARCADE</span>
        <div className="flex items-center gap-3 text-xs">
        <div className="status-led bg-[#FF668A]" />
        <p className="pixel-font blink-slow">Insert Coin Please</p>
        </div>
      </div>
      <h1 className="mx-auto inline-flex items-baseline gap-3 rounded-3xl border-4 border-black bg-[#CDE8FF] px-8 py-4 text-center shadow-[0_10px_0_#111] text-gray-900">
        <span className="pixel-font text-base">READY?</span>
      </h1>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 rounded-[40px] border-4 border-black bg-white/70 p-6 shadow-[0_12px_0_#111] backdrop-blur-lg">
      <div className="flex items-center justify-between border-b-4 border-black pb-4">
        <div className="flex items-center gap-3">
        <span className="pixel-font text-xs">Level 01 - Profile Hub</span>
        <div className="flex gap-1">
          <span className="status-led bg-[#FF8AAE]" />
          <span className="status-led bg-[#F9F871]" />
          <span className="status-led bg-[#8EF6E4]" />
        </div>
        </div>
        <p className="pixel-font text-xs">00:39:12</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Classmates arcade machine */}
      <div className="arcade-cab arcade-cab--pink cab-bob">
        <div className="arcade-marquee">Classmates</div>
        <div className="arcade-screen crt-overlay">
        <p className="pixel-font text-[10px] text-[#FFCCE1]">Player 01</p>
        <h2 className="mt-4 text-2xl font-extrabold tracking-wide text-white">Roster</h2>
        <p className="mt-2 text-sm text-[#d7f0ff]">View profiles of all students. Unlock badges, send stickers, and bookmark your BFFs.</p>
        <div className="mt-auto flex items-center justify-between text-[10px] text-[#fdfd96]">
          <span>Slots Left: 08</span>
          <span>Combo x3</span>
        </div>
        </div>
        <div className="arcade-controls">
        <div className="joystick animate-pulse" />
        <div className="button-grid">
          <span />
          <span />
          <span />
          <span />
        </div>
        <button className="pixel-button">Open</button>
        </div>
      </div>

      {/* Fun Facts arcade machine */}
      <div className="arcade-cab arcade-cab--mint cab-bob" style={{ animationDelay: '0.4s' }}>
        <div className="arcade-marquee">Fun Facts</div>
        <div className="arcade-screen crt-overlay">
        <p className="pixel-font text-[10px] text-[#C7FFE3]">Player 02</p>
        <h2 className="mt-4 text-2xl font-extrabold tracking-wide text-white">Stat Lab</h2>
        <p className="mt-2 text-sm text-[#dfffea]">MBTI, zodiac, fave drinks, and birthday charts—all rendered as cute pixels.</p>
        <div className="mt-auto flex items-center justify-between text-[10px] text-[#f9f4ff]">
          <span>Data Sets: 24</span>
          <span>Lucky Day: Sun</span>
        </div>
        </div>
        <div className="arcade-controls">
        <div className="joystick" />
        <div className="button-grid">
          <span />
          <span />
          <span />
          <span />
        </div>
        <button className="pixel-button">View</button>
        </div>
      </div>

      {/* Gallery arcade machine */}
      <div className="arcade-cab arcade-cab--purple cab-bob" style={{ animationDelay: '0.8s' }}>
        <div className="arcade-marquee">Gallery</div>
        <div className="arcade-screen crt-overlay">
        <p className="pixel-font text-[10px] text-[#F8DCFF]">Player 03</p>
        <h2 className="mt-4 text-2xl font-extrabold tracking-wide text-white">Memory Reel</h2>
        <p className="mt-2 text-sm text-[#f2dfff]">Drop photos, polaroids, and event posters. Scroll like a music video storyboard.</p>
        <div className="mt-auto flex items-center justify-between text-[10px] text-[#fefae0]">
          <span>Clips: 56</span>
          <span>New ★ 04</span>
        </div>
        </div>
        <div className="arcade-controls">
        <div className="joystick" />
        <div className="button-grid">
          <span />
          <span />
          <span />
          <span />
        </div>
        <button className="pixel-button">Open</button>
        </div>
      </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t-4 border-black pt-4">
        <Link href={route("continue") as string} className="pixel-button bg-[#FFD6FF]">Continue</Link>
        <div className="pixel-font text-xs uppercase text-gray-700">Coins ready.</div>
      </div>
      </div>
    </div>
  );
}
