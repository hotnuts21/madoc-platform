import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { Revisions } from '../../../shared/capture-models/editor/stores/revisions/index';
import { EditorRenderingConfig, useSlotContext } from '../../../shared/capture-models/new/components/EditorSlots';
import { useDeselectRevision } from '../../../shared/capture-models/new/hooks/use-deselect-revision';
import { useViewerSaving } from '../../../shared/hooks/use-viewer-saving';
import { useRouteContext } from '../../hooks/use-route-context';

type SaveStatus = 'draft' | 'submitted';

/**
 * Submits directly, without the preview pop-up. Saving a draft returns the
 * volunteer to the task list, where the task shows as "Continue".
 */
export const FriendlySubmitButton: EditorRenderingConfig['SubmitButton'] = ({ afterSave, canSubmit = true }) => {
  const { t } = useTranslation();
  const routeContext = useRouteContext();
  const { disableSaveForLater = false } = useSlotContext().configuration;
  const currentRevision = Revisions.useStoreState(s => s.currentRevision);
  const deselectRevision = useDeselectRevision();
  const updateFunction = useViewerSaving(
    afterSave
      ? async revisionRequest => {
          await afterSave({ revisionRequest, context: routeContext });
        }
      : undefined
  );

  const [saveRevision, { isLoading, isError, reset }] = useMutation(async (status: SaveStatus) => {
    if (!currentRevision) {
      throw new Error(t('Unable to save your submission'));
    }
    await updateFunction(currentRevision, status);
  });

  if (!currentRevision) {
    return null;
  }

  const save = (status: SaveStatus) => {
    reset();
    saveRevision(status, { throwOnError: true })
      .then(() => deselectRevision())
      .catch(() => {
        // The error is shown from the mutation state.
      });
  };

  return (
    <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
      {isError ? (
        <p role="alert" className="m-0 text-sm font-semibold text-red-700">
          {t('Error - Unable to save your submission')}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        {!disableSaveForLater ? (
          <button
            type="button"
            data-cy="save-later-button"
            disabled={isLoading}
            onClick={() => save('draft')}
            className="rounded-lg px-3 py-2.5 font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
          >
            {t('Save for later')}
          </button>
        ) : null}
        <button
          type="button"
          data-cy="publish-button"
          data-testid="publish-button"
          disabled={isLoading || !canSubmit}
          onClick={() => save('submitted')}
          className="flex-1 rounded-lg bg-[var(--fe-accent)] px-4 py-2.5 font-bold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fe-accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? t('Saving...') : t('Submit')}
        </button>
      </div>
    </div>
  );
};
