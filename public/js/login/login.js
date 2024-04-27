let su1 = document.querySelector(".su1");
su1.addEventListener("click", () => {
  window.location.href = "/signup";
});
let su2 = document.querySelector(".su2");
su2.addEventListener("click", () => {
  window.location.href = "/forgot-password";
});
let logintext = document.querySelector(".login-text");
let heading = document.querySelector(".heading");
heading.addEventListener("click", function () {
  logintext.innerHTML = "Login To Continue";
});

let load = document.querySelector(".load");
load.style.display = "none";

function validateForm() {
  load.style.display = "inline-block";
  const inp1 = document.querySelector(".inp1").value;
  const inp2 = document.querySelector(".inp2").value;

  if (inp1.length < 5 || inp2.length < 6) {
    logintext.innerHTML =
      "Username or password should be more than 5 characters";
    console.log("prevented");
    load.style.display = "none";
    return false; // Prevent form submission
  }

  // If the condition is met, the form submission is allowed.
  return true;
}