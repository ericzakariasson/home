const commands = {
  SET_VOLUME: "SET_VOLUME",
  SET_INPUT: "SET_INPUT",
};

const commandHandlers = {
  [commands.SET_VOLUME]: (value, client) =>
    client.setVolume(Math.min(parseInt(value), 50)),
  [commands.SET_INPUT]: (value, client) => client.setInput(value),
};

const commandHandlerMap = new Map(Object.entries(commandHandlers));

module.exports = { commands, commandHandlerMap };
