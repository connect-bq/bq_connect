import Toast from "../shared/alerts";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const idNumber = document.getElementById("ident_number");
  const idFullName = document.getElementById("user_full");
  const idEmail = document.getElementById("email");
  const idPhone = document.getElementById("phone");
  const idAge = document.getElementById("age");
  const idPassword = document.getElementById("password");
  const submitButton = document.getElementById("bt-register");
  const btnRegisterBack = document.getElementById("btn-register-back");


//add funncionality button go back

btnRegisterBack.addEventListener('click', (event) => {
    event.preventDefault
    window.location.href = "/index.html"


});


  //
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Validations
    if (
      idNumber.value === "" ||
      idFullName.value === "" ||
      idEmail.value === "" ||
      idPhone.value === "" ||
      idAge.value === "" ||
      idPassword.value === ""
    ) {
      Toast.warning("Please complete all fields.");
      return;
    }
    if (idPassword.value.length < 6) {
      Toast.warning("The password must be at least 6 characters.");
      return;
    }
    if (!validateEmail(idEmail.value)) {
      Toast.warning("Please enter a valid email address.");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Registering...";
    submitButton.classList.add("opacity-70");

    const formData = {
      identity_number: idNumber.value,
      username: idFullName.value,
      email: idEmail.value,
      phone: idPhone.value,
      age: idAge.value,
      password: idPassword.value,
    };

    try {
      const response = await fetch(
        "https://deployment-connectbq.onrender.com/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        Toast.success("Registration successful! Now, please log in.");
        window.location.href = "";
        window.location.href = "./login.html";
      } else {
        Toast.error(data.message || "Registration error.");
      }
    } catch (error) {
      Toast.error("Could not connect to the server.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Sing In";
      submitButton.classList.remove("opacity-70");
    }
  });

  // Phone number validation (digits only)
  idPhone.addEventListener("input", () => {
    idPhone.value = idPhone.value.replace(/[^\d]/g, "");
  });

  // Age validation (digits only and greater than 0)
  idAge.addEventListener("input", () => {
    idAge.value = idAge.value.replace(/[^\d]/g, "");
    if (parseInt(idAge.value) < 0) {
      idAge.value = "";
    }
  });

  // ID number validation (digits only and max 20 characters)
  idNumber.addEventListener("input", () => {
    idNumber.value = idNumber.value.replace(/[^\d]/g, "");
    if (idNumber.value.length > 20) {
      idNumber.value = idNumber.value.slice(0, 20);
    }
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
});
