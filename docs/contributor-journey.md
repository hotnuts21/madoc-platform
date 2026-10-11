# Contributor journey: page by page

What each page of the public site shows, how it differs depending on who's looking, and the problems found along the way. It's the starting point for redesigning the volunteer experience, for example with Google Stitch.

## How this was made

On 11 October 2026 an automated browser (Playwright) visited the site at `https://madoc.local` (site `default`, `nlw` branch, development mode) as four people. It only looked at pages and saved nothing.

| Person | Site role | State |
|---|---|---|
| Logged out | none | |
| Sam | Transcriber | No contributions |
| Elise | Transcriber | One contribution in each status: draft, in review, changes requested, approved, rejected. Also one personal note |
| Ricardo | Trusted user (reviewer) | Reviewed Elise's work |

Test content: one project, "NLW Drawing Volumes" (`nlw-drawing-volumes`), with two manifests (22 and 136 images). The friendly contributor layout and the training video are switched on.

**Screenshots** are on the development server, in `docs/local/journey/<person>/<number>-<page>.jpg` (git-ignored), for example `docs/local/journey/2-elise-volunteer/03-project.jpg`. The numbers below match the file names.

## The main journey

```
Site home ─► Projects ─► Project page ─► Manifest ─► Image ─► Contribute
   01           02           03            05        06         07
                              │                                  │
                              ├─► My work / My contributions ◄───┘ (after saving)
                              ├─► Personal notes (23)
                              └─► Tasks (08) / Reviews (09, reviewers)
Help (11, 12) and the "Watch the training video" button are reachable from the header on project pages.
```

---

## Pages

### 01 Site home: `/`
- **Shows:** a heading, "Homepage", and two links, "All collections" and "All projects". Nothing else.
- **Differences:** the same for everyone.
- **Notes:** the weakest page on the site and the first thing visitors see. It's the obvious starting point for the showcase redesign: what the site is, featured projects, how to help, a training video, progress.

### 02 Projects: `/projects`
- **Shows:** "All projects", with one card per project and "Go to project".
- **Differences:** none.

### 03 Project page: `/projects/:slug`
- **Shows:**
  - the project title and project search;
  - four status counts: Not started, In progress, In review, Completed;
  - buttons for "Personal notes" and "Open in Theseus";
  - tabs.
- **Differences:**
  - **Logged out:** a blue "Please login to contribute to this project" bar. Two tabs: *Manifests and Collections* and *Contributors*.
  - **Sam:** tabs *My work*, *Manifests and Collections*, *Contributors*. *My work* shows an empty "My Contributions" table with All / In progress / Submitted / Approved filters.
  - **Elise:** the same, plus *Feedback*. *My work* adds "Continue where you left off!", her contributions table and her personal notes.
  - **Ricardo:** adds a "Reviews" button.
- **Notes (from testing):**
  - **The tabs and the "My contributions" status filters need redesigning.** The whole page layout needs work.
  - The status counts are for the whole project, but sit above per-person content, which is easy to misread. See `contribution-settings-explained.md`.
  - "Open in Theseus" means nothing to volunteers.

### 04 Project manifests: `/projects/:slug/manifests`
- **Shows:** "All manifests", as cards.
- **Differences:** the login bar when logged out.

### 05 Manifest: `/projects/:slug/manifests/:id`
- **Shows:** the manifest title, "Open in Theseus", "Search this manifest", "Filter images", and an image grid.
- **Differences:**
  - the login bar when logged out;
  - Ricardo also gets a "Details" control.

### 06 Image (canvas): `/projects/:slug/manifests/:id/c/:canvasId`
- **Shows:**
  - breadcrumbs and the manifest title;
  - "Browse all", and the page count with previous and next;
  - a project box with a **Contribute** button;
  - the image viewer, with the classic left icon rail of panels (including information and, as a pencil icon, personal notes);
  - the metadata table;
  - previous and next thumbnails.
- **Differences:**
  - **Logged out:** a login bar instead of Contribute.
  - **Ricardo:** also "Assign" and "Administer".
- **Notes:**
  - **Personal notes work here without contributing.** Elise added a note to an image she never worked on (24, the pencil icon shows "1"). That's useful for researchers and viewers, and worth promoting as a feature.
  - Because this isn't the contribution page, notes use the old side column, not the friendly layout.

### 07 Contribute: `/projects/:slug/manifests/:id/c/:canvasId/model`
- **Shows (friendly layout):**
  - a slim header with the project link, manifest title and page navigation;
  - a large image with round zoom, home and rotate controls;
  - a task panel: "How would you like to help?", with task cards such as "Tagging: Tag items you see on the page", marked Start or Continue.
- **Differences:**
  - **Logged out:** the login bar.
  - **Sam:** the **training video pop-up** opens first.
  - **Elise:** straight to the task list. She had already dismissed the video.
  - **Ricardo:** the training video pop-up, plus "Assign" and "Administer".
- **Notes:** opening one of your own submissions (26) goes straight to the form with Save for later and Submit, which is good.

### 08 Project tasks: `/projects/:slug/tasks` (and 31, `/tasks`)
- **Shows:** a narrow list of task cards, each with the manifest title, "crowdsourcing-task", "assigned to Elise" and a thumbnail. A large empty area sits to the right. There are "Filter by status" and "Filter by type" buttons.
- **Notes:** **this is very poor for volunteers.** It shows internal names ("crowdsourcing-task"), truncated titles, colours with no labels, and an empty panel. It needs a complete redesign or should be hidden from volunteers.

### 09 Project reviews: `/projects/:slug/reviews` (also 18 `/dashboard/reviews`, 29 `/projects/1/reviews`, 30 `/reviews`)
- **Shows:** a table with Manifest, Canvas, Modified and Status columns, and on the right "Select a list item from the left panel to view".
- **Differences:** reviewers see everyone's contributions. **Sam and Elise can also open this page.** They only see their own items, so nothing private leaks, but it shouldn't be offered to them. See [bug 1](#1-volunteers-can-open-the-review-pages).
- **Notes:**
  - The Status column is cut off ("In progr…", "change r…").
  - There's no contributor name column.

### 23 Personal notes: `/projects/:slug/personal-notes`
- **Shows:** the person's notes for the project, with image thumbnails.

### 28 Task detail: `/tasks/:taskId`
- **Shows:** the task list on the left, and the selected task, with a status message such as "Your submission is in review".
- **Notes:** reviewers are also told "Your submission…". See [bug 3](#3-the-task-page-says-your-submission-to-reviewers).

### 11 and 12 Help: `/help`, `/help/drawing-volumes`
- **Shows:** a title and a sub-page with the Training Video block.
- **Notes:** placeholder content. The "Article" layout is dated. A new help layout and a "sub-page list" block are on the to-do list.

### 10 and 13 Search: `/projects/:slug/search`, `/search`
- **Shows:** a results count, tabs (All resources, Projects, Collections, Manifests, Canvases), grid and list views, results, and "Load more results" (infinite scroll is on).
- **Notes:** see [bug 4](#4-search-jumps-to-page-2-intermittent).

### 14 and 15 Manifests and Collections: `/manifests`, `/collections`
- **Shows:** "All manifests" and "All collections". Collections is empty, because there are no collections yet.

### 16 and 17 Dashboard: `/dashboard`, `/dashboard/contributions`
- **Shows:** "Welcome back <name>", Active projects, "Browse all projects", and "Your contributions" with "Browse all contributions".
- **Notes:** the contribution links here open the wrong view. See [bug 2](#2-dashboard-contribution-links-open-the-task-list-not-the-submission).

### 19 Profile: `/profile`
- **Shows:** the profile form and "Update profile".

### 20 Terms: `/terms`
- **Shows:**
  - **Logged out:** a blank page.
  - **Logged in:** "You have not yet accepted the terms of use for this site…" and "Accept terms", but no terms text.
- **Notes:** this site has no terms written yet. Either add terms, or check that the page handles there being none.

### 21 and 22 Login and Register: `/login`, `/register`
- **Shows:** standard forms.

---

## Bugs and oddities

Each one has steps to reproduce, because some only show up with the right timing or user and may be missed in normal use.

### 1. Volunteers can open the review pages
- **Severity:** medium (confusing, but no data leaks).
- **Steps:**
  1. Log in as a volunteer (Transcriber) who has submitted at least one contribution, for example Elise.
  2. Go to `/s/default/projects/1/reviews` (or `/projects/nlw-drawing-volumes/reviews`, `/reviews` or `/dashboard/reviews`).
  3. The review table appears with the volunteer's own contributions.
  4. Click an item. The right-hand pane shows a "Something went wrong" error.
- **Expected:** volunteers are sent elsewhere, or shown a "reviewers only" message.
- **Checked:** the tasks service only returns the volunteer's own contributions. With the same request, Sam received 0, Elise 8 (her own) and the admin all 10. So this is a page access problem, not a privacy breach.
- **Where:** `src/frontend/site/pages/tasks/review-listing/review-listing-page.tsx` has no reviewer check, and the site routes are in `src/frontend/site/routes.tsx`.
- **Also:** if you log out as a reviewer and log in as a volunteer while on the review page, you stay on it.

### 2. Dashboard contribution links open the task list, not the submission
- **Severity:** medium (volunteers can't get back to their work from the dashboard).
- **Steps:**
  1. Log in as Elise and open **User dashboard**, then **Your contributions**.
  2. Click one of her submissions.
  3. The contribution page opens at "How would you like to help?" instead of her submission (screenshot 25).
  4. The same submission opened from the project page's *My work* tab opens correctly (26).
- **Cause:** the dashboard links use `?revisionId=…`, but the contribution page only reads `?revision=…`.

### 3. The task page says "Your submission" to reviewers
- **Severity:** low.
- **Steps:**
  1. Log in as Ricardo.
  2. Open Elise's task, for example `/s/default/tasks/4fe65027-71a8-4907-a780-e5a6e8edb924`.
  3. The page says "Your submission is in review", but it isn't his.
- **Expected:** "Elise's submission is in review", or "Submission in review".

### 4. Search jumps to page 2 (intermittent)
- **Severity:** low, though it can hide results.
- **Steps:**
  1. With **Use infinite scroll for search results** on (project Configuration → Search & browse), log in as Ricardo and open `/s/default/search` or the project search.
  2. Wait a few seconds without scrolling.
  3. Sometimes the address changes to `?page=2` by itself. On 11 October this happened in the first run but not the second.
  4. Reload that address, and the results start at page 2.
  5. Also seen: Elise's project search started at "Image 112" while everyone else's started at "Image 136".
- **Likely cause:** the infinite-scroll "load more" point is already visible on load, so the next page loads automatically, and the search writes the page number into the address. Reloading that address then skips page 1.
- **Where:** `src/frontend/site/pages/typesense-search.tsx` (`InfiniteSearchResults`, the routing `stateToRoute`).

### 5. The training video pops up when a reviewer edits someone else's submission (NLW feature)
- **Severity:** low.
- **Steps:**
  1. Log in as Ricardo, who hasn't marked the video as watched.
  2. Open Elise's submission from a review ("You are editing another user's submission").
  3. The training video pop-up opens over it.
- **Expected:** no pop-up while reviewing or editing someone else's work.
- **Where:** `TrainingVideoContributionPrompt`. Skip it when the revision belongs to another user, using the same check as `isEditingAnotherUsersRevision`.

### 6. "Hydration failed" on every page (development only)
- **Severity:** none on the live site.
- **Steps:** open any page in development mode with the browser console open.
- **Cause:** Digirati's development-only API debug panel is drawn in the browser but not on the server, so React redraws the whole page on load. It may cause flicker during development.
- **Where:** `src/frontend/shared/utility/render-client.tsx` (`DevApiDebugPanel`).

### 7. No terms content
- **Severity:** content gap.
- **Steps:** open `/s/default/terms` logged out (blank), or logged in ("Accept terms" with no terms shown).

## Design and feature notes from testing

- **Project page:** the tabs (*My work*, *Manifests and Collections*, *Contributors*, *Feedback*) and the *My contributions* status filters need redesigning, as does the overall layout.
- **Tasks pages** (`/tasks`, the project tasks, "View all tasks"): too technical for volunteers. Redesign them, or replace them with a simple "my contributions" list.
- **Personal notes without contributing:** a hidden strength for researchers and viewers. Promote it, and give it a friendly-layout version on the image page.
- **Site home:** a placeholder. It's the first target for the showcase site.
- **Help pages:** a modern help layout and a sub-page list block are on the to-do list.
- **"Open in Theseus":** an internal tool name shown to volunteers.
