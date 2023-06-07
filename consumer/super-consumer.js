const { Kafka } = require("kafkajs");
const express = require("express");
const app = express();
const port = 3000;

let isSleep = true;
const fibonacci_length = 30;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const topic = "test-topic";
const groupId = "super-group-id";
const configTopic = "config-topic";
const configGroupId = String(new Date().getTime());

const kafka = new Kafka({
  clientId: "super-kafka-consumer",
  brokers: ["kafka-service:9092"],
});

const consumer = kafka.consumer({ groupId });
const configConsumer = kafka.consumer({ groupId: configGroupId });

function fibonacci(n) {
  if (n === 1) {
    return 0;
  } else if (n === 2) {
    return 1;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 1);
  }
}

const run = async () => {
  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await configConsumer.connect();
  await configConsumer.subscribe({ topic: configTopic, fromBeginning: true });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Message data: ", {
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      if (isSleep) {
        await sleep(10 * 1000);
      } else {
        console.log("Calculating fibonacci...");
        console.log(`Result: ${fibonacci(fibonacci_length)}`);
      }
    },
  });

  await configConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      isSleep = JSON.parse(message.value).isSleep;
      console.log("New config: ", {
        isSleep,
      });
    },
  });
};

run().catch(console.error);
