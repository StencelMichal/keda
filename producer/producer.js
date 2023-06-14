const { Kafka } = require("kafkajs");
const express = require("express");

const app = express();
const port = 3000;
const consumerTopic = "test-topic";
const configTopic = "config-topic";
let produceInterval = null;

let intervalMs = 3000;
let isSleep = true;

const kafka = new Kafka({
  clientId: "producer",
  brokers: ["kafka-service:9092"],
});

app.get("/config/setMessageInterval/:interval", (req, res) => {
  intervalMs = Number(req.params.interval) * 1000;
  clearInterval(produceInterval);
  produceInterval = setInterval(produceMessage, intervalMs);
  res.send(`New config is: IntervalMs = ${intervalMs}`);
});

app.get("/config/toggle-workload", async (req, res) => {
  isSleep = !isSleep;
  res.send(`New config is: Sleep = ${isSleep}`);
  await produceMessage(configTopic, JSON.stringify({ isSleep }));
});

app.listen(port, () => {
  console.log(`Super app listening on port ${port}`);
});

function generateMessage() {
  const message = {
    data: `Wiadomość: ${Math.random()}`,
    timestamp: Date.now(),
  };
  return JSON.stringify(message);
}

const producer = kafka.producer();

async function produceMessage(
  topic = consumerTopic,
  message = generateMessage()
) {
  try {
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
    console.log(`Wysłano wiadomość: ${message}`);
  } catch (error) {
    console.error("Błąd podczas wysyłania wiadomości:", error);
  }
}

const run = async () => {
  await producer.connect();
  produceInterval = setInterval(produceMessage, intervalMs);
};

run().catch((e) => console.error(`[Super producer] ${e.message}`, e));

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];


errorTypes.forEach((type) => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`);
      await producer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach((type) => {
  process.once(type, async () => {
    try {
      await producer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});
