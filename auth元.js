// auth.js

const GOOGLE_CLIENT_ID = "341073342979-gfrpfpg3ag766tadn9rjnckrn7gd28sp.apps.googleusercontent.com";
export let userEmail = "";

export function setupGoogleLogin(onLoginOK) {
  if (!window.google || !window.google.accounts) {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = () => { initLogin(onLoginOK); };
  } else {
    initLogin(onLoginOK);
  }
}

function initLogin(onLoginOK) {
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response) => {
      const token = response.credential;
      const payload = JSON.parse(atob(token.split('.')[1]));
      userEmail = payload.email ? payload.email.toLowerCase() : '';
      if (typeof onLoginOK === "function") onLoginOK(userEmail);
    }
  });
  google.accounts.id.renderButton(
    document.getElementById("googleSignInBtn"),
    { theme: "outline", size: "large" }
  );
}
