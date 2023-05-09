const { Kafka } = require('kafkajs');

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
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

run().catch(console.error);
