const core = require("@actions/core");
const github = require("@actions/github");
const { run } = require("./action");
const { hasErrorStatus } = require("./errors");

// Mock the modules
jest.mock("@actions/core");
jest.mock("@actions/github");
jest.mock("./errors");

describe("repository-dispatch action", () => {
  let mockCreateDispatchEvent;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup mocks
    mockCreateDispatchEvent = jest.fn().mockResolvedValue({});
    github.getOctokit.mockReturnValue({
      rest: {
        repos: {
          createDispatchEvent: mockCreateDispatchEvent,
        },
      },
    });

    // Reset default inputs
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case "token":
          return "test-token";
        case "repository":
          return "test-owner/test-repo";
        case "event-type":
          return "test-event";
        case "client-payload":
          return "{}";
        default:
          return "";
      }
    });

    // Reset error handling mocks
    hasErrorStatus.mockReturnValue(false);
  });

  it("creates a dispatch event with correct parameters", async () => {
    await run();

    // Verify octokit was initialized with token
    expect(github.getOctokit).toHaveBeenCalledWith("test-token");

    // Verify createDispatchEvent was called with correct params
    expect(mockCreateDispatchEvent).toHaveBeenCalledWith({
      owner: "test-owner",
      repo: "test-repo",
      event_type: "test-event",
      client_payload: {},
    });

    // Verify success was logged
    expect(core.info).toHaveBeenCalledWith(
      "Successfully triggered test-event event"
    );
  });

  it("handles JSON parse errors in client-payload", async () => {
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case "token":
          return "test-token";
        case "repository":
          return "test-owner/test-repo";
        case "event-type":
          return "test-event";
        case "client-payload":
          return "invalid-json";
        default:
          return "";
      }
    });

    await run();

    expect(core.setFailed).toHaveBeenCalled();
    expect(mockCreateDispatchEvent).not.toHaveBeenCalled();
  });

  it("handles 404 errors properly", async () => {
    const error = new Error("Not Found");
    error.status = 404;
    mockCreateDispatchEvent.mockRejectedValue(error);
    hasErrorStatus.mockReturnValue(true);

    await run();

    expect(hasErrorStatus).toHaveBeenCalledWith(error);
    expect(core.setFailed).toHaveBeenCalledWith(
      "Repository not found, OR token has insufficient permissions."
    );
  });

  it("handles other API errors", async () => {
    const error = new Error("API Error");
    mockCreateDispatchEvent.mockRejectedValue(error);

    await run();

    expect(core.debug).toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalled();
  });

  it("handles custom repository input", async () => {
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case "token":
          return "test-token";
        case "repository":
          return "custom-owner/custom-repo";
        case "event-type":
          return "test-event";
        case "client-payload":
          return "{}";
        default:
          return "";
      }
    });

    await run();

    expect(mockCreateDispatchEvent).toHaveBeenCalledWith({
      owner: "custom-owner",
      repo: "custom-repo",
      event_type: "test-event",
      client_payload: {},
    });
  });

  it("creates a dispatch event with custom payload", async () => {
    // Define test data
    const payload = { key: "value" };
    
    // Setup input mock
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case "token":
          return "test-token";
        case "repository":
          return "test-owner/test-repo";
        case "event-type":
          return "test-event";
        case "client-payload":
          return JSON.stringify(payload);
        default:
          return "";
      }
    });

    // Run the action
    await run();

    // Verify the dispatch event was created with the correct parameters
    expect(mockCreateDispatchEvent).toHaveBeenCalledWith({
      owner: "test-owner",
      repo: "test-repo",
      event_type: "test-event",
      client_payload: payload,
    });
  });
});
