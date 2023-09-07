// api-service.js
const express = require('express');
const bodyParser = require('body-parser');
const kafka = require('kafka-node');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Create a Kafka producer
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new Producer(client);

producer.on('ready', () => {
  console.log('Kafka producer is ready');
});

// Define an endpoint to send messages to Kafka
app.get('/send-message', (req, res) => {

  const numMessages = 10000; // Number of random messages to send

  const payloads = Array.from({ length: numMessages }, (_, index) => ({
    topic: 'notification-topic',
    messages: `Random message ${index + 1}`,
  }));

  producer.send(payloads, (err, data) => {
    if (err) {
      console.error('Error sending message to Kafka:', err);
      res.status(500).json({ error: 'Message could not be sent' });
    } else {
      console.log('Message sent to Kafka:', data);
      res.json({ status: 'Message sent to Kafka' });
    }
  });
});

app.listen(port, () => {
  console.log(`API service is running on port ${port}`);
});
