import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const VARIANTS = {
  primary: 'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700 disabled:bg-indigo-300',
  secondary: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:text-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300',
  'danger-outline': 'bg-white text-red-600 border border-red-200 hover:bg-red-50 disabled:text-red-300',
  ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50 disabled:text-gray-400',
  success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300',
};

const SIZES = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-[15px] gap-2',
  lg: 'h-12 px-5 text-base gap-2',
};

export function buttonClasses({ variant = 'primary', size = 'md', block = false, className = '' } = {}) {
  return [
    'inline-flex items-center justify-center rounded-sm font-medium tracking-wide transition-colors select-none',
    'disabled:cursor-not-allowed',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    block ? 'w-full' : '',
    className,
  ].join(' ');
}

/**
 * Button / link-button. Pass `to` for a router link, `href` for a plain link.
 * variant: primary | secondary | danger | danger-outline | ghost | success
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  icon: Icon,
  to,
  href,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}) {
  const classes = buttonClasses({ variant, size, block, className });
  const content = (
    <>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  );
}
