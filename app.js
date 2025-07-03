// app.js
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzLPXzE7QZVeFrdWWwcyq1cJOzygB3rE881BLdIag_YQfjhJFwngjzRY9gPwJuWLg/exec'; // Replace
let currentUser = "";
let userCoords = "";

async function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  const res = await fetch(`${SHEET_API_URL}?action=login&username=${user}&password=${pass}`);
  const result = await res.json();

  if (result.success) {
    currentUser = user;
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("formPage").classList.remove("hidden");
    getCoordinates();
  } else {
    document.getElementById("loginError").classList.remove("hidden");
  }
}

document.getElementById("ibc").addEventListener("change", function() {
  document.getElementById("otherIbc").classList.toggle("hidden", this.value !== "Other");
});

document.getElementById("assetType").addEventListener("change", function() {
  document.getElementById("otherAssetType").classList.toggle("hidden", this.value !== "Other");
});

function getCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        userCoords = `${pos.coords.latitude},${pos.coords.longitude}`;
      },
      err => {
        console.error("Location error", err);
        userCoords = "Unavailable";
      }
    );
  } else {
    userCoords = "Unsupported";
  }
}

function submitData() {
  const assetId = document.getElementById("assetId").value;
  const ibc = document.getElementById("ibc").value === "Other" ? document.getElementById("otherIbc").value : document.getElementById("ibc").value;
  const assetType = document.getElementById("assetType").value === "Other" ? document.getElementById("otherAssetType").value : document.getElementById("assetType").value;
  const date = document.getElementById("date").value;

  fetch(SHEET_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assetId, ibc, assetType, date, postedBy: currentUser, coords: userCoords })
  })
    .then(res => res.json())
    .then(data => {
      alert("Data submitted successfully!");
      document.getElementById("assetId").value = "";
      document.getElementById("ibc").value = "";
      document.getElementById("otherIbc").value = "";
      document.getElementById("assetType").value = "";
      document.getElementById("otherAssetType").value = "";
      document.getElementById("date").value = "";
    })
    .catch(err => alert("Submission failed"));
}
