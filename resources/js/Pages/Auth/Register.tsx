import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        if (data.password !== data.password_confirmation) {
            setProcessing(false);
            setErrors({ password_confirmation: 'Passwords do not match' });
            return;
        }
        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: { name: data.name },
            },
        });
        setProcessing(false);
        if (error) {
            const msg = error.message || 'Registration failed';
            if (msg.toLowerCase().includes('email')) setErrors((p) => ({ ...p, email: msg }));
            else setErrors((p) => ({ ...p, general: msg }));
            return;
        }
        navigate('/dashboard');
    };

    return (
        <>
            <Head title="Register" />

            <div className="login-arcade-bg">
                {/* Outer Card - Pastel gradient border */}
                <div className="arcade-outer-card">
          {/* Header Bar */}
          <div className="arcade-header-bar">
            <span className="arcade-header-title">STUDENT ARCADE</span>
          </div>                    {/* Inner Dark Panel */}
                    <div className="arcade-inner-panel">
                        <div className="arcade-player-badge">NEW CHALLENGER</div>
                        <h1 className="arcade-main-title">INSERT CREDITS TO REGISTER</h1>
                        <div className="arcade-dots-indicator">
                            <span className="arcade-indicator arcade-indicator--inactive" />
                            <span className="arcade-indicator arcade-indicator--inactive" />
                            <span className="arcade-indicator arcade-indicator--active" />
                        </div>

                        <form onSubmit={submit} className="arcade-dark-form">
                            <div className="arcade-dark-field">
                                <label htmlFor="name" className="arcade-dark-label">PLAYER NAME // ID</label>
                                <input
                                    id="name"
                                    type="text"
                                    className="arcade-dark-input"
                                    placeholder="your.name"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    required
                                />
                                {errors.name && <p className="arcade-dark-error">{errors.name}</p>}
                            </div>

                            <div className="arcade-dark-field">
                                <label htmlFor="email" className="arcade-dark-label">EMAIL ADDRESS // KEYCODE</label>
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
                                <label htmlFor="password" className="arcade-dark-label">PASSWORD // SECRET CODE</label>
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

                            <div className="arcade-dark-field">
                                <label htmlFor="password_confirmation" className="arcade-dark-label">CONFIRM // RE-ENTER</label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    className="arcade-dark-input"
                                    placeholder="••••••••"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData({ ...data, password_confirmation: e.target.value })
                                    }
                                    required
                                />
                                {errors.password_confirmation && <p className="arcade-dark-error">{errors.password_confirmation}</p>}
                            </div>

                            <button type="submit" className="arcade-start-btn" disabled={processing}>
                                {processing ? "LOADING..." : "PRESS TO JOIN"}
                            </button>
                        </form>

                        <div className="arcade-footer-links">
                            <RouterLink to="/login" className="arcade-footer-link">
                                Already a Player? Login
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
