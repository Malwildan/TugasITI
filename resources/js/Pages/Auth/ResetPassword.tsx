import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isValidSession, setIsValidSession] = useState(true);

    useEffect(() => {
        // Check if user came from a valid reset link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setIsValidSession(false);
            }
        };
        checkSession();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== passwordConfirmation) {
            setError("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters!");
            return;
        }

        setProcessing(true);

        const { error: updateError } = await supabase.auth.updateUser({
            password: password,
        });

        setProcessing(false);

        if (updateError) {
            setError(updateError.message);
            return;
        }

        setSuccess(true);

        // Redirect to login after 3 seconds
        setTimeout(() => {
            navigate("/login");
        }, 3000);
    };

    return (
        <>
            <Head title="Reset Password" />

            <div className="login-arcade-bg">
                {/* Outer Card - Pastel gradient border */}
                <div className="arcade-outer-card">
                    {/* Header Bar */}
                    <div className="arcade-header-bar">
                        <span className="arcade-header-title">STUDENT ARCADE</span>
                    </div>

                    {/* Inner Dark Panel */}
                    <div className="arcade-inner-panel">
                        <div className="arcade-player-badge">NEW KEYCODE</div>
                        <h1 className="arcade-main-title">RESET YOUR KEYCODE</h1>
                        <div className="arcade-dots-indicator">
                            <span className="arcade-indicator arcade-indicator--inactive" />
                            <span className="arcade-indicator arcade-indicator--inactive" />
                            <span className="arcade-indicator arcade-indicator--active" />
                        </div>

                        {!isValidSession ? (
                            <div className="arcade-error-message">
                                <p className="arcade-error-text">
                                    ⚠️ INVALID OR EXPIRED LINK ⚠️
                                </p>
                                <p className="arcade-error-subtext">
                                    This password reset link is invalid or has expired.
                                    Please request a new one.
                                </p>
                                <RouterLink to="/forgot-password" className="arcade-start-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '1.5rem' }}>
                                    REQUEST NEW LINK
                                </RouterLink>
                            </div>
                        ) : success ? (
                            <div className="arcade-success-message">
                                <p className="arcade-success-text">
                                    ✨ PASSWORD UPDATED! ✨
                                </p>
                                <p className="arcade-success-subtext">
                                    Your keycode has been reset successfully.
                                    Redirecting to login...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="arcade-dark-form">
                                <p className="arcade-instruction-text">
                                    Enter your new keycode below.
                                </p>

                                <div className="arcade-dark-field">
                                    <label htmlFor="password" className="arcade-dark-label">NEW KEYCODE // PASSWORD</label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="arcade-dark-input"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="arcade-dark-field">
                                    <label htmlFor="password_confirmation" className="arcade-dark-label">CONFIRM KEYCODE</label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        className="arcade-dark-input"
                                        placeholder="••••••••"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && <p className="arcade-dark-error">{error}</p>}

                                <button type="submit" className="arcade-start-btn" disabled={processing}>
                                    {processing ? "UPDATING..." : "SET NEW KEYCODE"}
                                </button>
                            </form>
                        )}

                        <div className="arcade-footer-links">
                            <RouterLink to="/login" className="arcade-footer-link">
                                ← Back to Login
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
