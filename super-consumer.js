const { Kafka } = require('kafkajs');
const express = require('express');
const app = express();
const port = 3000;

let isSleep = false;

app.get('/config/toggle-workload', (req, res) => {
  isSleep = !isSleep;
  res.send(`New config is: Sleep = ${isSleep}`);
});

app.listen(port, () => {
  console.log(`Super app listening on port ${port}`);
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const topic = 'test-topic';
const groupId = 'super-group-id';

const kafka = new Kafka({
  clientId: 'super-kafka-consumer',
  brokers: ['kafka-service:9092'],
});

const consumer = kafka.consumer({ groupId });

const run = async () => {
  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Message data: ', {
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      if (isSleep) {
        await sleep(10 * 1000);
      } else {
        console.log('Some calculation (Not implemented!)');
      }
    },
  });
};

run().catch(console.error);
