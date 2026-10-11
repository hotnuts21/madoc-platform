import { useProjectTemplate } from '../../../shared/hooks/use-project-template';
import { useModelPageConfiguration } from '../../hooks/use-model-page-configuration';
import { useProject } from '../../hooks/use-project';

/**
 * Whether the project has opted in to the friendly contributor layout.
 *
 * Templates with their own editor (such as tabular projects) always keep it.
 */
export function useFriendlyEditor(): boolean {
  const { enableFriendlyEditor } = useModelPageConfiguration();
  const { data: project } = useProject();
  const template = useProjectTemplate(project?.template);

  return Boolean(enableFriendlyEditor) && !template?.components?.customEditor;
}
