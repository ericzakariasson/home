const { Options } = require("denon-client");
const { commands } = require("./commands");

const validation = {
  [commands.SET_VOLUME]: (value) => 0 <= value && value <= 100,
  [commands.SET_INPUT]: (value) =>
    Object.values(Options.InputOptions).includes(value),
  [commands.SET_POWER]: (value) =>
    Object.keys(Options.PowerOptions).includes(value),
};

const validationMap = new Map(Object.entries(validation));

module.exports = { validationMap };
