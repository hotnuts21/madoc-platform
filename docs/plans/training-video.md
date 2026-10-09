# Plan: training videos and the first-time contributor pop-up

**Status:** planned, not started. Revised 2026-10-09 after the requirements write-up and follow-up decisions (see [Decisions](#decisions)).

## Summary

Each project has its own help page, an ordinary Madoc page holding the training video, other videos, documents and guidance, all added and translated with the existing page editor. The project's settings point at that page. A new **Training video** module reuses the page's main video in two places:
- a button in the site header (on by default, can be turned off), and anywhere else an admin places it;
- a pop-up on the contribution page until the volunteer marks the video as watched.

The pop-up links to the project's help page for everything else.

The pop-up's "Mark as watched" and "Watch later" buttons appear only on the contribution page. No database changes are needed, and the only backend addition is one small endpoint to save the "watched" flag.

## Requirements (from the write-up)

- **Help and guidelines:**
  - A help section with standard guidance and video tutorials, visible to everyone, logged in or not.
  - Videos are hosted externally (YouTube, Vimeo, Awesome Screenshot) and added with Madoc's "Embed an item" block.
  - A project can have several videos, but one is the **main** training video.
- **Languages:**
  - Each project has a master video.
  - Admins can add language-specific versions.
  - If there's no version for the reader's language, the master is shown.
- **Placement:** a "view the training video" option, as a block, for both the project homepage and the contribution page.
- **First-time pop-up:**
  - **When it shows:** the first time a volunteer opens a contribution page with 0 contributions and the video not marked as watched. It appears over a darkened page and is language-aware.
  - **What it says:** "Please watch this training video before starting any tasks."
  - **Watch later and close:** closes the pop-up and changes nothing, so it appears again on the next visit.
  - **Mark as watched and close:** first asks "Are you sure? This video won't show again, but you can access it anytime by pressing [icon] at the top of the page." Accepting stops the automatic pop-up.
  - **Playback isn't tracked.** Both buttons can be used at any time.
- **Rewatching:** a persistent button on the contribution page opens the pop-up at any time.
- **Watched buttons:** "Mark as watched" and "Watch later" show only on the contribution page, never in the help areas.

## What Madoc can and can't do today

| Question | Answer |
|---|---|
| Can a block be set up once and reused on several pages? | **No.** Each block belongs to one slot on one page type. Slot filters can repeat a block across, for example, every canvas page in a project, but not across different page types, such as a help page and a contribution page. |
| Can a block pick a standard page? | **No** existing block does. Blocks pick projects, collections, manifests or canvases, not pages. |
| Can a page be embedded elsewhere without its header and footer? | **Not as a feature.** There's no embed mode. But the page API (`getSitePage(path)`) is public and returns a page's slots and blocks, so our own component can load a page and render one of its blocks anywhere. That gives the "embed the content only" behaviour without changing how pages work. |
| Languages for blocks? | **Already built.** Every block has language settings: the languages it's shown for, a shared group key, and a "fallback" flag (`sortSiteBlocks`). A master video marked as fallback, plus a Welsh version in the same group, gives exactly the master-and-override rule. |
| Somewhere to remember "watched"? | The user's `user_preferences` JSON. No migration is needed. Nothing saves to it yet, so one endpoint is needed. |
| Project-wide settings? | Project configuration, resolved site → project. One new setting holds the help page path. |

## Design

### The module: `frontend/site/features/training-video/`

The module has one modal, one hook and two blocks. All of it is Tailwind; the existing modal uses styled-components, so it isn't extended.

| Part | What it is | Where it's used |
|---|---|---|
| **Training video** block (`default.TrainingVideo`) | Shows a video at full width, 16:9 and responsive, with an optional title and intro. Settings: video link, title, intro text. | The help page. This block **is** the main video. Other videos on the page stay as ordinary "Embed an item" blocks. Welsh or English versions use the block's existing language settings. |
| **Training video button** block (`default.TrainingVideoButton`) | A clearly labelled button with a play icon that opens the pop-up. Optional setting: the button label. | Anywhere: the project homepage, the contribution page, the site header. It finds the video by itself, so it needs no other set-up. |
| `TrainingVideoModal` | A darkened full-page pop-up built on the native `<dialog>` element, which gives keyboard focus and Escape for free. It loads the help page through the page API, picks the Training video block for the current language using the existing language rules, and plays it. It always has a **More help for this project** link to the help page. | Opened by the button or the first-time check. |
| `useTrainingVideo()` | Returns the configured page, whether the volunteer has watched, whether "watch later" is still active, `markWatched()` and `watchLater()`. | The modal and the first-time check. |

### Setting (one per project, or a site-wide default)

```ts
trainingVideo?: {
  page: string;                 // the project's help page, e.g. '/help/peace-petition'
  showOnContributionPage: boolean;
  showHeaderButton: boolean;    // default true
}
```

Admins put the video on the project's help page and choose that page in the project settings. A help page can hold several videos; the **Training video** block marks the main one and the rest stay as "Embed an item" blocks.

If no help page is set, or it has no Training video block, the button hides itself and no pop-up appears.

### Where the watched buttons appear

The modal shows "Watch later and close" and "Mark as watched and close" only when all of these are true:
- it's open on a **contribution page** (canvas `/model`, and later manifest `/model`);
- the volunteer is **logged in**;
- they **haven't** marked it as watched.

Everywhere else, and for logged-out visitors, the modal has a plain **Close** button.

So the same button block behaves correctly wherever an admin places it. Nobody has to configure it differently per page.

### The header button

The site header is the `global-header` slot. The button block goes in its default contents. It shows only on pages inside a project that has a help page with a Training video block, and only when `showHeaderButton` isn't turned off. Sites with a customised header can add the block themselves.

### The contribution-page pop-up

The automatic pop-up isn't a block. It's a small check inside the `CanvasModelEditor` block, so it can't be removed by accident when editing slots, and it works in both the classic and friendly layouts. It opens the modal when:
1. the volunteer is logged in;
2. the project has `trainingVideo.showOnContributionPage` set, and the help page has a Training video block;
3. they haven't marked it as watched for this project;
4. they haven't pressed "Watch later" in the last 24 hours.

There's no contribution-count rule, so it reaches existing volunteers once too, until they mark it as watched.

**Mark as watched and close** opens the confirmation ("Are you sure? This video won't show again…"). Accepting calls the new endpoint, and the pop-up stops appearing.

**Watch later and close** hides it for 24 hours. This is stored in the browser per project, so it's gone on another device or after clearing site data, which is harmless.

### Remembering "watched"

- **Endpoint:** `POST /api/madoc/me/training-video` with `{ projectId }`. It stores `{ trainingVideo: { "site:<id>/project:<id>": "<date marked watched>" } }` in the user's preferences.
- **Merging:** it merges inside `trainingVideo`, because the existing helper only merges top-level keys.
- **Scope:** one flag per project. Watching videos on the help page itself isn't tracked.
- **Requires:** a logged-in user.
- **Wiring:** a route handler, a `router.ts` entry, a request schema and an `ApiClient` method. Then rebuild the server bundle and restart.

This is a front-end check only. Someone could still contribute through the API without watching. That's acceptable, because the requirement is guidance, not enforcement.

## Separate issues to log (not part of this feature)

- **Project homepage tabs:** logged-out users should only see *Manifests and Collections* and *Contributors*. Logged-in users see all tabs, landing on *My work*.
  - The *Contributors* tab is currently commented out in `frontend/site/blocks/ProjectTabs.tsx`.
  - `ProjectTabs` is styled-components, so changing it means converting it to Tailwind.
- **Default tab:** land on *Manifests and Collections* when a logged-in user has no contributions yet. This could share the contribution count from `useTrainingVideo()`.

## Work steps

1. Settings and admin fields; `useTrainingVideo()`; unit tests for the show-pop-up rule (watched, watch-later expiry, switched off).
2. Endpoint, route, schema and API client method; rebuild and restart the server.
3. The Training video block (help page).
4. The modal: load the page, pick the block for the language, play the video, and show the right buttons for the context.
5. The Training video button block, added to the default header.
6. The pop-up check in `CanvasModelEditor`, then the manifest-level editor.
7. Welsh translations for the new strings; an entry in `docs/fork-changes.md`.
8. Test as: logged out; a new volunteer; an existing volunteer; after "watch later" (and 24 hours on); after "mark as watched"; header button switched off; project without a help page; in Welsh with and without a Welsh video; in both editor layouts.

## Decisions

| Question | Decision |
|---|---|
| "Watch later" frequency | Hidden for 24 hours, per project, in the browser |
| 0-contributions rule | Dropped. Everyone sees it until they mark it as watched, per project |
| Help pages | One per project, holding the main video plus other videos, documents and guidance |
| Header button | In the header by default, with a setting to turn it off |
| What is tracked | Only "marked as watched" per project; nothing on the help page |

## Open questions

1. **Header button outside projects.** On the site homepage or search there's no project, so there's no video. Proposed: hide the button there. Alternatively, a site-wide default help page could be added later.
