const BASE_URL = "http://localhost:5678/api/";
const USERS_API = BASE_URL + "users/login";
const LOGIN_BUTTON = document.getElementById("se_connecter");

LOGIN_BUTTON.addEventListener("click", function () {
  loginUser();
});

function loginUser() {
  let user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  fetch(USERS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        loginError = document.getElementById("login_error");
        loginError.innerHTML = "E-mail ou mot de passe incorrect";
        loginError.style.display = "flex";
      }
    })
    .then((data) => {
      if (data) {
        sessionStorage.setItem("token", data.token);

        window.location.href = "index.html";
      }
    });
}
