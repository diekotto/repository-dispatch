# Repository Dispatch Event Action

Custom GitHub Action to trigger repository dispatch events programmatically.

![Tests](https://github.com/diekotto/repository-dispatch/actions/workflows/test.yml/badge.svg) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A GitHub Action that allows you to trigger repository dispatch events in any repository where you have appropriate permissions. This action is useful for creating custom webhook-like workflows and cross-repository automation.

## Features

- Trigger repository dispatch events in any accessible repository
- Customize event types for different workflow scenarios
- Send custom JSON payloads with your events
- Proper error handling with meaningful messages
- Support for Node.js 20

## Usage

### Basic Example

```yaml
- name: Trigger repository dispatch event
  uses: diekotto/repository-dispatch@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    repository: octocat/example-repo
    event-type: build-application
```

### Advanced Example with Custom Payload

```yaml
- name: Trigger repository dispatch event with payload
  uses: diekotto/repository-dispatch@v1
  with:
    token: ${{ secrets.PAT_TOKEN }}
    repository: octocat/example-repo
    event-type: deploy-production
    client-payload: |
      {
        "environment": "production",
        "version": "1.2.3",
        "deployed_by": "workflow"
      }
```

## Inputs

| Input            | Description                              | Required | Default               |
| ---------------- | ---------------------------------------- | -------- | --------------------- |
| `token`          | GitHub token with repository scope       | Yes      | `${{ github.token }}` |
| `repository`     | Target repository in `owner/repo` format | Yes      | Current repository    |
| `event-type`     | Type of event to trigger                 | Yes      | N/A                   |
| `client-payload` | JSON payload to send with the event      | No       | `{}`                  |

## Token Permissions

- If using `${{ github.token }}`, you can only trigger events in the current repository
- To trigger events in other repositories, use a Personal Access Token (PAT) with the `repo` scope

## Error Handling

The action handles common errors and provides clear error messages:

- Repository not found
- Insufficient permissions
- Invalid JSON payload
- Network or API issues

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - [see the LICENSE file for details.](LICENSE)

## Author

Created by Diego Maroto

## Acknowledgments

This action uses the official GitHub Actions Toolkit:

- @actions/core
- @actions/github
