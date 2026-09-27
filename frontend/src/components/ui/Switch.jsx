/** Accessible on/off switch. */
export default function Switch({ checked, onChange, disabled, label, size = 'md' }) {
  const track = size === 'sm' ? 'h-6 w-10' : 'h-7 w-12';
  const knob = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const move = size === 'sm' ? 'translate-x-4' : 'translate-x-5';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${track} ${checked ? 'bg-indigo-500' : 'bg-gray-300'}`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-1 rounded-full bg-[#fff] shadow-sm transition-transform ${knob} ${checked ? move : 'translate-x-0'}`}
      />
    </button>
  );
}
