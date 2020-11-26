const { config } = require("dotenv");
const { fastify } = require("fastify");
const { DenonClient } = require("denon-client");
const { commands, commandHandlerMap } = require("./commands");
const { validationMap } = require("./validation");
const { errors, responses } = require("./status");
config();

const app = fastify();

const log = (command, message) =>
  console.log(command, JSON.stringify(message, null, 4));

app.get("/api/commands", (req, res) =>
  res.send({ commands: Object.keys(commands) })
);

app.get("/api/health", (req, res) => res.send("Hey there"));

app.post("/api/command", async (req, res) => {
  const client = new DenonClient(process.env.DENON_HOST);
  try {
    await client.connect();

    const { command, value } = req.body;

    if (!commandHandlerMap.has(command)) {
      log(command, errors.COMMAND_NOT_FOUND);
      return res.send(errors.COMMAND_NOT_FOUND);
    }

    const validator = validationMap.get(command);
    const isValid = validator ? validator(value) : true;

    if (!isValid) {
      log(command, responses.COMMAND_INVALID_VALUE);
      return res.send(responses.COMMAND_INVALID_VALUE);
    }

    const handle = commandHandlerMap.get(command);
    await handle(value, client);

    log(rcommand, esponses.COMMAND_HANDLED);
    return res.send(responses.COMMAND_HANDLED);
  } catch (e) {
    console.error("Error: ", e);
    return res.send(errors.UNEXCPECTED_ERROR);
  } finally {
    client.disconnect();
  }
});

async function startServer() {
  const url = await app.listen(3001);
  console.log(`Denon API running on ${url}`);
}

try {
  startServer();
} catch (e) {
  log("Error", e);
}
