const errors = {
  COMMAND_NOT_FOUND: {
    code: "COMMAND_NOT_FOUND",
    message: "Command was not found",
  },
  UNEXPECTED_ERROR: {
    code: "UNEXPECTED_ERROR",
    message: "An error occurred",
  },
};

const responses = {
  COMMAND_HANDLED: {
    code: "COMMAND_HANDLED",
    message: "Command successfully handled",
  },
  COMMAND_INVALID_VALUE: {
    code: "COMMAND_INVALID_VALUE",
    message: "Invalid value",
  },
};

module.exports = { errors, responses };
