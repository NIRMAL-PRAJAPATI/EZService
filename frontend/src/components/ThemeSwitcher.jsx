import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { getThemePreference, setThemePreference, onThemeChange } from '../lib/theme';

const OPTIONS = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

/** Light / Dark / System picker. Saved on this device. */
export default function ThemeSwitcher() {
  const [pref, setPref] = useState(getThemePreference());
  useEffect(() => onThemeChange(setPref), []);

  return (
    <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Theme">
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = pref === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setThemePreference(id)}
            className={`relative flex flex-col items-center gap-2 rounded-sm border px-3 py-4 text-sm font-medium transition-colors ${
              active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {/* Mini preview of the theme */}
            <span
              aria-hidden="true"
              className={`flex h-10 w-16 items-end gap-1 rounded-sm border p-1.5 ${
                id === 'dark' ? 'border-[#3d404d] bg-[#1a1b20]' : id === 'light' ? 'border-[#e5e7eb] bg-[#ffffff]' : 'border-[#9ca3af] bg-[linear-gradient(135deg,#ffffff_50%,#1a1b20_50%)]'
              }`}
            >
              <span className="h-2 w-6 rounded-sm bg-[#6366f1]" />
              <span className={`h-1.5 w-4 rounded-sm ${id === 'dark' ? 'bg-[#3d404d]' : 'bg-[#e5e7eb]'}`} />
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </span>
            {active && <Check className="absolute right-2 top-2 h-4 w-4 text-indigo-500" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
