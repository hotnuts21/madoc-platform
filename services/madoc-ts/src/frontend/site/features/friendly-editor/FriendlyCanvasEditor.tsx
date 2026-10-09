import React, { useMemo } from 'react';
import { CaptureModelVisualSettings } from '../../../shared/capture-models/editor/components/CaptureModelVisualSettings/CaptureModelVisualSettings';
import { useApi } from '../../../shared/hooks/use-api';
import { useCurrentUser } from '../../../shared/hooks/use-current-user';
import { useLoadedCaptureModel } from '../../../shared/hooks/use-loaded-capture-model';
import { useReadOnlyAnnotations } from '../../../shared/hooks/use-read-only-annotations';
import { isEditingAnotherUsersRevision } from '../../../shared/utility/is-editing-another-users-revision';
import { useCanvasModel } from '../../hooks/use-canvas-model';
import { useCanvasUserTasks } from '../../hooks/use-canvas-user-tasks';
import { useContributionMode } from '../../hooks/use-contribution-mode';
import { useModelPageConfiguration } from '../../hooks/use-model-page-configuration';
import { useProjectAnnotationStyles } from '../../hooks/use-project-annotation-styles';
import { useProjectStatus } from '../../hooks/use-project-status';
import { useRouteContext } from '../../hooks/use-route-context';
import { CanvasSimpleEditor } from '../canvas/CanvasSimpleEditor';
import { useSiteConfiguration } from '../SiteConfigurationContext';
import { FriendlyModelEditor } from './FriendlyModelEditor';
import '../../../shared/capture-models/editor/bundle';

interface FriendlyCanvasEditorProps {
  revision?: string;
}

/**
 * Loads the same data as CanvasSimpleEditor and renders the friendly layout.
 *
 * Transcription mode, project preparation and editing someone else's revision
 * keep the classic editor until the friendly layout supports them.
 */
export function FriendlyCanvasEditor({ revision }: FriendlyCanvasEditorProps) {
  const { projectId, canvasId } = useRouteContext();
  const { data: projectModel } = useCanvasModel();
  const [{ captureModel }, , modelRefetch] = useLoadedCaptureModel(projectModel?.model?.id, undefined, canvasId);
  const { updateClaim, preventFurtherSubmission, canContribute, markedAsUnusable } = useCanvasUserTasks();
  const { isPreparing } = useProjectStatus();
  const annotationTheme = useProjectAnnotationStyles();
  const user = useCurrentUser(true);
  const config = useSiteConfiguration();
  const {
    disableSaveForLater = false,
    disableNextCanvas = false,
    enableRotation = false,
    enableTooltipDescriptions = false,
    hideViewerControls = false,
    enableAutoSave = false,
    preventMultipleUserSubmissionsPerResource = false,
  } = useModelPageConfiguration();
  const mode = useContributionMode();
  const api = useApi();
  const readOnlyAnnotations = useReadOnlyAnnotations(true);
  const isEditing = isEditingAnotherUsersRevision(captureModel, revision, user.user);

  const visualConfig = useMemo<Partial<CaptureModelVisualSettings>>(
    () => ({ descriptionTooltip: enableTooltipDescriptions }),
    [enableTooltipDescriptions]
  );

  if (mode === 'transcription' || isPreparing || isEditing) {
    return <CanvasSimpleEditor revision={revision} />;
  }

  if (api.getIsServer() || !canvasId || !projectId) {
    return null;
  }

  return (
    <FriendlyModelEditor
      canvasId={canvasId}
      revision={revision}
      captureModel={captureModel}
      annotationTheme={annotationTheme}
      readOnlyAnnotations={readOnlyAnnotations}
      canContribute={canContribute}
      allowMultiple={!preventMultipleUserSubmissionsPerResource}
      forkMode={!!config.project.forkMode}
      autosave={enableAutoSave}
      disableSaveForLater={disableSaveForLater}
      disableNextCanvas={disableNextCanvas}
      enableRotation={enableRotation}
      hideViewerControls={hideViewerControls}
      preventFurtherSubmission={preventFurtherSubmission}
      markedAsUnusable={markedAsUnusable}
      visualConfig={visualConfig}
      updateClaim={updateClaim}
      modelRefetch={modelRefetch}
    />
  );
}
