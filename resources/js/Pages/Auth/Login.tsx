import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route("login"));
  };

  return (
    <>
      <Head title="Login" />

      <div className="login-arcade-wrapper">
        <div className="arcade-card">
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
                  onChange={(e) => setData("email", e.target.value)}
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
                  onChange={(e) => setData("password", e.target.value)}
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
                <Link href={route("password.request")} className="arcade-link">
                  Forgot password?
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
