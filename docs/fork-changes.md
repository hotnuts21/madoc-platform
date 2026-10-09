# Changes in the NLW fork

This file lists what the National Library of Wales fork changes compared with upstream Madoc. Each entry says what a user sees, how to turn it on, and which files are involved.

Paths are relative to `services/madoc-ts/src/`.

## Friendly contributor layout

**Status:** in progress on branch `feature/friendly-editor`. Off by default.

**Turn it on:** in the project's configuration, under the model page options, tick **Use the friendly contributor layout**. This sets `modelPageOptions.enableFriendlyEditor`.

**When it doesn't apply:**
- Projects whose template supplies its own editor (`components.customEditor`), including tabular projects.
- Projects in transcription mode.
- Projects in preparation.
- When an admin edits another user's submission.

In all of these cases the classic editor is used.

### What changes on the contribution page (`/…/canvases/:id/model`)

| Area | Classic | Friendly |
|---|---|---|
| Page header | Breadcrumbs, canvas header with metadata | Slim bar: back to project, manifest title, assign button, progress (admins and reviewers), page navigation |
| Layout | Viewer with left icon rail (metadata, documents, annotations panels) and editor below or beside it | Large image on the left, task panel on the right. No metadata or document panels |
| Viewer controls | Atlas controls | Round zoom in, zoom out, home and rotate buttons over the image. Rotate only when rotation is enabled |
| Choosing a task | Choice list | Task cards with a status chip: Start, Continue, In review, Done |
| Back to the task list | Back to choices button | "← All tasks" link above the task heading |
| Submitting | Preview pop-up, then submit | Submits straight away. No preview |
| After submitting | Default post-submission screen | "Thanks, that's submitted", with a link to the next page and an "Another task on this page" button |
| Save for later | Returns to the task list | Returns to the task list |

### Behaviour notes

- **Task status chips** come from the volunteer's own revisions for that task:
  - Done: any revision approved or accepted.
  - In review: any revision submitted.
  - Continue: any draft.
  - Start: otherwise. Rejected revisions are ignored.

  See `frontend/site/features/friendly-editor/friendly-task-status.ts` (tests in `__tests__/frontend/site/friendly-task-status.test.ts`).
- **Accent colour** follows the theme's `--madoc-accent` CSS variable and falls back to Madoc's primary blue.

### Stashed: flashing fix (not yet committed)

After a button press, the task panel redrew several times while page data reloaded. A fix exists but is parked in a git stash (`git stash list`, "friendly editor flashing fix") until it's finished. When applied, it changes:

- **Submitting:** the confirmation shows as soon as the revision is saved, and the claim update and data reloads finish behind it. The classic layout redraws the editor as each reload finishes.
- **Opening a task:** the volunteer's draft is created or reopened in the same update as the navigation. The classic layout leaves this to `AutoSelectingRevision`, which renders an empty panel for one frame first.
- **Save for later with a single task:** the form stays open and shows "Saved. You can come back to it later.", instead of closing and reopening.
- **"You have previously started…" messages:** shown only above the task list, not above an open form.
- **After submitting:** "Another task on this page" is hidden when the volunteer can't submit again on this page.

Still to investigate: the image viewer flickers a few times on page load. This may be network or IIIF loading rather than the editor.

### Known limitation

If the server stops allowing a volunteer to submit on a page after they submit, `view-canvas-model.tsx` swaps the whole editor for the read-only viewer. This happens in both layouts.

### Files

- New: `frontend/site/features/friendly-editor/`
- Changed:
  - `frontend/site/blocks/CanvasModelEditor.tsx`: renders the friendly editor when enabled.
  - `frontend/site/pages/view-canvas-model.tsx`: hides breadcrumbs and swaps the header when enabled.
  - `frontend/shared/configuration/site-config.ts`: the admin setting.
  - `types/schemas/project-configuration.ts`: the `enableFriendlyEditor` option.

### Not translated yet

The new interface strings have no Welsh translations in `translations/cy` yet.

## Local development

- `docs/local-development.md`: a guide to running the fork from source.
- `.gitignore`: ignores `project-configs/*` (exported project templates).
