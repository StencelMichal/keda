const { Kafka } = require('kafkajs');

const topic = 'test-topic';
const intervalMs = 1000;

const kafka = new Kafka({
    clientId: 'producer',
    brokers: ['kafka-service:9092'],
});

function generateMessage() {
    const message = {
        data: `Wiadomość: ${Math.random()}`,
        timestamp: Date.now(),
    };
    return JSON.stringify(message);
}


async function produceMessage() {
    const producer = kafka.producer();
    await producer.connect();

    try {
        const message = generateMessage();
        await producer.send({
            topic: topic,
            messages: [{ value: message }],
        });
        console.log(`Wysłano wiadomość: ${message}`);
    } catch (error) {
        console.error('Błąd podczas wysyłania wiadomości:', error);
    } finally {
        await producer.disconnect();
    }
}

setInterval(produceMessage, intervalMs);
