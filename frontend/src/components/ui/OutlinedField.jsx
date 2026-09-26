import { forwardRef } from 'react';

/**
 * The KnockNow outlined input: a bordered box with the label sitting on the
 * top border (same look as the Login/Register fields). Used by other forms so
 * every input in the app shares one style.
 */
const base =
  'block w-full pl-4 pr-3 py-3 text-base md:text-sm text-gray-800 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500';

const OutlinedField = forwardRef(function OutlinedField(
  { label, id, as = 'input', icon: Icon, error, hint, className = '', children, ...props },
  ref
) {
  const Tag = as;
  const fieldId = id || props.name;
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={fieldId} className="absolute left-3 -top-2.5 z-10 flex items-center gap-1 bg-white px-1 text-sm font-medium text-indigo-500">
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        {label}
      </label>
      <Tag ref={ref} id={fieldId} className={base} aria-invalid={error ? 'true' : undefined} {...props}>
        {children}
      </Tag>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
});

export default OutlinedField;
