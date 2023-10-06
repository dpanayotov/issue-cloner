# Issue Cloner

This action clones an issue from the current repository to another repository when a specified label is present on the issue.

## Inputs

### `label`
The label that triggers the action. Default `"bug"`.

### `targetRepo`
**Required** The repository to clone the issue to, in the format `owner/repo`.

### `token`
**Required** A GitHub token.

### `addLabel`
A comma-separated list of labels to add to the cloned issue. Example: `"label1, label2"`

### `assignTo`
A comma-separated list of assignees to assign to the cloned issue. Example: `"username1, username2"`

## Outputs

### `issue_url`
The URL of the cloned issue in the target repository.

## Example Usage

```yaml
uses: dpanayotov/issue-cloner@v0.2
with:
  label: 'bug'
  targetRepo: 'owner/repo'
  token: ${{ secrets.GITHUB_TOKEN }}
  addLabel: 'new label, another label'
  assignTo: 'username1, username2'
