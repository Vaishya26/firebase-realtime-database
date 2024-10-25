import { auth } from './firebaseConfig.js';

// Redirect to room.html if already logged in
auth.onAuthStateChanged((user) => {
  if (user) {
    if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
      window.location.href = 'room.html';
    }
  }
});

// Sign Up Logic
if (window.location.pathname.includes('signup.html')) {
  document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const displayName = document.getElementById('signup-displayname').value;

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user.updateProfile({ displayName: displayName });
      })
      .then(() => {

        auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        alert('Login successful!');
        window.location.href = 'room.html';
      })
      .catch((error) => {
        console.error('Error logging in:', error.message);
        alert(`Error logging in: ${error.message}`);
      });
        // alert('Registration successful! Please log in.');
        // window.location.href = 'login.html';
      })
      .catch((error) => {
        console.error('Error signing up:', error.message);
        alert(`Error signing up: ${error.message}`);
      });
  });
}

// Login Logic
if (window.location.pathname.includes('login.html')) {
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        alert('Login successful!');
        window.location.href = 'room.html';
      })
      .catch((error) => {
        console.error('Error logging in:', error.message);
        alert(`Error logging in: ${error.message}`);
      });
  });
}

// Logout Logic for room.html
if (window.location.pathname.includes('room.html')) {
  // Logout button in room section
  document.getElementById('logout').addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        alert('Logged out successfully.');
        window.location.href = 'login.html';
      })
      .catch((error) => {
        console.error('Error logging out:', error.message);
        alert(`Error logging out: ${error.message}`);
      });
  });

  // Logout button in chat section
  document.getElementById('logout-chat').addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        alert('Logged out successfully.');
        window.location.href = 'login.html';
      })
      .catch((error) => {
        console.error('Error logging out:', error.message);
        alert(`Error logging out: ${error.message}`);
      });
  });
}
