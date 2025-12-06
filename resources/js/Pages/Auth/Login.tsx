import { Head } from "@inertiajs/react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";

export default function Login({ status, canResetPassword }: { status?: any; canResetPassword?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";
  const [data, setData] = useState({ email: "", password: "", remember: false });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setProcessing(false);
    if (error) {
      const message = error.message || "Login failed";
      // naive error mapping
      if (message.toLowerCase().includes("email")) setErrors((p) => ({ ...p, email: message }));
      else if (message.toLowerCase().includes("password")) setErrors((p) => ({ ...p, password: message }));
      else setErrors({ general: message });
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <>
      <Head title="Login Station" />

      <div className="login-arcade-bg">
        {/* Outer Card - Pastel gradient border */}
        <div className="arcade-outer-card">
          {/* Header Bar */}
          <div className="arcade-header-bar">
            <div className="arcade-dots-left">
              <span className="arcade-dot arcade-dot--red" />
              <span className="arcade-dot arcade-dot--yellow" />
              <span className="arcade-dot arcade-dot--green" />
              <span className="arcade-dot arcade-dot--blue" />
            </div>
            <span className="arcade-header-title">STUDENT ARCADE</span>
            <div className="arcade-dots-right">
              <span className="arcade-dot-ring arcade-dot-ring--blue" />
              <span className="arcade-dot-ring arcade-dot-ring--green" />
              <span className="arcade-dot-ring arcade-dot-ring--yellow" />
              <span className="arcade-dot-ring arcade-dot-ring--red" />
            </div>
          </div>

          {/* Inner Dark Panel */}
          <div className="arcade-inner-panel">
            <div className="arcade-player-badge">PLAYER 01</div>
            <h1 className="arcade-main-title">PLAYER ACCESS REQUIRED</h1>
            <div className="arcade-dots-indicator">
              <span className="arcade-indicator arcade-indicator--inactive" />
              <span className="arcade-indicator arcade-indicator--active" />
              <span className="arcade-indicator arcade-indicator--active" />
            </div>

            <form onSubmit={submit} className="arcade-dark-form">
              <div className="arcade-dark-field">
                <label htmlFor="email" className="arcade-dark-label">PLAYER ID // EMAIL</label>
                <input
                  id="email"
                  type="email"
                  className="arcade-dark-input"
                  placeholder="player@arcade.edu"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                />
                {errors.email && <p className="arcade-dark-error">{errors.email}</p>}
              </div>

              <div className="arcade-dark-field">
                <label htmlFor="password" className="arcade-dark-label">PASSWORD // KEYCODE</label>
                <input
                  id="password"
                  type="password"
                  className="arcade-dark-input"
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  required
                />
                {errors.password && <p className="arcade-dark-error">{errors.password}</p>}
              </div>

              <label className="arcade-remember">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData({ ...data, remember: e.target.checked })}
                  className="arcade-checkbox"
                />
                <span>Remember Player</span>
              </label>

              <button type="submit" className="arcade-start-btn" disabled={processing}>
                {processing ? "LOADING..." : "PRESS TO START"}
              </button>
            </form>

            <div className="arcade-footer-links">
              {canResetPassword && (
                <RouterLink to="/forgot-password" className="arcade-footer-link">
                  Forgot Keycode?
                </RouterLink>
              )}
              <RouterLink to="/register" className="arcade-footer-link">
                New Player? Register
              </RouterLink>
            </div>

            {errors.general && <p className="arcade-dark-error text-center">{errors.general}</p>}

            <p className="arcade-insert-coin">INSERT COIN PLEASE</p>
          </div>
        </div>

        {/* Bottom Decorative Circles */}
        <div className="arcade-bottom-circles">
          <span className="arcade-circle arcade-circle--pink" />
          <span className="arcade-circle arcade-circle--mint" />
          <span className="arcade-circle arcade-circle--yellow" />
          <span className="arcade-circle arcade-circle--cyan" />
        </div>
      </div>
    </>
  );
}
