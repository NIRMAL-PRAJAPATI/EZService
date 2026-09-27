import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// A label + value line with a copy button (UPI ID, account number, IFSC…)
export default function CopyRow({ label, value, mono = false }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  const copy = () => {
    navigator.clipboard
      ?.writeText(String(value))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  };
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-sm font-semibold text-gray-900 break-all ${mono ? 'font-mono tracking-wide' : ''}`}>{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 inline-flex items-center gap-1 rounded-sm px-2 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
