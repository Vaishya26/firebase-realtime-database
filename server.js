import express from 'express';
import admin from 'firebase-admin';
import serviceAccount from './serviceAccount.json' assert { type: "json" };

const app = express();
const port = 3000;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cs5220-f93d0-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Middleware to serve static files
app.use(express.static('public'));

// API Endpoint to get chat messages
app.get('/getMessages', (req, res) => {
  const ref = db.ref('messages');
  ref.once('value')
    .then(snapshot => {
      res.send(snapshot.val());
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// API Endpoint to add a new chat message
app.post('/addMessage', (req, res) => {
  const ref = db.ref('messages');
  const newMessageRef = ref.push();
  newMessageRef.set({
    user: "User1",
    text: "Hello World",
    timestamp: Date.now()
  }).then(() => {
    res.send('Message added successfully');
  }).catch(err => {
    res.status(500).send(err.message);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
