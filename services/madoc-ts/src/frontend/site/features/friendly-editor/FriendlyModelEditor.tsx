import { Preset, Runtime } from '@atlas-viewer/atlas';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PARAGRAPHS_PROFILE } from '../../../../extensions/capture-models/Paragraphs/Paragraphs.helpers';
import { slotConfig as paragraphsSlotConfig } from '../../../../extensions/capture-models/Paragraphs/Paragraphs.slots';
import { ViewReadOnlyAnnotation } from '../../../shared/atlas/ViewReadOnlyAnnotation';
import { EditorRenderingConfig, EditorSlots } from '../../../shared/capture-models/new/components/EditorSlots';
import {
  RevisionProviderFeatures,
  RevisionProviderWithFeatures,
} from '../../../shared/capture-models/new/components/RevisionProviderWithFeatures';
import { CoreModelEditorProps } from '../../../shared/capture-models/new/CoreModelEditor';
import { DynamicVaultContext } from '../../../shared/capture-models/new/DynamicVaultContext';
import { EditorContentViewer } from '../../../shared/capture-models/new/EditorContent';
import { RevisionRequest } from '../../../shared/capture-models/types/revision-request';
import { useLocalStorage } from '../../../shared/hooks/use-local-storage';
import { RouteContext } from '../../hooks/use-route-context';
import { CanvasHighlightedRegions } from '../canvas/CanvasHighlightedRegions';
import { CanvasModelUserStatus } from '../canvas/CanvasModelUserStatus';
import { FriendlyBackToTasks } from './FriendlyBackToTasks';
import { FriendlyChoice } from './FriendlyChoice';
import { FriendlyPostSubmission } from './FriendlyPostSubmission';
import { FriendlySubmitButton } from './FriendlySubmitButton';
import { FriendlyViewerControls } from './FriendlyViewerControls';

export type FriendlyModelEditorProps = Pick<
  CoreModelEditorProps,
  | 'revision'
  | 'captureModel'
  | 'annotationTheme'
  | 'readOnlyAnnotations'
  | 'canContribute'
  | 'allowMultiple'
  | 'forkMode'
  | 'autosave'
  | 'disableSaveForLater'
  | 'disableNextCanvas'
  | 'enableRotation'
  | 'hideViewerControls'
  | 'preventFurtherSubmission'
  | 'markedAsUnusable'
  | 'visualConfig'
  | 'updateClaim'
  | 'modelRefetch'
> & {
  canvasId: number;
};

const friendlyComponents: Partial<EditorRenderingConfig> = {
  Choice: FriendlyChoice,
  SubmitButton: FriendlySubmitButton,
};

const profileConfig = { [PARAGRAPHS_PROFILE]: paragraphsSlotConfig };

// The accent follows the site theme where one is set, falling back to Madoc's primary colour.
const accentStyle = {
  '--fe-accent': 'var(--madoc-accent, rgb(74 103 228))',
  '--fe-accent-soft': 'color-mix(in srgb, var(--fe-accent) 12%, white)',
} as React.CSSProperties;

export function FriendlyModelEditor({
  canvasId,
  revision,
  captureModel,
  annotationTheme,
  readOnlyAnnotations,
  canContribute,
  allowMultiple,
  forkMode,
  autosave,
  disableSaveForLater,
  disableNextCanvas,
  enableRotation,
  hideViewerControls,
  preventFurtherSubmission,
  markedAsUnusable,
  visualConfig,
  updateClaim,
  modelRefetch,
}: FriendlyModelEditorProps) {
  const { t } = useTranslation();
  const runtime = useRef<Runtime>(undefined);
  const [showPanWarning, setShowPanWarning] = useLocalStorage('pan-warning', false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const features = useMemo<RevisionProviderFeatures>(
    () => ({ preventMultiple: !allowMultiple, forkMode, autosave }),
    [allowMultiple, forkMode, autosave]
  );

  const onViewerCreated = useCallback((preset: Preset) => {
    runtime.current = preset.runtime;
  }, []);

  const onPanInSketchMode = useCallback(() => {
    setShowPanWarning(true);
    setTimeout(() => setShowPanWarning(false), 3000);
  }, [setShowPanWarning]);

  const onAfterSave = useCallback(
    async (ctx: { revisionRequest: RevisionRequest; context: RouteContext }) => {
      await updateClaim(ctx);
      if (modelRefetch) {
        await modelRefetch();
      }
      if (ctx.revisionRequest.revision.status !== 'draft') {
        setHasSubmitted(true);
      }
    },
    [modelRefetch, updateClaim]
  );

  return (
    <DynamicVaultContext canvasId={canvasId}>
      <RevisionProviderWithFeatures
        key={revision}
        features={features}
        revision={revision}
        captureModel={captureModel}
        visualConfig={visualConfig}
        annotationTheme={annotationTheme}
        slotConfig={{
          editor: {
            allowEditing: !preventFurtherSubmission,
            deselectRevisionAfterSaving: true,
            profileConfig,
            saveOnNavigate: false,
            disableSaveForLater,
          },
          components: friendlyComponents,
        }}
      >
        <CanvasHighlightedRegions />
        <div
          className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(20rem,1fr)]"
          style={accentStyle}
          data-friendly-editor
        >
          <div className="relative h-[55vh] min-w-0 overflow-hidden rounded-lg bg-neutral-800 lg:h-[78vh]">
            <EditorContentViewer
              canvasId={canvasId}
              height="100%"
              onCreated={onViewerCreated}
              onPanInSketchMode={onPanInSketchMode}
            >
              {(readOnlyAnnotations || []).map(annotation => (
                <ViewReadOnlyAnnotation key={annotation.id} {...annotation} />
              ))}
            </EditorContentViewer>

            {hideViewerControls ? null : (
              <FriendlyViewerControls
                onZoomIn={() => runtime.current?.world.zoomIn()}
                onZoomOut={() => runtime.current?.world.zoomOut()}
                onHome={() => runtime.current?.world.goHome()}
                onRotate={enableRotation ? () => runtime.current?.world.rotateBy(90) : undefined}
              />
            )}

            {showPanWarning ? (
              <p className="absolute left-4 top-4 z-10 m-0 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                {t('Hold space to pan and zoom')}
              </p>
            ) : null}
          </div>

          <aside className="madoc-capture-model flex min-w-0 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 lg:max-h-[78vh] lg:overflow-y-auto">
            <CanvasModelUserStatus />
            {preventFurtherSubmission ? (
              <div className="flex flex-col gap-2" role="status">
                <h2 className="m-0 text-xl font-semibold text-gray-900">
                  {markedAsUnusable ? t('You have marked this as unusable') : t('Task is complete!')}
                </h2>
                {markedAsUnusable ? null : (
                  <p className="m-0 text-gray-600">
                    {t('Thank you for your submission.')} {t('You can continue working on another canvas.')}
                  </p>
                )}
              </div>
            ) : hasSubmitted ? (
              <FriendlyPostSubmission onContinue={() => setHasSubmitted(false)} disableNextCanvas={disableNextCanvas} />
            ) : canContribute && captureModel ? (
              <>
                <FriendlyBackToTasks />
                <div className="min-w-0 text-[15px]">
                  <EditorSlots.TopLevelEditor />
                </div>
                <EditorSlots.SubmitButton afterSave={onAfterSave} />
              </>
            ) : (
              <p className="m-0 text-gray-600">{t('Loading your model')}</p>
            )}
          </aside>
        </div>
      </RevisionProviderWithFeatures>
    </DynamicVaultContext>
  );
}
