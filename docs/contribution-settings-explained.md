# How contribution settings change what volunteers see

How Madoc's claim, review and completion settings combine, and what volunteers and staff see as a result. It's based on the code in Madoc v2.4.6, checked October 2026.

## The settings

All are in the project's **Configuration**.

| Setting (as labelled in the admin) | Section | What it controls |
|---|---|---|
| **Contributors per resource** | Contributions | How many *different people* can work on one image. Empty means no limit. |
| **Submission approvals required** | Review process | When an approval marks the image **complete**. See [Completion](#2-when-an-image-becomes-complete). |
| **After a canvas has been marked as complete: Allow further submissions** | Review process | Off (the default): a complete image takes no more contributions. |
| **Once a resource is complete: Hide it from the resource page in the project** | Review process | Hides complete images and manifests from project listings. |
| **Only one submission per user per resource** | Contributions | One submitted or accepted contribution per person per image. |
| **Prevent contribution after rejection** / **after submission** | Contributions → Submission process | Stops a person contributing again after one of theirs is rejected, or after they've submitted. |

## 1. Who can work on an image

- **Saving reserves the image, opening doesn't.** A person takes up a "contributor" place on an image when they first **Save for later** or **Submit**.
- **Two people opening the same unreserved image** can both start. Once one has saved, the other's claim is refused ("Maximum number of contributors reached") when they save.
- **People who already hold a place can always carry on**, whatever the limit.
- **These count towards the limit:** in progress, submitted (in review), changes requested, and accepted.
- **Rejected doesn't count.** A rejection frees that person's place for someone else.
- **When the limit is reached**, everyone else sees the image read-only.

So with **Contributors per resource = 1**, the image is blocked for everyone else from the first save, all the way through review, and only reopens if the work is rejected.

## 2. When an image becomes complete

Completion is checked **only when a contribution is approved**. At that moment Madoc counts the **different people with any contribution on the image**: in progress, submitted, changes requested, accepted **or rejected**. If that count reaches **Submission approvals required**, the image is marked complete.

It does **not** count only the approved contributions, which is what the setting's name suggests.

## 3. What each status looks like

**Project and manifest listings.** These show the image's status, unless the logged-in volunteer has their own contribution on it, in which case they see theirs. That's why the bars look different when you're logged in as a contributor.

| Image (canvas task) | Everyone else sees | The volunteer who contributed sees |
|---|---|---|
| Not started, or only saved drafts | Available | In progress, for their own draft |
| At least one submission | In progress | Submitted (in review), for their own submission |
| Complete | Complete, or hidden if "Hide it…" is on | Complete |

Changes requested shows as "In progress" to the volunteer, who can carry on editing.

**Contribution page.**
- An image the volunteer can't join, or one that's complete with no further submissions allowed, shows **read-only**.
- A volunteer's own rejected work doesn't block them unless **Prevent contribution after rejection** is on.

## 4. Worked examples

### A. One person per image, one approval (the usual setup)

*Contributors per resource = 1, Submission approvals required = 1.*

1. Volunteer A saves or submits. The image is A's; everyone else sees it read-only.
2. A submits. The listing shows **In progress** to everyone, and **Submitted** to A.
3. The reviewer:
   - **approves** it: the image is **Complete**;
   - **rejects** it: A's place is freed, and someone else can take the image. It still shows **In progress** in listings, because a submission has been made;
   - **requests changes**: the image stays with A, who edits and resubmits.

This behaves as staff expect.

### B. Two people per image, two approvals (double-keying)

*Contributors per resource = 2, Submission approvals required = 2.*

1. A and B both start. Nobody else can join.
2. A's work is approved. Madoc counts the people on the image: A and B make **2**, so the image is marked **Complete**, even though B's work is still in progress or waiting for review.
3. B's work can still be reviewed, but the image already shows Complete, and B may find it closed to further submissions.

If B hadn't started when A was approved, the count is 1, and the image completes when B is approved.

### C. Approvals set higher than contributors

*Contributors per resource = 1, Submission approvals required = 20.* This is the setting on the local test project.

Only one person at a time can hold the image, so the count rarely reaches 20. Images effectively **never complete on their own**. They stay "In progress" after approval until staff close them.

### D. Rejections count towards completion

*Contributors per resource = 1, Submission approvals required = 2.*

1. A's work is rejected, which frees the image.
2. B takes it, and B's work is approved. The count is A (rejected) and B, which makes **2**, so the image is **Complete** with only one approved contribution.

## Recommendations

- **Keep "Submission approvals required" at 1** unless you really want several independent transcriptions of each image.
- **Never set it higher than "Contributors per resource"** when that has a limit, or images won't complete on their own (example C).
- If you do want several approvals per image, be aware of examples B and D: the count includes people whose work isn't approved.

## Possible fix

Counting only **accepted** contributions from different people would make "Submission approvals required" mean what it says. Examples A and C would behave the same, and examples B and D would wait for real approvals. This would be a change to Madoc's core (`src/gateway/tasks/crowdsourcing-task.ts`, the `status.3` handler) and could be offered to Digirati as a pull request. It hasn't been made yet.
