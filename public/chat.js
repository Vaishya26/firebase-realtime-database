import { auth, db } from './firebaseConfig.js';

let roomName;

// Display user info and room name
auth.onAuthStateChanged((user) => {
  if (user) {
    document.getElementById('user-displayname').innerText = `Welcome, ${user.displayName}`;
  } else {
    window.location.href = 'login.html';
  }
});

// Enter Room Event
document.getElementById('enter-room').addEventListener('click', () => {
  roomName = document.getElementById('room-name').value;
  if (roomName) {
    document.getElementById('room-name-display').innerText = `Room: ${roomName}`;
    document.getElementById('room-section').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';

    // Load and display chat messages in this room
    db.ref(`rooms/${roomName}/messages`).on('child_added', (snapshot) => {
      const messageData = snapshot.val();
      const messageElement = document.createElement('p');
      messageElement.innerText = `${messageData.displayName}: ${messageData.message}`;
      document.getElementById('chat-box').appendChild(messageElement);
    });
  }
});

// Send Message Event
document.getElementById('send-message').addEventListener('click', () => {
  const messageInput = document.getElementById('chat-message');
  const messageText = messageInput.value;
  const user = auth.currentUser;

  if (messageText && user && roomName) {
    // Save message to the Firebase Realtime Database
    db.ref(`rooms/${roomName}/messages`).push({
      displayName: user.displayName,
      message: messageText,
      timestamp: Date.now(),
    });

    // Clear the input field after sending the message
    messageInput.value = '';
  } else {
    alert('Please enter a message');
  }
});
