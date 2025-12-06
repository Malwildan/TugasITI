import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="dashboard-arcade-bg">
      {/* Scanline overlay */}
      <div className="dashboard-scanlines" />

      {/* HUD ribbon */}
      <div className="dashboard-hud">
        <div className="hud-ribbon">
          <span className="hud-title">STUDENT ARCADE</span>
          <div className="hud-status">
            <div className="hud-led" />
            <span className="hud-blink">INSERT COIN PLEASE</span>
          </div>
        </div>
        <button className="hud-ready-btn">READY?</button>
      </div>

      {/* Main Content Card */}
      <div className="dashboard-main-card">
        <div className="dashboard-inner-card">
          {/* Header Bar */}
          <div className="dashboard-header-bar">
            <div className="dashboard-header-left">
              <span className="dashboard-level">LEVEL 01 - PROFILE HUB</span>
              <div className="dashboard-dots">
                <span className="dashboard-dot dashboard-dot--pink" />
                <span className="dashboard-dot dashboard-dot--yellow" />
                <span className="dashboard-dot dashboard-dot--cyan" />
              </div>
            </div>
            <span className="dashboard-timer">00:39:12</span>
          </div>

          {/* Progress Bar */}
          <div className="dashboard-progress-container">
            <div className="dashboard-progress-bar">
              <div className="dashboard-progress-fill" style={{ width: '65%' }} />
            </div>
          </div>

          {/* Arcade Machines Grid */}
          <div className="dashboard-grid">
            {/* Classmates arcade machine */}
            <div className="arcade-machine arcade-machine--pink">
              <div className="machine-marquee">CLASSMATES</div>
              <div className="machine-screen">
                <p className="machine-player">PLAYER 01</p>
                <h2 className="machine-title">Roster</h2>
                <p className="machine-desc">View profiles of all students. Unlock badges, send stickers, and bookmark your BFFs.</p>
                <div className="machine-stats">
                  <span>Slots Left: 08</span>
                  <span>Combo x3</span>
                </div>
              </div>
              <div className="machine-controls">
                <div className="machine-joystick" />
                <div className="machine-buttons">
                  <span className="btn-pink" />
                  <span className="btn-yellow" />
                  <span className="btn-mint" />
                  <span className="btn-cyan" />
                </div>
                <button className="machine-action-btn" onClick={() => navigate('/classmates')}>OPEN</button>
              </div>
            </div>

            {/* Fun Facts arcade machine */}
            <div className="arcade-machine arcade-machine--mint">
              <div className="machine-marquee">FUN FACTS</div>
              <div className="machine-screen">
                <p className="machine-player">PLAYER 02</p>
                <h2 className="machine-title">Stat Lab</h2>
                <p className="machine-desc">MBTI, zodiac, fave drinks, and birthday charts—all rendered as cute pixels.</p>
                <div className="machine-stats">
                  <span>Data Sets: 24</span>
                  <span>Lucky Day: Sun</span>
                </div>
              </div>
              <div className="machine-controls">
                <div className="machine-joystick" />
                <div className="machine-buttons">
                  <span className="btn-pink" />
                  <span className="btn-yellow" />
                  <span className="btn-mint" />
                  <span className="btn-cyan" />
                </div>
                <button className="machine-action-btn">VIEW</button>
              </div>
            </div>

            {/* Gallery arcade machine */}
            <div className="arcade-machine arcade-machine--purple">
              <div className="machine-marquee">GALLERY</div>
              <div className="machine-screen">
                <p className="machine-player">PLAYER 03</p>
                <h2 className="machine-title">Memory Reel</h2>
                <p className="machine-desc">Drop photos, polaroids, and event posters. Scroll like a music video storyboard.</p>
                <div className="machine-stats">
                  <span>Clips: 56</span>
                  <span>New ★ 04</span>
                </div>
              </div>
              <div className="machine-controls">
                <div className="machine-joystick" />
                <div className="machine-buttons">
                  <span className="btn-pink" />
                  <span className="btn-yellow" />
                  <span className="btn-mint" />
                  <span className="btn-cyan" />
                </div>
                <button className="machine-action-btn">OPEN</button>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="dashboard-footer-bar">
            <div className="dashboard-footer-progress">
              <div className="footer-progress-track">
                <div className="footer-progress-fill" />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="dashboard-actions">
            <button onClick={handleLogout} className="dashboard-exit-btn">EXIT</button>
            <span className="dashboard-coins">COINS READY</span>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Circles */}
      <div className="dashboard-bottom-circles">
        <span className="db-circle db-circle--pink" />
        <span className="db-circle db-circle--mint" />
        <span className="db-circle db-circle--yellow" />
        <span className="db-circle db-circle--cyan" />
      </div>
    </div>
  );
}
