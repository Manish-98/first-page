# Contributing to First-page

Every contribution must follow this document. Before creating or modifying code, read [CLEAN_CODE_GUIDELINES.md](CLEAN_CODE_GUIDELINES.md). That guideline is mandatory for every feature, bug fix, refactor, test, tooling, and documentation contribution.

## 1. Non-negotiable workflow

**Do not start implementation without a GitHub issue. Do not merge without checks, preview testing, and explicit review/approval.**

1. **Create an issue.** Every new implementation starts with an issue categorized as a feature, bug, or refactor (or another agreed work type). Record the context/background, purpose, scope, broad acceptance criteria, dependencies, and relevant risks. Add sub-issues when the work can be decomposed into independently verifiable parts.
2. **Create an issue branch.** Create a dedicated branch linked to the issue. Use a clear prefix such as `feature/`, `fix/`, `refactor/`, or `docs/`, followed by the issue number and a short kebab-case description where practical (for example, `docs/1-project-guidelines`).
3. **Implement on that branch.** Work only within the approved issue scope. Follow [CLEAN_CODE_GUIDELINES.md](CLEAN_CODE_GUIDELINES.md). If the scope materially changes, stop and update or create an issue before proceeding.
4. **Open a pull request (PR).** Link the issue (for example, `Closes #123` when appropriate). Describe the context, implementation, design decisions, tests performed, known limitations, and how to test the change.
5. **Run GitHub Actions checks and deploy a feature preview.** PR sanity checks should run automatically. A feature preview should be deployed to GitHub Pages so the change can be exercised. If repository settings, GitHub permissions, or Pages constraints prevent deployment, report the blocker honestly; do not claim a preview exists.
6. **Test the deployed feature preview.** Verify the actual deployed build against the issue's acceptance criteria. Include browser/device context, steps exercised, results, and relevant screenshots or artifacts in the PR. Test critical flows and failure states for the change.
7. **Review code and approve changes.** Review correctness, scope, architecture, tests, accessibility, security, and maintainability. Resolve requested changes and rerun relevant checks. Approval is an explicit human decision; automated checks do not replace it.
8. **Merge the PR and close the issue.** Merge only after required checks pass, preview testing is recorded, review/approval is complete, and acceptance criteria are satisfied. Close the issue after the change is integrated and verified.

No step should be silently skipped. If a step is impossible, document why and obtain explicit agreement on an alternative before continuing.

## 2. Issue quality

An issue should be sufficiently clear for implementation without guessing. Include, as relevant:

- **Type:** feature, bug, refactor, documentation, tooling, or maintenance.
- **Context/background:** what exists today and why the work is needed.
- **Purpose/outcome:** what user or engineering problem this addresses.
- **Scope:** included behavior and important exclusions.
- **Acceptance criteria:** observable, testable outcomes. Broad criteria are acceptable at creation; refine them before implementation if ambiguity would affect correctness.
- **Failure cases and constraints:** data integrity, privacy/security, accessibility, browser support, performance, and compatibility considerations.
- **Dependencies:** related issues, prerequisite work, and potential sub-issues.
- **Verification:** how the result can be tested, including the preview expectation where applicable.

If the issue reveals unplanned work, create or link another issue rather than quietly expanding scope.

## 3. Branches and commits

- Keep `main` stable and use feature branches for changes.
- Use one branch per issue/PR unless an explicitly approved stacked-PR arrangement requires dependent branches.
- Prefer small, coherent commits with action-oriented messages. Avoid mixing unrelated cleanup with functional changes.
- Never commit credentials, access tokens, private user data, or generated artifacts that should not be versioned.
- Do not rewrite shared branch history or force-push unless the workflow and affected contributors explicitly permit it.

## 4. Pull request expectations

A PR must:
- Link the issue and state which acceptance criteria it satisfies.
- Summarize what changed and why.
- List tests/checks run and their outcomes; distinguish local results from CI results.
- Provide the deployed preview URL and preview-testing evidence when available.
- Call out risks, known gaps, migration needs, and follow-up issues.
- Update relevant documentation.
- Avoid marking checks, preview testing, or approval complete without evidence.

Do not merge your own change merely because CI passes. Follow the project's explicit review/approval step.

## 5. Sub-issues and stacked PRs

Use sub-issues when a parent issue contains distinct deliverables that can be built or verified independently. Keep the parent issue open until its acceptance criteria are met and all required child work is integrated.

Use **stacked PRs** when a child change depends on code in another unmerged PR or when splitting a large feature into reviewable increments helps. In a stack:
- Each PR should have a focused scope and be linked to its child issue.
- A dependent PR should target the appropriate parent feature branch or preceding stack branch, not `main` by default.
- Document the dependency order and base/head branches in each PR.
- Run checks and preview tests for each meaningful increment; be clear if a preview depends on another unmerged branch.
- Merge in dependency order and retarget remaining PRs as needed after a parent stack is merged.
- Do not confuse **closing** a PR with **merging** it. Required changes must be integrated, not merely closed.
- The parent feature PR stays open until required stacked PRs are merged and their changes are integrated. Then complete the parent review, approval, merge, and issue-closure steps.

Avoid stacking when independent PRs can target the same stable base without conflict.

## 6. Required checks and feature preview

The intended workflow uses GitHub Actions to run appropriate sanity checks and deploy a feature preview through GitHub Pages. The exact check suite should evolve with the app; expected checks include formatting, lint, type-checking, unit/integration tests, production build, and relevant browser/accessibility/visual tests.

- Treat CI as evidence, not ceremony: fix the underlying failure.
- Test the actual deployed preview, not only localhost.
- Check the browser console and critical flows relevant to the issue.
- Verify that the preview matches the proposed commit and does not expose secrets or private data.
- A missing or unavailable preview is a blocker to report and resolve or explicitly agree on an alternative—not a reason to claim testing passed.

## 7. Documentation and code standards

For **every contribution**, read and apply [CLEAN_CODE_GUIDELINES.md](CLEAN_CODE_GUIDELINES.md), including its practical treatment of SOLID, DRY, DAMP, strict TypeScript, React purity, architecture boundaries, error handling, privacy/security, accessibility, and risk-based testing.

Documentation must distinguish:
- decisions already agreed;
- assumptions that still need validation;
- deferred options;
- implemented and verified behavior.

Do not present planned features, CI workflows, or Pages deployments as already working unless they have been implemented and verified.

## 8. Completion checklist

Before requesting final approval, confirm:
- [ ] The issue is linked and acceptance criteria are addressed.
- [ ] The contribution follows CLEAN_CODE_GUIDELINES.md.
- [ ] The change is limited to the agreed scope and relevant docs are updated.
- [ ] Appropriate tests and checks ran; results are recorded accurately.
- [ ] The feature preview was deployed and tested, or the blocker/approved alternative is documented.
- [ ] Review comments are resolved and explicit approval is recorded.
- [ ] The PR is merged only after all required gates pass.
- [ ] The issue is closed after integration and acceptance are complete.
