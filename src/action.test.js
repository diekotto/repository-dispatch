const core = require("@actions/core");
const github = require("@actions/github");
const { run } = require("./action");

// Mock the modules
jest.mock("@actions/core");
jest.mock("@actions/github");

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

    github.context = {
      repo: {
        owner: "test-owner",
        repo: "test-repo",
      },
    };
  });

  it("creates a dispatch event with correct parameters", async () => {
    // Setup inputs
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case "token":
          return "test-token";
        case "event-type":
          return "test-event";
        case "client-payload":
          return '{"key": "value"}';
        default:
          return "";
      }
    });

    await run();

    // Verify octokit was initialized with token
    expect(github.getOctokit).toHaveBeenCalledWith("test-token");

    // Verify createDispatchEvent was called with correct params
    expect(mockCreateDispatchEvent).toHaveBeenCalledWith({
      owner: "test-owner",
      repo: "test-repo",
      event_type: "test-event",
      client_payload: { key: "value" },
    });

    // Verify success was logged
    expect(core.info).toHaveBeenCalledWith(
      "Successfully triggered test-event event"
    );
  });

  it("handles JSON parse errors", async () => {
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case "token":
          return "test-token";
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

  it("handles API errors", async () => {
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case "token":
          return "test-token";
        case "event-type":
          return "test-event";
        case "client-payload":
          return "{}";
        default:
          return "";
      }
    });

    const error = new Error("API Error");
    mockCreateDispatchEvent.mockRejectedValue(error);

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(
      `Action failed with error: ${error}`
    );
  });
});
