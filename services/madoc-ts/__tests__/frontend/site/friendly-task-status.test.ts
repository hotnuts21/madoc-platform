/** @jest-environment node */
import { getFriendlyTaskStatus } from '../../../src/frontend/site/features/friendly-editor/friendly-task-status';
import type { Revision } from '../../../src/frontend/shared/capture-models/types/capture-model';
import type { RevisionRequest } from '../../../src/frontend/shared/capture-models/types/revision-request';

function request(revision: Partial<Revision>): RevisionRequest {
  return {
    source: 'structure',
    document: { id: 'doc', type: 'entity', label: 'Document', properties: {} } as RevisionRequest['document'],
    revision: { id: 'rev', fields: [], ...revision } as Revision,
  };
}

describe('getFriendlyTaskStatus', () => {
  test('no revisions is not started', () => {
    expect(getFriendlyTaskStatus(undefined)).toEqual('not-started');
    expect(getFriendlyTaskStatus([])).toEqual('not-started');
  });

  test('a draft is a draft', () => {
    expect(getFriendlyTaskStatus([request({ status: 'draft' })])).toEqual('draft');
  });

  test('a submission is in review, even alongside a draft', () => {
    expect(getFriendlyTaskStatus([request({ status: 'draft' }), request({ status: 'submitted' })])).toEqual(
      'in-review'
    );
  });

  test('accepted or approved work is done', () => {
    expect(getFriendlyTaskStatus([request({ status: 'submitted' }), request({ status: 'accepted' })])).toEqual('done');
    expect(getFriendlyTaskStatus([request({ status: 'submitted', approved: true })])).toEqual('done');
  });

  test('rejected work lets the user start again', () => {
    expect(getFriendlyTaskStatus([request({ status: 'rejected' })])).toEqual('not-started');
  });
});
