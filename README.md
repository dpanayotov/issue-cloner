# Clone issue to another repository

Clone an issue to a predefined repository when labeled with a specific label

## Inputs

### `token`

**Required** Github token with repo:all permissions.

### `targetRepo`

**Required** The repository in which to clone the issue.

### `label`

**Optional** The label on which to react. Default `clone`.

## Example usage

```yml
uses: dpanayotov/issue-cloner@v0.2
with:
  label: "clone"
  targetRepo: myorg/myrepo
  token: ${{ secrets.CLONE_ISSUE_TOKEN }}
```