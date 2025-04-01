import { ToastContainer, toast } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
      }}
    />
  );
}

export { toast };
