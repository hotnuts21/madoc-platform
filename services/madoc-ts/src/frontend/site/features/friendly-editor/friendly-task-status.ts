import { RevisionRequest } from '../../../shared/capture-models/types/revision-request';

export type FriendlyTaskStatus = 'not-started' | 'draft' | 'in-review' | 'done';

/**
 * Summarises the current user's revisions for one capture-model choice.
 *
 * The most advanced state wins: accepted work beats a pending submission, which
 * beats a draft. Rejected revisions are ignored, so the user can try again.
 */
export function getFriendlyTaskStatus(revisions: RevisionRequest[] | undefined): FriendlyTaskStatus {
  if (!revisions || revisions.length === 0) {
    return 'not-started';
  }

  const statuses = revisions.map(request => request.revision);

  if (statuses.some(revision => revision.approved || revision.status === 'accepted')) {
    return 'done';
  }

  if (statuses.some(revision => revision.status === 'submitted')) {
    return 'in-review';
  }

  if (statuses.some(revision => revision.status === 'draft')) {
    return 'draft';
  }

  return 'not-started';
}
