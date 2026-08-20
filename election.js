// REGISTER

let registerForm = document.getElementById("register-form");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let userName = document.getElementById("name").value.trim();
        let userEmail = document.getElementById("email").value.trim();
        let userPassword = document.getElementById("password").value;

        if (userName === "" || userEmail === "" || userPassword === "") {
            alert("Please fill all the fields.");
            return;
        }

        if (userPassword.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        localStorage.setItem("userName", userName);
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("userPassword", userPassword);

        alert("Registration successful!");

        registerForm.reset();

        window.location.href = "login.html";
    });
}


// LOGIN

let loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let loginEmail = document.getElementById("email").value.trim();
        let loginPassword = document.getElementById("password").value;

        let savedEmail = localStorage.getItem("userEmail");
        let savedPassword = localStorage.getItem("userPassword");

        if (loginEmail === "" || loginPassword === "") {
            alert("Please enter email and password.");
            return;
        }

        if (
            loginEmail === savedEmail &&
            loginPassword === savedPassword
        ) {
            localStorage.setItem("isLoggedIn", "true");

            alert("Login successful!");

            loginForm.reset();

            window.location.href = "votehub.html";
        } else {
            alert("Invalid email or password.");
        }
    });
}


// ELECTIONS

let ongoing = document.getElementById("ongoing");

if (ongoing) {
    ongoing.addEventListener("click", function () {
        alert("Campus Leadership Election is currently ongoing.");
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
