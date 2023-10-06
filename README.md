# Issue Cloner

This action clones an issue from the current repository to another repository when a specified label is present on the issue.

## Inputs

### `label`
The label that triggers the action. Default `"clone"`.

### `targetRepo`
**Required** The repository to clone the issue to, in the format `owner/repo`.

### `token`
**Required** A GitHub token.

### `prefix`
A prefix to append to the title of the cloned issue. Default is an empty string.

### `labels`
A comma-separated list of labels to add to the cloned issue. Default is an empty string.

### `asignees`
A comma-separated list of assignees to add to the cloned issue. Default is an empty string.


## Outputs

### `issue_url`
The URL of the cloned issue in the target repository.

## Example Usage

```yaml
uses: dpanayotov/issue-cloner@v0.3
with:
  label: 'clone'
  targetRepo: 'owner/repo'
  token: ${{ secrets.GITHUB_TOKEN }}
  prefix: 'CLONE:'
  labels: 'bug, needs-triage'
  asignees: 'alice,bob'
```
