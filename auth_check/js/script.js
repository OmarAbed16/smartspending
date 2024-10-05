let wrapper = document.querySelector(".wrapper");
let signUpLink = document.querySelector(".link .signup-link");
let signInLink = document.querySelector(".link .signin-link");
let btnLogin = document.getElementById("loginss");
let btnSignup = document.getElementById("signup");
let flag = 1;
//swapping
signUpLink.addEventListener("click", () => {
  flag = 0;
  console.log(flag);
  wrapper.classList.add("animated-signin");
  wrapper.classList.remove("animated-signup");
});

signInLink.addEventListener("click", () => {
  wrapper.classList.add("animated-signup");
  wrapper.classList.remove("animated-signin");
  flag = 1;
  console.log(flag);
});

function logup(event, us, em, pass, passMatch) {
  event.preventDefault();

  let username = us;
  let email = em;
  let password = pass;
  let passwordMatch = passMatch;
  let signupErrorMessage = document.querySelectorAll(".up-error")[0];

  if (password.length < 8) {
    signupErrorMessage.textContent =
      "Password must be at least 8 characters long";
    return;
  }

  if (password !== passwordMatch) {
    signupErrorMessage.textContent = "Passwords do not match";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let emailExists = users.some((user) => user.email === email);

  if (emailExists) {
    signupErrorMessage.textContent =
      "Email already registered. Please use a different email.";
    return;
  }

  let newUser = {
    username: username,
    email: email,
    password: password,
    signupDate: new Date().toISOString(),
    role: "user",
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  signupErrorMessage.textContent = "";
  console.log("Signup successful!", newUser);
  localStorage.setItem("current_user", email);
  window.location.href = "../main_page/services.html";
}

function login(event, em, pw) {
  event.preventDefault();

  let email = em;
  let password = pw;
  let loginErrorMessage = document.querySelectorAll(".lg-error")[0];
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(
    (user) => user.email == email && user.password == password
  );

  console.log(em);
  console.log(pw);
  console.log(users);
  console.log(user);

  if (user) {
    console.log("Login successful!", user);
    loginErrorMessage.textContent = "";
    localStorage.setItem("current_user", em);
    window.location.href = "../main_page/services.html";
  } else {
    loginErrorMessage.textContent = "Invalid email or password";
  }
}

const form_lg = document.querySelector(".form-lg");

form_lg.addEventListener("submit", function (event) {
  let login_email = document.getElementById("login_em").value;
  let login_password = document.getElementById("login_pw").value;
  login(event, login_email, login_password);
});

const form = document.querySelector(".form-up");

form.addEventListener("submit", function (event) {
  let username = document.getElementById("signup-us").value;
  let email = document.getElementById("signup-em").value;
  let password = document.getElementById("signup-pw").value;
  let passwordMatch = document.getElementById("signup-pwm").value;
  logup(event, username, email, password, passwordMatch);
});

function logout(g) {
  google.accounts.id.revoke(g, () => {
    console.log("Logout success");
  });
}

function auth_info(a) {
  if (flag == 1) {
    auth_info_lg(a);
    return;
  }
  console.log(a, "1");
  console.log(a.credential, "2");
  const decodedToken = jwt_decode(a.credential);
  console.log(decodedToken, "3");
  console.log(decodedToken.name, decodedToken.email, "4");
  let defaultPass = "loginedWithGoogle";
  logup(event, decodedToken.name, decodedToken.email, defaultPass, defaultPass);
  logout(decodedToken.email);
}

function auth_info_lg(a) {
  // console.log(a, "1");
  //console.log(a.credential, "2");
  const decodedToken = jwt_decode(a.credential);
  //console.log(decodedToken, "3");
  //console.log(decodedToken.name, decodedToken.email, "4");
  login(event, decodedToken.email, "loginedWithGoogle");
  logout(decodedToken.email);
}
