import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../../../shared/capture-models/editor/hooks/useNavigation';
import { Revisions } from '../../../shared/capture-models/editor/stores/revisions/index';
import { useModelTranslation } from '../../../shared/capture-models/hooks/use-model-translation';

/**
 * Same navigation rules as the classic BackToChoicesButton, shown as a task
 * heading with a link back to the task list.
 */
export function FriendlyBackToTasks() {
  const { t } = useTranslation();
  const { t: tModel } = useModelTranslation();
  const currentRevisionId = Revisions.useStoreState(s => s.currentRevisionId);
  const revisionSubtreePath = Revisions.useStoreState(s => s.revisionSubtreePath);
  const structure = Revisions.useStoreState(s => s.structure);
  const deselectRevision = Revisions.useStoreActions(a => a.deselectRevision);
  const [, { pop, idStack, structureMap }] = useNavigation();

  const willBeAutoNavigated = !structure || structure.type !== 'choice' || structure.items.length === 1;

  const isAtTopOfRevision = useMemo(() => {
    for (const [, , skip] of revisionSubtreePath || []) {
      if (!skip) {
        return false;
      }
    }
    return true;
  }, [revisionSubtreePath]);

  const backToTasks = useCallback(() => {
    if (idStack.length > 0 && currentRevisionId) {
      let nextId: string | undefined;
      const stack = [...idStack];
      while ((nextId = stack.pop())) {
        const next = structureMap[nextId];
        if (next && next.structure && next.structure.type === 'choice' && next.structure.items.length !== 1) {
          break;
        }
        pop();
      }
      deselectRevision({ revisionId: currentRevisionId });
    }
  }, [currentRevisionId, deselectRevision, idStack, pop, structureMap]);

  if (!currentRevisionId || willBeAutoNavigated || !isAtTopOfRevision || idStack.length === 0) {
    return null;
  }

  const current = structureMap[idStack[idStack.length - 1]];
  const label =
    current?.structure.label && current.structure.label !== 'Default' ? tModel(current.structure.label) : null;

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={backToTasks}
        className="self-start text-sm font-semibold text-[var(--fe-accent)] hover:underline"
      >
        ← {t('All tasks')}
      </button>
      {label ? <h2 className="m-0 text-xl font-semibold text-gray-900">{label}</h2> : null}
    </div>
  );
}
