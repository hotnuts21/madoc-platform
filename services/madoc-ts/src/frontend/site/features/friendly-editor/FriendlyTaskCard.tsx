import React from 'react';
import { useTranslation } from 'react-i18next';
import { FriendlyTaskStatus } from './friendly-task-status';

interface FriendlyTaskCardProps {
  label: string;
  description?: string;
  status: FriendlyTaskStatus;
  onSelect: () => void;
}

const statusChipClasses: Record<FriendlyTaskStatus, string> = {
  'not-started': 'bg-[var(--fe-accent-soft)] text-[var(--fe-accent)]',
  draft: 'bg-amber-100 text-amber-800',
  'in-review': 'bg-amber-100 text-amber-800',
  done: 'bg-emerald-100 text-emerald-800',
};

export function FriendlyTaskCard({ label, description, status, onSelect }: FriendlyTaskCardProps) {
  const { t } = useTranslation();
  const statusLabels: Record<FriendlyTaskStatus, string> = {
    'not-started': t('Start'),
    draft: t('Continue'),
    'in-review': t('In review'),
    done: t('Done'),
  };
  const initial = label.trim().charAt(0).toUpperCase() || '•';

  return (
    <button
      type="button"
      onClick={onSelect}
      className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-[var(--fe-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fe-accent)]"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--fe-accent-soft)] text-lg font-bold text-[var(--fe-accent)]"
      >
        {initial}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold leading-snug text-gray-900">{label}</span>
        {description ? <span className="mt-0.5 block text-sm leading-snug text-gray-600">{description}</span> : null}
      </span>
      <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${statusChipClasses[status]}`}>
        {status === 'done' ? '✓ ' : ''}
        {statusLabels[status]}
      </span>
    </button>
  );
}
