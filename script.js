
const firebaseConfig = {
    apiKey: "AIzaSyBTPY_JX8FfHp5g0NVr8W5jVgZg0zpK-Js",
    authDomain: "chattica-ai-route.firebaseapp.com",
    projectId: "chattica-ai-route",
    storageBucket: "chattica-ai-route.firebasestorage.app",
    messagingSenderId: "388156484868",
    appId: "1:388156484868:web:6ff70b15735b09b648f451",
    measurementId: "G-10B5ZBXC49"
  };
  
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  const ui = new firebaseui.auth.AuthUI(auth);
  
  ui.start("#firebaseui-auth-container", {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    signInFlow: "popup",
    signInSuccessUrl: "/AI-based-complaint-routing/chat.html",
    callbacks: {
      uiShown: () => {
        document.getElementById("loader").style.display = "none";
      },
    },
  });
  
  function showWelcomeMessage(user) {
    const container = document.getElementById("firebaseui-auth-container");
    container.style.display = "none";
  
    const loader = document.getElementById("loader");
    loader.style.display = "block";
    loader.innerHTML = `
      <h2>Hello, ${user.displayName || user.email}!</h2>
      <button id="continue-button" class="continue-button">Continue</button>
    `;
  
    document.getElementById("continue-button").addEventListener("click", () => {
      window.location.href = "/AI-based-complaint-routing/chat.html"; 
    });
  }
  
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log("User is signed in:", user);
      await saveUserToBackend(user);
  
      await fetchUserProgress(user.uid);
      const userID = user.uid;
      localStorage.setItem("userID", userID);
      showWelcomeMessage(user);
    } else {
      console.log("No user is signed in.");
      localStorage.removeItem("userID");
      document.getElementById("firebaseui-auth-container").style.display = "block";
      document.getElementById("loader").innerText = "Loading...";
    }
  });
  
  document.getElementById("logout")?.addEventListener("click", () => {
    auth.signOut()
      .then(() => {
        console.log("User signed out.");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  });
  