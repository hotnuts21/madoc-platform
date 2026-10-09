import React from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleString } from '../../../shared/components/LocaleString';
import { useManifestStructure } from '../../../shared/hooks/use-manifest-structure';
import { HrefLink } from '../../../shared/utility/href-link';
import { useRelativeLinks } from '../../hooks/use-relative-links';
import { useRouteContext } from '../../hooks/use-route-context';

interface FriendlyPostSubmissionProps {
  onContinue: () => void;
  disableNextCanvas?: boolean;
}

export function FriendlyPostSubmission({ onContinue, disableNextCanvas }: FriendlyPostSubmissionProps) {
  const { t } = useTranslation();
  const { manifestId, canvasId } = useRouteContext();
  const { data: structure } = useManifestStructure(manifestId);
  const createLink = useRelativeLinks();

  const index = canvasId && structure ? structure.ids.indexOf(canvasId) : -1;
  const next =
    !disableNextCanvas && structure && index !== -1 && index < structure.items.length - 1
      ? structure.items[index + 1]
      : null;
  const nextLink = next ? createLink({ canvasId: next.id, subRoute: 'model' }) : null;

  return (
    <div className="flex flex-col gap-4" role="status">
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-800"
      >
        ✓
      </span>
      <div>
        <h2 className="m-0 text-xl font-semibold text-gray-900">{t("Thanks, that's submitted")}</h2>
        <p className="mb-0 mt-1 text-gray-600">{t('A reviewer will check your contribution.')}</p>
      </div>

      {next && nextLink ? (
        <HrefLink
          href={nextLink}
          onClick={onContinue}
          className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 rounded-lg border border-gray-200 p-2.5 text-gray-900 no-underline hover:border-[var(--fe-accent)]"
        >
          {next.thumbnail ? (
            <img src={next.thumbnail} alt="" className="aspect-[4/3] w-full rounded object-cover" />
          ) : (
            <span className="aspect-[4/3] w-full rounded bg-gray-100" />
          )}
          <span className="min-w-0">
            <span className="block font-semibold">{t('Keep going: next page')}</span>
            <LocaleString className="block truncate text-sm text-gray-600">{next.label}</LocaleString>
          </span>
        </HrefLink>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onContinue}
          className="rounded-lg border-2 border-gray-200 px-4 py-2.5 font-semibold text-gray-900 hover:border-gray-400"
        >
          {t('Another task on this page')}
        </button>
        {next && nextLink ? (
          <HrefLink
            href={nextLink}
            onClick={onContinue}
            className="flex-1 rounded-lg bg-[var(--fe-accent)] px-4 py-2.5 text-center font-bold text-white no-underline hover:opacity-90"
          >
            {t('Next page')}
          </HrefLink>
        ) : null}
      </div>
    </div>
  );
}
