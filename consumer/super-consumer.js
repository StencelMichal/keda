const { Kafka } = require('kafkajs');
// const express = require('express');
// const app = express();
// const port = 3000;

const scaler = process.env.SCALER;
// let isSleep = false;
const fibonacci_length = 30;

// app.get('/config/toggle-workload', (req, res) => {
//   isSleep = !isSleep;
//   res.send(`New config is: Sleep = ${isSleep}`);
// });
//
// app.listen(port, () => {
//   console.log(`Super app listening on port ${port}`);
// });

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

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Message data: ', {
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      if (scaler === 'kafka') {
        await sleep(10 * 1000);
      } else {
        console.log('Calculating fibonacci...');
        console.log(`Result: ${fibonacci(fibonacci_length)}`);
      }
    },
  });
};

run().catch(console.error);
