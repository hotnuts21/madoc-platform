# NLW Feature Developments

Features and fixes the National Library of Wales has added to Madoc.

- **[Part 1](#part-1-using-the-features)** is for project staff and site admins: what each feature does and how to set it up.
- **[Part 2](#part-2-technical-changes)** is for developers: what changed in the code.

Each section stands on its own, so it can be copied into other documents.

## Status

| Feature or fix | Branch | In `nlw` | Status |
|---|---|---|---|
| [Training video and contribution-page pop-up](#training-video-and-contribution-page-pop-up) | `feature/training-video` | Yes | Built and tested locally |
| [Translations not saving](#translations-not-saving) | `fix/translations-json` | Yes | Fixed; offered to Digirati as a pull request |
| [Friendly contributor layout](#friendly-contributor-layout) | `feature/friendly-editor` | Yes | Phase 1 built; flashing fix parked |
| [Local development guide](#local-development-guide) | `feature/friendly-editor` | Yes | Done |

`nlw` is NLW's combined branch: Digirati's `main` plus every finished NLW feature. Each feature is developed on its own branch from `main`, then merged into `nlw` through a pull request. This document lives on `nlw`; feature branches add their own sections.

Also on `nlw`:

- [contribution-settings-explained.md](contribution-settings-explained.md): how the claim, review and completion settings combine.
- [user-roles-explained.md](user-roles-explained.md): what each user role can do.

All features are **off by default**. Projects that don't switch them on behave exactly as before.

---

# Part 1: Using the features

## Training video and contribution-page pop-up

Volunteers see a short training video the first time they open a task in a project. A **Training video** button in the site header lets anyone watch it again at any time.

### What volunteers see

1. A volunteer opens a task in a project with a training video.
2. A pop-up plays the video over the darkened page, with the message "Please watch this training video before starting any tasks." A **More help for this project** link goes to the project's help page.
3. They choose one of:
   - **Mark as watched and close.** They're asked to confirm: "Are you sure? This video won't show again, but you can watch it at any time by pressing ▶ at the top of the page." After confirming, the pop-up doesn't appear again for this project.
   - **Watch later and close.** The pop-up stays away for 24 hours, then appears again.
4. The **Training video** button in the header replays the video at any time.

Notes:
- Watching isn't tracked. Volunteers can choose either button whenever they like.
- "Mark as watched" is saved to the volunteer's account. "Watch later" is remembered by the browser only, so on another device the pop-up can appear again within the 24 hours.
- Elsewhere on the site, and for logged-out visitors, the pop-up has a single **Close** button.
- The header button only shows on pages inside a project that has a training video.

### Setting it up

**1. Create the project's help page.**
1. In the admin, open **Site pages** and create a page, for example `/help/my-project`.
2. Add the project's guidance, documents and any other videos with the usual blocks, for example **Embed an item** for extra videos.

**2. Add the main video.**
1. On the help page, turn on edit mode and add a **Training video (main project video)** block.
2. Fill in:
   - **Video link:** a YouTube or Vimeo page link (the address in the browser bar is fine), an embed link, or a direct `.mp4` link.
   - **Title:** optional.
   - **Introduction:** optional.
3. Add only one Training video block per help page. Other videos stay as **Embed an item** blocks.

**3. Optional: add a Welsh version.**
1. On the English Training video block, use **Set language**, choose English, and tick **Use as fallback**.
2. Add a second Training video block with the Welsh video. Set its language to Cymraeg and give it the **same Language sort key** as the English block.

Without **Use as fallback**, readers using any other language see no video. Without matching sort keys, the two blocks aren't treated as versions of the same video.

**4. Switch it on for the project.**
1. In the admin, open the project and go to **Configuration**, then **Interface**.
2. At the top of the section:
   - **Training video help page:** enter the page path from step 1, for example `/help/my-project`.
   - **Training video options:**
     - Tick **Show the training video on the contribution page until the volunteer marks it as watched**.
     - Tick **Hide the training video button in the site header** only if you don't want the header button.
3. Click **Save**.

The same settings exist in the site configuration, as a default for every project. A project's own setting takes priority.

**Optional: put the button elsewhere.** The **Training video button** block can be added to any page, for example the project homepage, and it finds the project's video by itself. Its **Button text** setting changes the label. Its **Header button** setting makes it follow the project's "hide header button" option.

### Good to know

- Volunteers who contributed before the video was added will also see the pop-up, once, until they mark it as watched.
- If the help page or its Training video block is missing, there's no button and no pop-up. Nothing breaks.
- Not yet covered: the pop-up on manifest-level contribution pages, and Welsh translations of the pop-up's own wording.

## Translations not saving

**The problem:** in Madoc v2.4.1 to v2.4.6, translations entered in the admin (**Localisation**) for the main interface text could appear to save but were silently thrown away.

**The fix:** after updating to a version that includes the fix, translations save normally. Nothing needs setting up. Translations entered while the bug was present were never stored, so they need entering again.

**Status:** offered to Digirati as a pull request. The fix is also on NLW's `feature/training-video` branch.

## Friendly contributor layout

A simpler contribution page for volunteers, inspired by ArtUK Tagger: a large image, with the tasks as clear cards beside it.

### What volunteers see

| Area | Classic layout | Friendly layout |
|---|---|---|
| Page header | Breadcrumbs, and a header with metadata | A slim bar: back to the project, the manifest title, page navigation |
| Layout | Viewer with side panels for metadata, documents and annotations | A large image on the left and a task panel on the right, without the metadata and document panels |
| Viewer controls | Standard controls | Round zoom in, zoom out, home and rotate buttons over the image |
| Choosing a task | A list of choices | Task cards with a status: Start, Continue, In review, Done |
| Submitting | A preview pop-up, then submit | Submits straight away |
| After submitting | Default message | "Thanks, that's submitted", with links to the next page or another task on this page |

### Setting it up

In the project's **Configuration**, open **Contributions** and, under **Contribution Panel**, tick **Use the friendly contributor layout**.

The classic layout is still used for:
- tabular projects and other projects with their own editor;
- transcription mode;
- projects in preparation;
- an admin editing another user's submission.

### Good to know

- The task panel sometimes redraws several times after pressing a button. A fix is built but parked until it's finished.
- The image sometimes flickers on page load. This is still being investigated, and may be network or image loading rather than the layout.
- The new wording has no Welsh translations yet.

## Local development guide

`docs/local-development.md` explains how to run NLW's Madoc code on your own machine, so changes can be tried before they go live.

---

# Part 2: Technical changes

Paths are relative to `services/madoc-ts/`.

## Training video and contribution-page pop-up

**Branch:** `feature/training-video`. **Plan:** `docs/plans/training-video.md`.

### Configuration

| Change | Detail |
|---|---|
| `src/types/schemas/project-configuration.ts` | Adds `trainingVideoPage?: string` and `trainingVideoOptions?: TrainingVideoOptions` (`showOnContributionPage`, `hideHeaderButton`) to both `ProjectConfiguration` and `ProjectConfigurationNEW`. They're top-level keys, so they pass through the v1↔v2 migrations unchanged. |
| `src/frontend/shared/configuration/site-config.ts` | Admin fields at the top of `ProjectConfigInterface` (the **Interface** section). |
| `config.json` | Defaults in `defaultSiteConfiguration`. Required: the admin form hydrates without `keepExtraFields`, so an option with no value is not rendered at all. |
| `schemas/*.json` | Regenerated with `pnpm generate-schema`. Adds `TrainingVideoOptions`, `TrainingVideoWatchedRequest` and `TrainingVideoWatchedResponse`. |

### Backend: the "watched" flag

- **Storage:** the user's `user_preferences` JSON, as `trainingVideo[siteId][projectId] = ISO date`. There's no migration. It's keyed by site because user accounts are shared across sites. The `UserPreferences` type gains `trainingVideo`.
- **Helpers:** `src/utility/training-video-preferences.ts` provides `getWatchedTrainingVideos` and `markTrainingVideoWatched`. The latter merges inside `trainingVideo`, because `SiteUserRepository.updateUserPreferences()` merges only top-level keys.
- **Routes** (`src/routes/user/training-video.ts`, registered in `src/router.ts`; both require `site.view`):
  - `GET /api/madoc/me/training-video` returns `{ watched: { [projectId]: date } }` for the current site.
  - `POST /api/madoc/me/training-video` takes `{ projectId }` (schema `TrainingVideoWatchedRequest`) and returns the updated map.
- **API client** (`src/gateway/api.ts`): `getTrainingVideoWatched()`, `markTrainingVideoWatched(projectId)`.

### Frontend: `src/frontend/site/features/training-video/`

| File | Purpose |
|---|---|
| `TrainingVideoBlock.tsx` | Page block `default.TrainingVideo`: a responsive 16:9 video with optional title and intro. It marks the main video on a help page. |
| `TrainingVideoButton.tsx` | Page block `default.TrainingVideoButton`: opens the pop-up and hides itself when the project has no video. With `followHeaderSetting` it respects `hideHeaderButton`. |
| `TrainingVideoContributionPrompt.tsx` | Decides once per page, after the project, video and watched flag have loaded, whether to open the pop-up automatically. |
| `TrainingVideoDialog.tsx` | Connects the modal to the state. Whoever opens it sets whether the watched buttons show, so they don't change while it's open. |
| `TrainingVideoModal.tsx` | A Tailwind modal on the native `<dialog>` element (focus trap and Escape for free). On the contribution page, Escape and the help link count as "watch later". |
| `TrainingVideoPlayer.tsx` | An `<iframe>` with fullscreen allowed, or `<video>` for direct files. |
| `TrainingVideoIcon.tsx` | The play icon shared by the button and the confirmation message. |
| `use-training-video.ts` | Reads the project (config overrides the inherited site config), loads the help page through `api.pageBlocks.getPage()`, finds the video for the current language, and reads and writes the watched flag. |
| `use-training-video-location.ts` | Gets the project slug from route context, or from the URL in the site header, which renders above the project routes. Detects contribution pages (manifest or canvas `/model`). |
| `training-video-rules.ts` | Pure rules: whether to auto-open, the 24-hour watch-later window, help page path normalisation, finding the Training video block, and converting YouTube and Vimeo links to embed links. |
| `watch-later-storage.ts` | Per-browser "watch later" in `localStorage`, keyed by site and project. Fails quietly when storage is unavailable. |

**Wiring:**
- `src/extensions/page-blocks/default-definitions.ts` registers both blocks so they can be added to any page.
- `src/frontend/site/features/global/GlobalSiteHeader.tsx` adds the button to the default `global-header` slot.
- `src/frontend/site/blocks/CanvasModelEditor.tsx` renders `TrainingVideoContributionPrompt` beside the classic, friendly or custom editor.

**Language handling** reuses the existing block language rules (`sortSiteBlocks`). A fallback block is the master video, and a block whose language matches the reader's replaces it.

### Pitfalls found while building it

- These blocks are imported by `src/gateway/api.ts` through `default-definitions.ts`, so they must not import `use-api-query` (`apiHooks`). It reads `ApiClient.prototype` when it loads, and the circular import crash-loops the server bundle. The feature uses `useApi()` with `useQuery` instead.
- The project uses react-query v2: use `useQueryCache`, not `useQueryClient`.
- Both rules are now recorded in `.agents/skills/madoc-frontend/SKILL.md`.

### Tests

`__tests__/frontend/site/training-video-rules.test.ts` has 11 tests covering:
- the auto-open rule, including watch-later expiry;
- path normalisation;
- picking the video by language, with fallback;
- converting video links, including rejecting non-web links;
- merging preferences without losing other sites or projects.

### Deploying

The change includes backend code. Rebuild the server bundle (`pnpm build:vite-server`) and restart `server`, which also picks up the new `config.json` defaults.

## Translations not saving

**Branch:** `fix/translations-json`, based on Digirati's `main` and offered upstream as a pull request.

- **Cause:** `translations/en/madoc.json` was invalid JSON from commit `35787faf` (2026-09-17), so it's in v2.4.1 to v2.4.6. The file ended with the 28-character tail of an older copy (`}": "{{page}} of {{count}}"\n}`).
- **How it was corrupted:** in development, `saveMissingLocale` (`src/routes/locales.ts`) writes missing keys back to the file. Every PM2 server worker handles those requests, and `writeFileSync` rewrote the file in place, so two workers writing together could leave the end of a longer write behind.
- **Why translations didn't save:** `updateLocalisation` (`src/routes/admin/localisation.ts`) keeps only keys found in `loadLocaleTemplate()`, which reads `en/<namespace>.json`. Parse errors were swallowed, so the key list was empty and every submitted string was dropped. The API still reported success.

**Changes:**
- `translations/en/madoc.json`: trailing fragment removed. All 1,413 keys are kept, and none are lost compared with the last valid version.
- `src/routes/locales.ts`: missing keys are written to a per-process temporary file, which is then renamed over the bundle, so a save replaces the file in one step.
- `src/routes/admin/localisation.ts`: logs an error when the English template can't be read, instead of failing silently.
- `__tests__/translations/translation-files.test.ts`: fails if any `translations/*/*.json` file stops parsing.
- `CHANGELOG.md`: entries under Unreleased / Fixed.

## Friendly contributor layout

**Branch:** `feature/friendly-editor`.

- **Setting:** `modelPageOptions.enableFriendlyEditor`, added to both configuration types and to both contribution option lists in `site-config.ts`. It isn't offered for tabular projects.
- **Switch:** `src/frontend/site/features/friendly-editor/use-friendly-editor.ts` is true when the setting is on and the project template has no `components.customEditor`.
- **Page changes:**
  - `src/frontend/site/blocks/CanvasModelEditor.tsx` renders `FriendlyCanvasEditor` when enabled and the project isn't in preparation.
  - `src/frontend/site/pages/view-canvas-model.tsx` hides the breadcrumbs slot and swaps `CanvasPageHeader` for `FriendlyCanvasHeader`.
- **Editor** (`src/frontend/site/features/friendly-editor/`):
  - `FriendlyCanvasEditor` loads the same data as `CanvasSimpleEditor`, and falls back to it for transcription mode, preparation, and editing another user's revision.
  - `FriendlyModelEditor` uses `RevisionProviderWithFeatures` with slot overrides: `FriendlyChoice` for task cards and `FriendlySubmitButton` to submit without the preview.
  - Other components: `FriendlyBackToTasks`, `FriendlyPostSubmission`, `FriendlyViewerControls`.
- **Task status** (`friendly-task-status.ts`): done if any revision is approved or accepted; in review if any is submitted; draft if any is a draft; otherwise not started. Rejected revisions are ignored. Tested in `__tests__/frontend/site/friendly-task-status.test.ts`.
- **Accent colour:** the theme's `--madoc-accent`, falling back to `rgb(74 103 228)`.
- **Parked flashing fix** (git stash "friendly editor flashing fix"):
  - shows the confirmation as soon as the revision is saved, before the claim update and data refetches;
  - opens a task and its revision in one update instead of waiting for `AutoSelectingRevision`;
  - keeps the form open after "Save for later" when there's only one task;
  - shows "previously started" messages only above the task list.
- **Known limitation:** if the server stops allowing submissions after a submit, `view-canvas-model.tsx` swaps the editor for the read-only viewer. This happens in both layouts.

## Local development guide

- `docs/local-development.md` explains setting up the `madoc` Docker Compose stack with Vite hot reloading on port 3088, building the bundles, generating the installation code, and keeping `.env` changes out of git (`git update-index --skip-worktree .env`).
- `.gitignore` ignores `project-configs/*`, where project templates are exported.
