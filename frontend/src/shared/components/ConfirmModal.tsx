import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data?: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  hasInput?: boolean;
  inputPlaceholder?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'danger',
  hasInput = false,
  inputPlaceholder = 'Enter reason...'
}) => {
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    if (isOpen) setInputValue('');
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
          >
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                  type === 'danger' ? "bg-red-50 text-red-500 shadow-red-500/10" :
                  type === 'warning' ? "bg-orange-50 text-orange-500 shadow-orange-500/10" :
                  "bg-blue-50 text-blue-500 shadow-blue-500/10"
                )}>
                  <AlertTriangle size={24} />
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-paper rounded-xl transition-colors text-ink/20 hover:text-ink"
                >
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-ink mb-3">{title}</h3>
              <p className="text-sm leading-relaxed text-ink/50 font-medium">
                {message}
              </p>

              {hasInput && (
                <div className="mt-8 space-y-3">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={inputPlaceholder}
                    rows={4}
                    className="w-full px-5 py-4 bg-paper border border-black/5 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-accent/5 focus:border-accent outline-none transition-all duration-300 resize-none leading-relaxed"
                  />
                </div>
              )}

              <div className="mt-10 flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 bg-paper hover:bg-ink/5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40 transition-all duration-300"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm(inputValue);
                    onClose();
                  }}
                  disabled={hasInput && !inputValue.trim()}
                  className={cn(
                    "flex-1 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-500 shadow-xl active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:scale-100 disabled:shadow-none",
                    type === 'danger' ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" :
                    type === 'warning' ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20" :
                    "bg-accent hover:bg-accent/90 shadow-accent/20"
                  )}
                >
                  {confirmText}
                </button>
              </div>
            </div>
            
            <div className="h-2 w-full bg-gradient-to-r from-transparent via-ink/5 to-transparent opacity-50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
