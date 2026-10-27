import { useState } from 'react';

export function StatusPill({ published }) {
  return published ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" /> Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/14 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" /> Draft
    </span>
  );
}

export function ErrorNote({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
      {children}
    </p>
  );
}

// A destructive action that asks for confirmation inline instead of in a browser dialog.
export function ConfirmButton({ label, confirmLabel, question, onConfirm, className = '' }) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!asking) {
    return (
      <button type="button" className={`btn btn-ghost text-red-700 dark:text-red-300 ${className}`} onClick={() => setAsking(true)}>
        {label}
      </button>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2" role="group" aria-label={question}>
      <span className="text-sm text-muted">{question}</span>
      <button
        type="button"
        disabled={busy}
        className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
        onClick={async () => {
          setBusy(true);
          try {
            await onConfirm();
          } finally {
            setBusy(false);
            setAsking(false);
          }
        }}
      >
        {busy ? 'Working…' : confirmLabel}
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => setAsking(false)} disabled={busy}>
        Cancel
      </button>
    </span>
  );
}
