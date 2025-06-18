function signup(event) {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const admNumber = document.getElementById("admNumber").value.trim();
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("message");

  fetch("https://niima-backend.onrender.com/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, admNumber, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        messageEl.innerText = data.message;
        messageEl.className = "text-green-600";
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        messageEl.innerText = data.error || "Signup failed.";
        messageEl.className = "text-red-500";
      }
    })
    .catch(() => {
      messageEl.innerText = "Something went wrong.";
      messageEl.className = "text-red-500";
    });
}
