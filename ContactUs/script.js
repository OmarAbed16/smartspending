"use strict";

document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // EmailJS parameters
    const templateParams = {
      name: name,
      email: email,
      message: message,
    };

    // Send the email using EmailJS
    emailjs.send("service_d7lit7t", "template_llrt1qs", templateParams).then(
      function (response) {
        document.getElementById("error").innerHTML =
          "<h3 style='color:green;'>Thank you for your submission!</h3>";
      },
      function (error) {
        document.getElementById("error").innerHTML =
          "There was an error sending the message.";
      }
    );
  });
