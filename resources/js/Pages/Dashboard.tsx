import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@inertiajs/react";

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
                <button className="machine-action-btn" onClick={() => navigate('/stat-lab')}>VIEW</button>
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
                <button className="machine-action-btn" onClick={() => navigate('/memory-reel')}>OPEN</button>
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

      {/* Games section */}
      <div className="dashboard-main-card" style={{ marginTop: '2rem' }}>
        <div className="dashboard-inner-card">
          {/* Header Bar */}
          <div className="dashboard-header-bar">
            <div className="dashboard-header-left">
              <span className="dashboard-level">LEVEL 02 - GAMES</span>
              <div className="dashboard-dots">
                <span className="dashboard-dot dashboard-dot--mint" />
                <span className="dashboard-dot dashboard-dot--yellow" />
                <span className="dashboard-dot dashboard-dot--pink" />
              </div>
            </div>
            <span className="dashboard-timer">SELECT A GAME</span>
          </div>

          {/* Progress Bar */}
          <div className="dashboard-progress-container">
            <div className="dashboard-progress-bar">
              <div className="dashboard-progress-fill" style={{ width: '25%' }} />
            </div>
          </div>

          {/* Games Grid */}
          <div className="dashboard-grid">
            {/* Sum Fruit Game Card */}
            <div className="arcade-machine arcade-machine--mint">
              <div className="machine-marquee">SUM FRUIT</div>
              <div className="machine-screen">
                <p className="machine-player">MINI GAME 01</p>
                <h2 className="machine-title">Add to Ten</h2>
                <p className="machine-desc">Drag to select apples whose total equals ten.</p>
                <div className="machine-stats">
                  <span>Mode: Classic</span>
                  <span>Time: 120s</span>
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
                <button className="machine-action-btn" onClick={() => window.open('/resources/js/Pages/sumgame.html', '_blank')}>PLAY</button>
              </div>
            </div>

            {/* Locked Game 2 */}
            <div className="arcade-machine arcade-machine--locked">
              <div className="machine-marquee">LOCKED</div>
              <div className="machine-screen">
                <p className="machine-player">MINI GAME 02</p>
                <h2 className="machine-title">Coming Soon</h2>
                <p className="machine-desc">New game experience unlocking in the next update.</p>
                <div className="machine-stats">
                  <span>Status: LOCKED</span>
                  <span>🔒</span>
                </div>
              </div>
              <div className="machine-controls">
                <div className="machine-joystick" />
                <div className="machine-buttons">
                  <span className="btn-gray" />
                  <span className="btn-gray" />
                  <span className="btn-gray" />
                  <span className="btn-gray" />
                </div>
                <button className="machine-action-btn machine-action-btn--disabled" disabled>LOCKED</button>
              </div>
            </div>

            {/* Locked Game 3 */}
            <div className="arcade-machine arcade-machine--locked">
              <div className="machine-marquee">LOCKED</div>
              <div className="machine-screen">
                <p className="machine-player">MINI GAME 03</p>
                <h2 className="machine-title">Coming Soon</h2>
                <p className="machine-desc">New game experience unlocking in the next update.</p>
                <div className="machine-stats">
                  <span>Status: LOCKED</span>
                  <span>🔒</span>
                </div>
              </div>
              <div className="machine-controls">
                <div className="machine-joystick" />
                <div className="machine-buttons">
                  <span className="btn-gray" />
                  <span className="btn-gray" />
                  <span className="btn-gray" />
                  <span className="btn-gray" />
                </div>
                <button className="machine-action-btn machine-action-btn--disabled" disabled>LOCKED</button>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="dashboard-footer-bar">
            <div className="dashboard-footer-progress">
              <div className="footer-progress-track">
                <div className="footer-progress-fill" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
