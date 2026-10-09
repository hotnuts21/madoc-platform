import React from 'react';
import { LocaleString } from '../../../shared/components/LocaleString';
import { useData } from '../../../shared/hooks/use-data';
import { useUserPermissions } from '../../../shared/hooks/use-site';
import { HrefLink } from '../../../shared/utility/href-link';
import { CanvasManifestPagination } from '../../blocks/CanvasManifestPagination';
import { ManifestLoader } from '../../components';
import { useCanvasNavigation } from '../../hooks/use-canvas-navigation';
import { useProject } from '../../hooks/use-project';
import { useRelativeLinks } from '../../hooks/use-relative-links';
import { useRouteContext } from '../../hooks/use-route-context';
import { AssignCanvasToUser } from '../canvas/AssignCanvasToUser';
import { CanvasTaskProgress } from '../canvas/CanvasTaskProgress';

/**
 * One slim bar in place of the breadcrumbs and canvas page header:
 * back to the project, the item title, admin tools and page navigation.
 */
export function FriendlyCanvasHeader() {
  const { manifestId, canvasId } = useRouteContext();
  const createLink = useRelativeLinks();
  const { data: project } = useProject();
  const { data: manifestResponse } = useData(ManifestLoader);
  const { showCanvasNavigation } = useCanvasNavigation();
  const { canProgress, isAdmin } = useUserPermissions();

  if (!canvasId || !manifestId) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-200 pb-3">
      {project ? (
        <HrefLink
          href={createLink({ collectionId: undefined, manifestId: undefined, canvasId: undefined })}
          className="whitespace-nowrap text-sm text-gray-600 no-underline hover:underline"
        >
          ← <LocaleString>{project.label}</LocaleString>
        </HrefLink>
      ) : null}

      <LocaleString as="h1" className="m-0 min-w-0 flex-1 truncate text-lg font-semibold text-gray-900">
        {manifestResponse?.manifest.label}
      </LocaleString>

      <div className="flex flex-wrap items-center gap-3">
        <AssignCanvasToUser />
        {isAdmin || canProgress ? <CanvasTaskProgress /> : null}
        {showCanvasNavigation ? <CanvasManifestPagination subRoute="model" /> : null}
      </div>
    </div>
  );
}
