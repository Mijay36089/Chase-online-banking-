import React from 'react';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  icon?: React.ElementType;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  children,
  confirmLabel = 'Confirm', 
  cancelLabel = 'Cancel',
  variant = 'primary',
  icon,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const Icon = icon || (variant === 'danger' ? AlertTriangle : CheckCircle);

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby={children ? "confirm-modal-content" : "confirm-modal-desc"}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
        <div className="p-6 text-center flex-1 overflow-y-auto custom-scrollbar">
          <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${variant === 'danger' ? 'bg-red-100' : 'bg-blue-100'}`}>
            <Icon className={`h-6 w-6 ${variant === 'danger' ? 'text-red-600' : 'text-blue-600'}`} aria-hidden="true" />
          </div>
          <h3 className="text-lg leading-6 font-bold text-gray-900" id="confirm-modal-title">{title}</h3>
          
          {children ? (
            <div className="mt-4 w-full text-left" id="confirm-modal-content">
              {children}
            </div>
          ) : (
            <div className="mt-2 text-sm text-gray-500" id="confirm-modal-desc">
              {message}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-col-reverse sm:flex-row-reverse gap-2 shrink-0 border-t border-gray-100">
          <button
            type="button"
            disabled={isLoading}
            className={`w-full inline-flex justify-center items-center gap-2 rounded-lg border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isLoading ? 'opacity-70 cursor-wait' : ''
            } ${
              variant === 'danger' 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-[#117aca] hover:bg-blue-700 focus:ring-blue-500'
            }`}
            onClick={onConfirm}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;