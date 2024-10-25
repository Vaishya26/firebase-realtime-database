// Firebase Configuration for Client-Side
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js';
import { getDatabase, ref, push, onChildAdded } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyCvRJfgt6xzrCL7GloeFogRq68UBeHvVjE",
    authDomain: "cs5220-f93d0.firebaseapp.com",
    databaseURL: "https://cs5220-f93d0-default-rtdb.firebaseio.com",
    projectId: "cs5220-f93d0",
    storageBucket: "cs5220-f93d0.appspot.com",
    messagingSenderId: "786047443061",
    appId: "1:786047443061:web:7bf55b6e5a739d92fb183c",
    measurementId: "G-EEM06XB3HT"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Reference to the messages node in the database
const messagesRef = ref(db, 'messages');

// Add message to the database
document.getElementById('send-message-btn').addEventListener('click', () => {
    const messageText = document.getElementById('message-input').value;
    if (messageText) {
        push(messagesRef, {
            user: 'User1',
            text: messageText,
            timestamp: Date.now()
        });
        document.getElementById('message-input').value = '';
    }
});

// Real-time listener to get new messages
onChildAdded(messagesRef, (data) => {
    const message = data.val();
    const messageElement = document.createElement('li');
    messageElement.textContent = `${message.user}: ${message.text}`;
    document.getElementById('messages').appendChild(messageElement);
});
