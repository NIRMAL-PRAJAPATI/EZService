import { AlertTriangle, Inbox } from 'lucide-react';
import Button from './Button';

export function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, actionTo, onAction, className = '' }) {
  return (
    <div className={`flex flex-col items-center text-center px-6 py-12 ${className}`}>
      <div className="h-14 w-14 rounded-md bg-indigo-50 flex items-center justify-center mb-4">
        <Icon className="h-7 w-7 text-indigo-500" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 max-w-xs">{description}</p>}
      {actionLabel && (
        <Button className="mt-5" to={actionTo} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description = 'Please check your connection and try again.', onRetry, className = '' }) {
  return (
    <div className={`flex flex-col items-center text-center px-6 py-12 ${className}`} role="alert">
      <div className="h-14 w-14 rounded-md bg-red-50 flex items-center justify-center mb-4">
        <AlertTriangle className="h-7 w-7 text-red-500" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-xs">{description}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function InlineError({ children }) {
  if (!children) return null;
  return (
    <div className="flex items-start gap-2 rounded-sm bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
