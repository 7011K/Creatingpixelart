// auth.js


const GOOGLE_CLIENT_ID="341073342979-gfrpfpg3ag766tadn9rjnckrn7gd28sp.apps.googleusercontent.com";export let userEmail="";export function setupGoogleLogin(a){if(!window.google||!window.google.accounts){const b=document.createElement("script");b.src="https://accounts.google.com/gsi/client",b.async=!0,b.defer=!0,document.head.appendChild(b),b.onload=()=>{initLogin(a)}}else initLogin(a)}function initLogin(a){google.accounts.id.initialize({client_id:GOOGLE_CLIENT_ID,callback:b=>{const c=b.credential,d=JSON.parse(atob(c.split(".")[1]));userEmail=d.email?d.email.toLowerCase():"","function"==typeof a&&a(userEmail)},auto_select:!1}),google.accounts.id.renderButton(document.getElementById("googleSignInBtn"),{theme:"outline",size:"large"})}
