function signup(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          document.getElementById("message").classList.remove("text-red-500");
          document.getElementById("message").classList.add("text-green-600");
          document.getElementById("message").innerText = data.message + " Redirecting...";
          setTimeout(() => {
            window.location.href = "index.html";
          }, 2000);
        } else {
          document.getElementById("message").innerText = data.error || "Signup failed.";
        }
      })
      .catch(() => {
        document.getElementById("message").innerText = "Something went wrong.";
      });
  }
  