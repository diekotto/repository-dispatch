function hasErrorStatus(error) {
  return typeof error.status === "number";
}

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}

module.exports = { hasErrorStatus, getErrorMessage };
