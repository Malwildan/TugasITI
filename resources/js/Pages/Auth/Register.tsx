import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
// Removed GuestLayout to avoid Laravel logo and outer wrappers
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

            <div className="min-h-screen w-full bg-gray-50 py-10">
                <div className="mx-auto max-w-2xl px-6">
                    <div className="arcade-panel">
                    <div className="mb-8 text-center">
                        <p className="text-xs tracking-widest text-gray-500">PLAYER SIGN-UP</p>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900">Join the Arcade</h1>
                        <p className="mt-1 text-sm text-gray-600">Create your account</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6 arcade-form">
                            <div className="arcade-field">
                                <label htmlFor="name" className="arcade-label">NAME</label>
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                className="arcade-input w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    required
                                />
                                <InputError message={errors.name} className="arcade-error" />
                            </div>

                            <div className="arcade-field">
                                <label htmlFor="email" className="arcade-label">EMAIL</label>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                className="arcade-input w-full"
                                    autoComplete="username"
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                    required
                                />
                                <InputError message={errors.email} className="arcade-error" />
                            </div>

                            <div className="arcade-field">
                                <label htmlFor="password" className="arcade-label">PASSWORD</label>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                className="arcade-input w-full"
                                    autoComplete="new-password"
                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                    required
                                />
                                <InputError message={errors.password} className="arcade-error" />
                            </div>

                            <div className="arcade-field">
                                <label htmlFor="password_confirmation" className="arcade-label">CONFIRM PASSWORD</label>
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                className="arcade-input w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData({ ...data, password_confirmation: e.target.value })
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="arcade-error"
                                />
                            </div>

                        <button type="submit" className="arcade-btn w-full" disabled={processing}>
                            Register
                        </button>
                    </form>

                    <div className="mt-4 text-center arcade-links">
                        <RouterLink to="/login" className="arcade-link">
                            Already registered?
                        </RouterLink>
                    </div>
                    {errors.general && (
                        <p className="arcade-error mt-2 text-center">{errors.general}</p>
                    )}
                    </div>
                </div>
            </div>
        </>
    );
}
