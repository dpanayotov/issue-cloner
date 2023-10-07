# Clone issue to another repository

This action clones an issue from the current repository to another repository when a specified label is present on the issue.

## Inputs

### `token`

**Required** Github token with repo:all permissions.

### `targetRepo`

**Required** The repository to clone the issue to, in the format `owner/repo`.

### `label`

**Optional** The label on which to react. Default `clone`.

### `prefix`
**Optional** A prefix to append to the title of the cloned issue. Default is an empty string.

### `labels`
**Optional** A comma-separated list of labels to add to the cloned issue. Default is an empty string.

### `asignees`
**Optional** A comma-separated list of assignees to add to the cloned issue. Default is an empty string.

## Outputs

### `issue_url`
The URL of the cloned issue in the target repository, which can be accessed with ${{ steps.<step-id>.outputs.issue_url }} in your workflow file.

## Example Usage

```yml
uses: dpanayotov/issue-cloner@v0.3
with:
  label: "clone"
  targetRepo: myorg/myrepo
  token: ${{ secrets.CLONE_ISSUE_TOKEN }}
  prefix: 'CLONED:'
  labels: 'bug, needs-triage'
  asignees: 'alice,bob'
```
