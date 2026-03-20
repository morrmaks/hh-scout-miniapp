export type ToastVariant = 'default' | 'error' | 'success' | 'warning';

export type ToastPosition =
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-bottom'
  | 'left-top'
  | 'right-bottom'
  | 'right-top'
  | 'top-center'
  | 'top-left'
  | 'top-right';

export interface Toast {
  duration?: number;
  id: number;
  message: string;
  position?: ToastPosition;
  state?: 'closing' | 'open';
  title?: string;
  variant?: ToastVariant;
}
