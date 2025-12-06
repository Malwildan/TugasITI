// Minimal route() shim to replace Ziggy's route helper
// Maps Laravel route names to static paths

const routes: Record<string, string> = {
  dashboard: '/dashboard',
  login: '/login',
  register: '/register',
  'password.request': '/forgot-password',
  'password.reset': '/reset-password',
  'verification.notice': '/verify-email',
  'password.confirm': '/confirm-password',
  'profile.edit': '/profile/edit',
  logout: '/logout',
};

export function route(name: string, params?: Record<string, any>): string {
  const path = routes[name] ?? '/';
  if (!params) return path;
  // Replace route params like /reset-password/:token
  let result = path;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, String(value));
  }
  return result;
}

// Make it available globally for existing code that calls route() without import
(window as any).route = route;
