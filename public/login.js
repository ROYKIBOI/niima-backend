function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("https://niima-backend.onrender.com/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        window.location.href = "dashboard.html"; // Redirect to dashboard
      } else {
        document.getElementById("message").innerText = data.error || "Login failed.";
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      document.getElementById("message").innerText = "Something went wrong.";
    });
}