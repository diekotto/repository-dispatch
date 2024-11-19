const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const token = core.getInput("token");
    const eventType = core.getInput("event-type");
    const clientPayload = JSON.parse(core.getInput("client-payload"));

    const octokit = github.getOctokit(token);

    await octokit.rest.repos.createDispatchEvent({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      event_type: eventType,
      client_payload: clientPayload,
    });

    core.info(`Successfully triggered ${eventType} event`);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
  }
}

run();
