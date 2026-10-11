# User roles explained

What each Madoc user role can do. It's based on the code in Madoc v2.4.6, checked October 2026; the official documentation doesn't cover roles.

## Two kinds of role

Every user has two roles:

1. **A global role:** one per account, across every site on the Madoc installation.
2. **A site role:** one per user per site. **This is the one that controls what people can do on a site.** Set it in the site's user and permissions admin.

## Global roles

| Global role | Effect |
|---|---|
| **Global admin** | Everything, on every site, including system settings |
| **Site admin** | Used in a few admin checks |
| **Editor, Reviewer, Author, Researcher, Transcriber** | No effect found. These are leftovers, marked "@todo remove?" in the code |

For normal users the global role can be ignored. Self-registered users get **Researcher**, which is harmless.

## Site roles

| Site role | Contribute (save / submit) | Review others' work | Picked automatically as reviewer | Assign images or manifests to people | Edit capture models | Admin area |
|---|---|---|---|---|---|---|
| **Admin** | ✓ | ✓ | Optional (the "admins are reviewers" setting) | ✓ | ✓ | ✓ |
| **Trusted user** | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| **Reviewer** | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| **Limited reviewer** | ✓ | ✓, when given a review | — | — | — | — |
| **Transcriber** | ✓ | — | — | — | — | — |
| **Limited transcriber** | ✓ | — | — | — | — | — |
| **Viewer** | — (read-only) | — | — | — | — | — |
| **Editor** | — (read-only) | — | — | — | — | — |

### Things that may surprise you

- **Trusted user and Reviewer are identical.** They have exactly the same permissions.
- **Limited transcriber is identical to Transcriber.** The permissions are the same and nothing treats them differently. The distinction appears to have been planned but never built.
- **Editor is identical to Viewer.** It's read-only, despite its name.
- **Limited reviewer** can review work that's given to them. They aren't picked automatically when a review is created, and they can't assign images or manifests to people.

## How new users get their role

| How they joined | Site role |
|---|---|
| Registered themselves | **Viewer**, or **Transcriber** if the system setting "registered users are transcribers" is on |
| Accepted an invitation | The role set on the invitation (default **Viewer**) |
| Created by an admin | Whatever the admin chooses |

Volunteers who register themselves can only contribute if that system setting is on, or if an admin changes their role.

## Suggested test accounts

| Account | Site role | Use it to test |
|---|---|---|
| Admin | Admin | Settings, page editing, everything |
| Reviewer | Reviewer | Reviewing, and how statuses and progress bars change |
| Volunteer | Transcriber | The contribution page, the friendly editor and the training video |
| Viewer | Viewer | What logged-in people who can't contribute see, including locked pages |

## Technical reference

Paths relative to `services/madoc-ts/`.

- **Role lists:** `src/frontend/config.ts` (`siteRoles`, `globalRoles`).
- **Site role permissions:** `config.json` → `permissions`.

  | Site role | Permissions |
  |---|---|
  | admin | `site.admin`, `tasks.admin`, `models.admin` |
  | trusted-user, reviewer | `tasks.create`, `tasks.progress`, `models.revision`, `models.create`, `models.contribute`, `models.view_published`, `site.view` |
  | limited-reviewer | as reviewer, without `models.create` |
  | transcriber, limited-transcriber | `tasks.progress`, `models.revision`, `models.contribute`, `models.view_published`, `site.view` |
  | viewer, editor | `models.view_published`, `site.view` |

- **Role checks in the interface:** `src/frontend/shared/utility/user-roles.ts` (`isContributor`, `isAdmin`, `isReviewer`). `isReviewer(details, true)` excludes limited reviewers, which hides the assign-to-user controls (`AssignCanvasToUser`, `AssignManifestToUser`).
- **Automatic reviewer choice:** `src/routes/projects/assign-review.ts` picks from `trusted-user` and `reviewer`, plus admins when "admins are reviewers" is on.
- **Registration defaults:** `src/routes/user/register.ts`:
  - global role `researcher`;
  - invitation site role `viewer`;
  - site role `transcriber` when `registeredUserTranscriber` is set.
