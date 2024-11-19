const core = require("@actions/core");
const github = require("@actions/github");
const { inspect } = require("util");

async function run() {
  try {
    const token = core.getInput("token");
    const repository = core.getInput("repository");
    const eventType = core.getInput("event-type");
    const clientPayload = JSON.parse(core.getInput("client-payload"));

    const [owner, repo] = repository.split("/");
    const octokit = github.getOctokit(token);

    await octokit.rest.repos.createDispatchEvent({
      owner: owner,
      repo: repo,
      event_type: eventType,
      client_payload: JSON.parse(clientPayload),
    });

    core.info(`Successfully triggered ${eventType} event`);
  } catch (error) {
    core.debug(inspect(error));
    if (hasErrorStatus(error) && error.status == 404) {
      core.setFailed(
        "Repository not found, OR token has insufficient permissions."
      );
    } else {
      core.setFailed(getErrorMessage(error));
    }
  }
}

module.exports = { run };
