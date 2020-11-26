const { config } = require("dotenv");
const { fastify } = require("fastify");
const { DenonClient } = require("denon-client");
const { commands, commandHandlerMap } = require("./commands");
const { validationMap } = require("./validation");
const { errors, responses } = require("./status");
config();

const app = fastify();

const log = {
  command: (command, message) =>
    console.log("COMMAND:", command, JSON.stringify(message, null, 4)),
  error: (message) => console.error("ERROR:", message),
};

app.get("/api/health", (req, res) => res.send("Healthy"));

app.get("/api/commands", (req, res) =>
  res.send({ commands: Object.keys(commands) })
);

app.post("/api/command", async (req, res) => {
  const client = new DenonClient(process.env.DENON_HOST);
  try {
    await client.connect();

    const { data } = req.body;

    Object.entries(data.commands).forEach(async ([command, value]) => {
      if (!commandHandlerMap.has(command)) {
        log.command(command, errors.COMMAND_NOT_FOUND);
        return res.code(400).send(errors.COMMAND_NOT_FOUND);
      }

      const validator = validationMap.get(command);
      const isValid = validator ? validator(value) : true;

      if (!isValid) {
        log.command(command, responses.COMMAND_INVALID_VALUE);
        return res.code(400).send(responses.COMMAND_INVALID_VALUE);
      }

      const handle = commandHandlerMap.get(command);
      await handle(value, client);

      log.command(command, responses.COMMAND_HANDLED);
    });

    return res.code(200).send(responses.COMMAND_HANDLED);
  } catch (e) {
    log.error(e);
    return res.code(500).send(errors.UNEXPECTED_ERROR);
  } finally {
    client.disconnect();
  }
});

async function startServer() {
  const url = await app.listen(process.env.PORT, "0.0.0.0");
  console.log(`Denon API running on ${url}`);
}

try {
  startServer();
} catch (e) {
  log.error(e);
}
