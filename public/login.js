function login() {
  const admNumber = document.getElementById("admNumber").value;
  const password = document.getElementById("password").value;

  fetch("https://niima-backend.onrender.com/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ admNumber, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("admNumber", admNumber);
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("message").innerText = data.error || "Login failed.";
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      document.getElementById("message").innerText = "Something went wrong.";
    });
}
