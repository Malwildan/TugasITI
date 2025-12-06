import { Head } from "@inertiajs/react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function Login({ status, canResetPassword }: { status?: any; canResetPassword?: boolean }) {
  const navigate = useNavigate();
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
    navigate("/dashboard");
  };

  return (
    <>
      <Head title="Login" />

      <div className="min-h-screen w-full bg-gray-50 py-10">
        <div className="mx-auto max-w-2xl px-6">
          <div className="arcade-panel">
            <div className="arcade-nav">
              <span className="arcade-nav__title">Student Arcade</span>
              <div className="nav-ornament" aria-hidden="true">
                <span className="dot pink" />
                <span className="dot mint" />
                <span className="dot cyan" />
              </div>
            </div>

            <div className="arcade-heading">
              <p className="arcade-label-sm">PLAYER SIGN-IN</p>
              <h1 className="arcade-title">WELCOME BACK</h1>
              <p className="arcade-subtitle">ENTER YOUR CREDENTIALS</p>
            </div>

            <form onSubmit={submit} className="arcade-form">
              <div className="arcade-field">
                <label htmlFor="email" className="arcade-label">EMAIL</label>
                <input
                  id="email"
                  type="email"
                  className="arcade-input"
                  placeholder="player@arcade.edu"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                />
                {errors.email && (
                  <p className="arcade-error">{errors.email}</p>
                )}
              </div>

              <div className="arcade-field">
                <label htmlFor="password" className="arcade-label">PASSWORD</label>
                <input
                  id="password"
                  type="password"
                  className="arcade-input"
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  required
                />
                {errors.password && (
                  <p className="arcade-error">{errors.password}</p>
                )}
              </div>

              <button type="submit" className="arcade-btn" disabled={processing}>
                Login
              </button>
            </form>

            {canResetPassword && (
              <div className="arcade-links">
                <RouterLink to="/forgot-password" className="arcade-link">
                  Forgot password?
                </RouterLink>
              </div>
            )}
            <div className="arcade-links mt-2">
              <RouterLink to="/register" className="arcade-link">
                Create an account
              </RouterLink>
            </div>
            {errors.general && (
              <p className="arcade-error mt-2">{errors.general}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
