import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js';
import { getDatabase, ref, push, onChildAdded, set, get, onValue } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js';  // Import onValue to listen for data changes
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';


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


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Function to show chat window after login/registration
function showChat() {
    document.getElementById('chat-container').style.display = 'block';  // Show chat container
    document.getElementById('register-container').style.display = 'none';  // Hide registration form
    document.getElementById('login-container').style.display = 'none';  // Hide login form

    // Fetch previous chat messages
    const messagesRef = ref(db, 'messages');
    onValue(messagesRef, (snapshot) => {
        const messages = snapshot.val();
        const messageList = document.getElementById('messages');
        messageList.innerHTML = ''; // Clear current chat list to avoid duplication
        for (const key in messages) {
            const message = messages[key];
            const messageElement = document.createElement('li');
            const timestamp = new Date(message.timestamp).toLocaleString();
            messageElement.textContent = `${message.user || 'Anonymous'}: ${message.text} (${timestamp})`;
            messageList.appendChild(messageElement);
        }
    });
}

// Register new user
document.getElementById('register-btn').addEventListener('click', () => {
    const firstName = document.getElementById('first-name-input').value;
    const lastName = document.getElementById('last-name-input').value;
    const email = document.getElementById('email-input-register').value;
    const password = document.getElementById('password-input-register').value;

    if (password.length < 6) {
        alert('Password should be at least 6 characters.');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Update user profile with display name as first name
            updateProfile(user, {
                displayName: firstName
            }).then(() => {
                // Save user details to Realtime Database
                // set(ref(db, 'users/' + user.uid), {
                //     firstName: firstName,
                //     lastName: lastName,
                //     email: email
                // });
                alert('Registration successful!');
                showChat();  // Show chat window after successful registration
            }).catch((error) => {
                console.error('Error updating profile:', error.message);
            });
        })
        .catch((error) => {
            console.error('Error registering:', error.message);
        });
});

// Handle user login
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(`Logged in as: ${user.displayName}`);
            showChat();  // Show chat window after successful login
        })
        .catch(error => {
            console.error('Error logging in:', error.message);
        });
});

// Check for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user)
        console.log(`User logged in: ${user.displayName}`);
        showChat();  // Show chat window if the user is already logged in
        document.getElementById('send-message-btn').addEventListener('click', () => {
            const messageText = document.getElementById('message-input').value;
            if (messageText && auth.currentUser) {
                push(ref(db, 'messages'), {
                    user: auth.currentUser.displayName || 'Anonymous',  // Use the first name from displayName, fallback to 'Anonymous'
                    text: messageText,
                    timestamp: Date.now()
                });
                document.getElementById('message-input').value = '';  // Clear the input field
            } else {
                alert('Please log in to send messages.');
            }
        });
    } else {
        console.log('User is not logged in.');
    }
});

// Real-time listener to get new messages
onChildAdded(ref(db, 'messages'), (data) => {
    const message = data.val();
    const messageElement = document.createElement('li');
    
    // Format timestamp to readable format
    const timestamp = new Date(message.timestamp).toLocaleString();
    
    // Display the message with the logged-in user's first name (from displayName)
    messageElement.textContent = `${message.user || 'Anonymous'}: ${message.text} (${timestamp})`;
    document.getElementById('messages').appendChild(messageElement);
});
