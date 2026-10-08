# GitHub Pages preview setup

Story 1.6 uses rossjrw/pr-preview-action to deploy each pull request under a distinct path such as /pr-preview/pr-123/ on the repository's GitHub Pages site.

## Repository prerequisite

In Settings -> Pages, configure GitHub Pages to deploy from the gh-pages branch. The preview action maintains that branch and removes a PR preview when the PR closes.

The workflow only grants write access to repository contents for same-repository PRs. Fork PRs are intentionally excluded because the preview action writes to the deployment branch.

## Verification

Open two application PRs simultaneously. Each PR should receive its own preview comment and URL. Verify the root page and a deep link load with assets. A failed build or failed deployment must fail the workflow; the workflow does not convert deployment failures into successful checks.
