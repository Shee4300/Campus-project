//register form
let registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let userName = document.getElementById("register").value.trim();
        let userEmail = document.getElementById("email").value.trim();
        let userNumber = document.getElementById("number").value;
        let userPassword = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirm-password").value;

        if (userName === "" || userEmail === "" || userNumber === "" || userPassword === "" || confirmPassword == "") {
            alert("Please fill every fields");
            return;
        }
        if (userPassword.length < 6) {
            alert("Password charcters should be greater than 6");
            return;
        }
        if (confirmPassword !== userPassword) {
            alert("Please check the correct password");
            return;
        }
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: userName,
                    email: userEmail,
                    number: userNumber,
                    password: userPassword,

                })
            })
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                window.location.href = "/";
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong. Please try again.");
        }
    });
}
// PASSWORD TOGGLE EYE

let passwordInput = document.getElementById("password");
let toggleEye = document.querySelector(".toggle-eye");

if (passwordInput && toggleEye) {
    toggleEye.addEventListener("click", function () {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }

    });
}


// CONFIRM PASSWORD TOGGLE EYE

let confirmPasswordInput = document.getElementById("confirm-password");
let confirmToggleEye = document.querySelector(".confirm-toggle-eye");

if (confirmPasswordInput && confirmToggleEye) {
    confirmToggleEye.addEventListener("click", function () {

        if (confirmPasswordInput.type === "password") {
            confirmPasswordInput.type = "text";
        } else {
            confirmPasswordInput.type = "password";
        }

    });
}
//login
let loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let userEmail = document.getElementById("login").value.trim();
        let userPassword = document.getElementById("password").value;

        if (userEmail === "" || userPassword === "") {
            alert("Please fill both fields.");
            return;
        }

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: userEmail,
                    password: userPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.href = "/";
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong. Please try again.");
        }
    });
}


// ELECTIONS
let ongoing = document.getElementById("ongoing");

if (ongoing) {//
    ongoing.addEventListener("click", function () {
        alert("Campus Leadership Election is  currently ongoing ");
    });
}

let upcoming = document.getElementById("upcoming");

if (upcoming) {
    upcoming.addEventListener("click", function () {
        alert("Student Council Election is upcoming.");
    });
}

let completed = document.getElementById("completed");

if (completed) {
    completed.addEventListener("click", function () {
        alert("This election has already been completed.");
    });
}

let calendar = document.getElementById("calendar");

if (calendar) {
    calendar.addEventListener("click", function () {
        alert("Election Calendar selected.");
    });
}

// RESOURCES

let resourceCards = document.querySelectorAll(".resource-card");

resourceCards.forEach(function (card) {
    card.addEventListener("click", function () {
        console.log("Resource selected:", card.querySelector("h2").innerText);
    });
});


// FAQ

let faq = document.getElementById("FAQ-info");

if (faq) {
    let questions = faq.querySelectorAll("p");

    questions.forEach(function (question) {
        question.addEventListener("click", function () {
            question.style.fontWeight = "bold";
        });
    });
}


// CONTACT

let contactButton = document.querySelector(
    ".send-us-a-message button"
);

if (contactButton) {
    contactButton.addEventListener("click", function () {
        alert("Please contact us at campusvote@gmail.com");
    });
}


// PRICING

let pricingCards = document.querySelectorAll(".pricing-cards");

pricingCards.forEach(function (card) {
    card.addEventListener("click", function () {

        let planName = card.querySelector("h3");

        if (planName) {
            alert(planName.innerText + " selected.");
        }
    });
});


// DEMO VIDEO

let demoVideo = document.querySelector("video");

if (demoVideo) {

    demoVideo.addEventListener("play", function () {
        console.log("Demo video started.");
    });

    demoVideo.addEventListener("pause", function () {
        console.log("Demo video paused.");
    });

    demoVideo.addEventListener("ended", function () {
        alert("Demo video completed!");
    });
}


// USER LOGIN STATUS

let loggedIn = localStorage.getItem("isLoggedIn");

if (loggedIn === "true") {
    console.log("User is logged in.");
}


// LOGOUT

let logoutButton = document.getElementById("logout");

if (logoutButton) {
    logoutButton.addEventListener("click", function () {

        localStorage.removeItem("isLoggedIn");

        alert("You have been logged out.");

        window.location.href = "login.html";
    });
}
