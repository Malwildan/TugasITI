import React from 'react';

// Minimal Head replacement: sets document.title via effect
export function Head({ title }: { title?: string; children?: React.ReactNode }) {
  React.useEffect(() => {
    if (title) document.title = title;
  }, [title]);
  return <>{/* no-op */}</>;
}

// Minimal Link replacement: use regular anchor or react-router Link when available
type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};
export function Link({ href, children, ...rest }: LinkProps) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

// No-op router helpers
export const router = {
  get: (_href: string) => {},
  post: (_href: string, _data?: any) => {},
  put: (_href: string, _data?: any) => {},
  patch: (_href: string, _data?: any) => {},
  delete: (_href: string) => {},
};

// No-op useForm hook returning basic state
export function useForm<T extends Record<string, any>>(initial: T) {
  const [data, setData] = React.useState<T>(initial);
  const [processing, setProcessing] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  return {
    data,
    setData,
    processing,
    errors,
    post: (_href: string) => setProcessing(true),
    put: (_href: string) => setProcessing(true),
    patch: (_href: string) => setProcessing(true),
    delete: (_href: string) => setProcessing(true),
    reset: (..._fields: (keyof T)[]) => setData(initial),
  };
}

// usePage hook - returns empty props and auth by default
export function usePage<T = any>() {
  return {
    props: {} as T,
    url: window.location.pathname,
    component: '',
    version: null,
  };
}
