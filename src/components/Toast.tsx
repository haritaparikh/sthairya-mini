import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const typeStyles = {
  success: 'bg-success/15 border-success/30 text-success',
  error: 'bg-error/15 border-error/30 text-error',
  info: 'bg-accent-purple/15 border-accent-purple/30 text-accent-purple',
};

export default function Toast({ message, type = 'info', onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] border rounded-2xl px-5 py-3 text-sm font-medium
        transition-all duration-300 ${typeStyles[type]}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
    >
      {message}
    </div>
  );
}
