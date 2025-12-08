import '../css/app.css';
import '../css/stat-lab.css';
import '../css/classmates.css';
import '../css/memory-reel.css';
import '@/lib/route'; // Initialize route() shim globally
import { createRoot } from 'react-dom/client';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from '@/lib/auth';

// Pages
import Dashboard from './Pages/Dashboard';
import Classmates from './Pages/Classmates';
import StatLab from './Pages/StatLab';
import MemoryReel from './Pages/MemoryReel';
import Continue from './Pages/Continue';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import VerifyEmail from './Pages/Auth/VerifyEmail';
import ConfirmPassword from './Pages/Auth/ConfirmPassword';
import ProfileEdit from './Pages/Profile/Edit';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route
                        path="/"
                        element={<Login status={null as any} canResetPassword={true} />}
                    />
                    <Route
                        path="/login"
                        element={<Login status={null as any} canResetPassword={true} />}
                    />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword status={null as any} />} />
                    <Route path="/reset-password" element={<ResetPassword token="" email="" />} />
                    <Route path="/verify-email" element={<VerifyEmail status={undefined} />} />
                    <Route path="/confirm-password" element={<ConfirmPassword />} />
                    <Route path="/welcome" element={<Continue />} />

                    {/* Protected */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/classmates"
                        element={
                            <ProtectedRoute>
                                <Classmates />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/stat-lab"
                        element={
                            <ProtectedRoute>
                                <StatLab />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/memory-reel"
                        element={
                            <ProtectedRoute>
                                <MemoryReel />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/continue"
                        element={
                            <ProtectedRoute>
                                <Continue />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile/edit"
                        element={
                            <ProtectedRoute>
                                {
                                    (
                                        <ProfileEdit
                                            auth={{ user: {} as any }}
                                            mustVerifyEmail={false}
                                            status={undefined}
                                        />
                                    ) as any
                                }
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

const el = document.getElementById('root');
if (!el) {
    document.body.innerHTML = '<div style="padding:20px;color:red">Error: #root element not found in index.html</div>';
    throw new Error('Root element not found');
}

try {
    createRoot(el).render(<App />);
} catch (error) {
    console.error('React render error:', error);
    document.body.innerHTML = `<div style="padding:20px;color:red">React render error: ${error}</div>`;
}
