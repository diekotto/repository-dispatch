# Repository Dispatch Action

Custom GitHub Action to trigger repository dispatch events programmatically.

![Tests](https://github.com/diekotto/repository-dispatch/actions/workflows/test.yml/badge.svg)

## Usage

```yaml
- uses: diekotto/repository-dispatch@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    event-type: deploy
    client-payload: '{"ref": "main", "sha": "abc123"}'
```

## Inputs

| Name             | Required | Default | Description                         |
| ---------------- | -------- | ------- | ----------------------------------- |
| `token`          | Yes      | -       | GitHub token with repository scope  |
| `event-type`     | Yes      | -       | Type of event to trigger            |
| `client-payload` | No       | `{}`    | JSON payload to send with the event |

## Outputs

| Name     | Description                    |
| -------- | ------------------------------ |
| `result` | Result of the action execution |

## Example Workflows

### Simple Trigger

```yaml
name: Trigger Deploy
on:
  push:
    branches: [main]
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: your-username/repository-dispatch@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          event-type: deploy
```

### With Custom Payload

```yaml
name: Trigger With Data
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: your-username/repository-dispatch@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          event-type: custom-event
          client-payload: |
            {
              "ref": "${{ github.ref }}",
              "sha": "${{ github.sha }}"
            }
```

## License

MIT © Diego Maroto
