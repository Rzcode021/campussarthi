import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast, type Toast as ToastType } from '../context/ToastContext';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast: ToastType) => {
        let bgColor, icon;
        
        switch (toast.type) {
          case 'success':
            bgColor = 'bg-success/20 border-success/30 text-success';
            icon = <CheckCircle size={20} />;
            break;
          case 'error':
            bgColor = 'bg-danger/20 border-danger/30 text-danger';
            icon = <XCircle size={20} />;
            break;
          case 'info':
          default:
            bgColor = 'bg-secondary/20 border-secondary/30 text-secondary';
            icon = <Info size={20} />;
            break;
        }

        return (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border bg-white shadow-xl transform transition-all duration-300 translate-y-0 opacity-100 ${bgColor}`}
          >
            {icon}
            <p className="font-bold text-sm text-heading pr-4">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-auto text-muted hover:text-heading transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
