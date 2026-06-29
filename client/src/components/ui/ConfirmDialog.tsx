import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#111827]/40"
        onClick={onCancel}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div className="relative z-10 w-full max-w-sm rounded-lg border border-[#e5e7eb] bg-white shadow-lg animate-fade-in">
        <div className="p-6">
          {/* Icon */}
          <div
            className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${
              isDanger ? 'bg-[#fef2f2]' : 'bg-[#fffbeb]'
            }`}
          >
            {isDanger ? (
              <Trash2 className="h-5 w-5 text-[#dc2626]" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-[#d97706]" />
            )}
          </div>

          {/* Content */}
          <h3 className="mb-2 text-base font-semibold text-[#111827]">{title}</h3>
          <p className="text-sm text-[#6b7280] leading-relaxed">{message}</p>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="secondary" size="sm" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant={isDanger ? 'danger' : 'primary'} size="sm" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
