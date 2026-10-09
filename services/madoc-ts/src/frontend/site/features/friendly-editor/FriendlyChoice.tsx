import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../../../shared/capture-models/editor/hooks/useNavigation';
import { useModelTranslation } from '../../../shared/capture-models/hooks/use-model-translation';
import { EditorRenderingConfig } from '../../../shared/capture-models/new/components/EditorSlots';
import { FriendlyTaskCard } from './FriendlyTaskCard';
import { getFriendlyTaskStatus } from './friendly-task-status';

interface ChoiceItem {
  id: string;
  label?: string;
  description?: string;
}

export const FriendlyChoice: EditorRenderingConfig['Choice'] = () => {
  const { t } = useTranslation();
  const { t: tModel } = useModelTranslation();
  const [currentView, { pop, push, idStack, revisions }] = useNavigation();

  if (!currentView || currentView.type === 'model') {
    return null;
  }

  const items = currentView.items as ChoiceItem[];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="m-0 text-xl font-semibold text-gray-900">{t('How would you like to help?')}</h2>
        <p className="mb-0 mt-1 text-sm text-gray-600">{t('Pick a task. You can come back for the others.')}</p>
      </div>

      {idStack.length > 0 ? (
        <button
          type="button"
          onClick={() => pop()}
          className="self-start text-sm font-semibold text-[var(--fe-accent)] hover:underline"
        >
          ← {t('back')}
        </button>
      ) : null}

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {items.map(item => (
          <li key={item.id}>
            <FriendlyTaskCard
              label={item.label ? tModel(item.label) : t('Untitled task')}
              description={item.description ? tModel(item.description) : undefined}
              status={getFriendlyTaskStatus(revisions[item.id])}
              onSelect={() => push(item.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
