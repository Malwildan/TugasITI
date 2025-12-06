import { Head, Link } from "@inertiajs/react";

export default function Continue() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#fdf5ff] via-[#f7fbff] to-[#e8f6ff] px-4 py-12 overflow-hidden">
      <Head title="Continue" />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(247,199,216,0.35)_0%,transparent_32%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(179,236,255,0.3)_0%,transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent,transparent_95%,rgba(0,0,0,0.08)_95%)] bg-[size:100%_60px] opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:80px_100%] opacity-10" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-[32px] border-4 border-black bg-white/80 p-6 shadow-[0_10px_0_#111] backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-4 border-black bg-gradient-to-r from-[#fdebf3] via-[#d7f7f1] to-[#c9ecff] px-4 py-3 shadow-[0_6px_0_#111]">
          <div className="flex items-center gap-3">
            <span className="pixel-font text-sm">Continue</span>
            <span className="status-led bg-[#FF8AAE]" />
          </div>
          <Link href={route("dashboard") as string} className="pixel-button bg-[#FFD6FF]">Back to Dashboard</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="arcade-cab arcade-cab--pink">
            <div className="arcade-marquee">Resume</div>
            <div className="arcade-screen crt-overlay">
              <p className="pixel-font text-[10px] text-[#FFCCE1]">Slot A</p>
              <h2 className="mt-3 text-xl font-extrabold text-white">Profile Hub</h2>
              <p className="mt-2 text-sm text-[#d7f0ff]">Jump back to your classmates, stats, and gallery where you left off.</p>
              <div className="mt-auto text-[10px] text-[#fdfd96]">Checkpoint saved • 00:39:12</div>
            </div>
            <div className="arcade-controls">
              <div className="joystick" />
              <div className="button-grid">
                <span />
                <span />
                <span />
                <span />
              </div>
              <Link href={route("dashboard") as string} className="pixel-button">Open</Link>
            </div>
          </div>

          <div className="arcade-cab arcade-cab--mint">
            <div className="arcade-marquee">New Run</div>
            <div className="arcade-screen crt-overlay">
              <p className="pixel-font text-[10px] text-[#C7FFE3]">Slot B</p>
              <h2 className="mt-3 text-xl font-extrabold text-white">Start Fresh</h2>
              <p className="mt-2 text-sm text-[#dfffea]">Spin up a new session and collect more badges, facts, and memories.</p>
              <div className="mt-auto text-[10px] text-[#f9f4ff]">Latest sync • just now</div>
            </div>
            <div className="arcade-controls">
              <div className="joystick" />
              <div className="button-grid">
                <span />
                <span />
                <span />
                <span />
              </div>
              <Link href={route("dashboard") as string} className="pixel-button">Start</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
