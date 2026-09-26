import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Sticky page title bar with a back arrow, used by focused flows
 * (booking, instant service, tracking) and inner pages on mobile.
 */
export default function PageHeader({ title, subtitle, backTo, onBack, right, sticky = true, className = '' }) {
  const navigate = useNavigate();
  const goBack = () => {
    if (onBack) return onBack();
    if (backTo) return navigate(backTo);
    if (window.history.length > 1) return navigate(-1);
    return navigate('/');
  };

  return (
    <header className={`${sticky ? 'sticky top-0 md:top-16 z-30' : ''} bg-white/95 backdrop-blur border-b border-gray-200 ${className}`}>
      <div className="max-w-3xl mx-auto h-14 px-2 sm:px-4 flex items-center gap-1">
        <button type="button" onClick={goBack} className="h-11 w-11 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100" aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 truncate -mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
