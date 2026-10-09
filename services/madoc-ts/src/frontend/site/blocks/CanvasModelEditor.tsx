import React from 'react';
import { blockEditorFor } from '../../../extensions/page-blocks/block-editor-for';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import { useLocationQuery } from '../../shared/hooks/use-location-query';
import { useProjectTemplate } from '../../shared/hooks/use-project-template';
import { useUser } from '../../shared/hooks/use-site';
import { useCanvasNavigation } from '../hooks/use-canvas-navigation';
import { useProject } from '../hooks/use-project';
import { useProjectStatus } from '../hooks/use-project-status';
import { CanvasSimpleEditor } from '../features/canvas/CanvasSimpleEditor';
import { FriendlyCanvasEditor } from '../features/friendly-editor/FriendlyCanvasEditor';
import { useFriendlyEditor } from '../features/friendly-editor/use-friendly-editor';

export const CanvasModelEditor: React.FC = () => {
  const { showCanvasNavigation } = useCanvasNavigation();
  const { revision } = useLocationQuery();
  const user = useUser();
  const { data: project } = useProject();
  const template = useProjectTemplate(project?.template);
  const CustomEditor = template?.components?.customEditor;
  const { isPreparing } = useProjectStatus();
  const [isSegmentation] = useLocalStorage('segmentation-prepare', false);
  const isFriendly = useFriendlyEditor();

  if (!showCanvasNavigation || !user) {
    return null;
  }

  if (CustomEditor) {
    return <CustomEditor />;
  }

  if (isFriendly && !isPreparing) {
    return <FriendlyCanvasEditor revision={revision} />;
  }

  return <CanvasSimpleEditor revision={revision} isSegmentation={isSegmentation && isPreparing} />;
};

blockEditorFor(CanvasModelEditor, {
  type: 'default.CanvasModelEditor',
  label: 'Canvas model editor',
  requiredContext: ['project', 'manifest', 'canvas'],
  anyContext: ['canvas'],
  editor: {},
});
