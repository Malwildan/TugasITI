import { Head } from "@inertiajs/react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link as RouterLink } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        setProcessing(false);

        if (resetError) {
            setError(resetError.message);
            return;
        }

        setSuccess(true);
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="login-arcade-bg">
                {/* Outer Card - Pastel gradient border */}
                <div className="arcade-outer-card">
                    {/* Header Bar */}
                    <div className="arcade-header-bar">
                        <span className="arcade-header-title">STUDENT ARCADE</span>
                    </div>

                    {/* Inner Dark Panel */}
                    <div className="arcade-inner-panel">
                        <div className="arcade-player-badge">PASSWORD RESET</div>
                        <h1 className="arcade-main-title">FORGOT YOUR KEYCODE?</h1>
                        <div className="arcade-dots-indicator">
                            <span className="arcade-indicator arcade-indicator--active" />
                            <span className="arcade-indicator arcade-indicator--inactive" />
                            <span className="arcade-indicator arcade-indicator--inactive" />
                        </div>

                        {success ? (
                            <div className="arcade-success-message">
                                <p className="arcade-success-text">
                                    ✨ RESET LINK SENT! ✨
                                </p>
                                <p className="arcade-success-subtext">
                                    Check your email inbox for the password reset link.
                                    It may take a few minutes to arrive.
                                </p>
                                <RouterLink to="/login" className="arcade-start-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '1.5rem' }}>
                                    BACK TO LOGIN
                                </RouterLink>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="arcade-dark-form">
                                <p className="arcade-instruction-text">
                                    Enter your Player ID (email) and we'll send you a reset link.
                                </p>

                                <div className="arcade-dark-field">
                                    <label htmlFor="email" className="arcade-dark-label">PLAYER ID // EMAIL</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="arcade-dark-input"
                                        placeholder="player@arcade.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                {error && <p className="arcade-dark-error">{error}</p>}

                                <button type="submit" className="arcade-start-btn" disabled={processing}>
                                    {processing ? "SENDING..." : "SEND RESET LINK"}
                                </button>
                            </form>
                        )}

                        <div className="arcade-footer-links">
                            <RouterLink to="/login" className="arcade-footer-link">
                                ← Back to Login
                            </RouterLink>
                            <RouterLink to="/register" className="arcade-footer-link">
                                New Player? Register
                            </RouterLink>
                        </div>

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
