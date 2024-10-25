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
  firebase.initializeApp(firebaseConfig);

  // Export auth and db for shared access
export const auth = firebase.auth();
export const db = firebase.database();
  