console.log("ELECTION JS FILE LOADED");
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
            alert("Password charcters should at least 6 characters ");
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
let ToggleEye = document.getElementById(".toggle-eye");

if (passwordInput && ToggleEye) {
    ToggleEye.addEventListener("click", function () {
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
                console.log("LOGIN SUCCESS");
                console.log("JWT TOKEN:", data.token);
                alert(data.message);
                //window.location.href = "/";
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
// ELECTIONS

let ongoingButtons = document.querySelectorAll(".make-ongoing-btn");

ongoingButtons.forEach(function (button) {

    button.addEventListener("click", async function () {

        let electionId = button.dataset.electionId;

        try {

            const response = await fetch("/api/elections/ongoing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    electionId: electionId
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.reload();
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong. Please try again.");
        }

    });

});


let completedButtons = document.querySelectorAll(".make-completed-btn");

completedButtons.forEach(function (button) {

    button.addEventListener("click", async function () {

        let electionId = button.dataset.electionId;

        try {

            const response = await fetch("/api/elections/completed", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    electionId: electionId
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                window.location.reload();
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong. Please try again.");
        }

    });

});

let calendar = document.getElementById("calendar");

if (calendar) {
    calendar.addEventListener("click", async function () {
        try {
            const response = await fetch("/api/elections/calendar", {
                method: "POST",
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert("Calendar is not available .")
            }
        }
        catch (error) {
            console.log("error");
            alert("Something went wrong. Please try again.")
        }
    });

}
let voteForm = document.getElementById("vote-form");

if (voteForm) {
    voteForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const selectedCandidate = document.querySelector(
            'input[name="candidate"]:checked'
        );
        if (!selectedCandidate) {
            alert("Please select a candidate");
            return;
        }
        const candidateId = selectedCandidate.value;
        const electionId = voteForm.dataset.electionId;

        console.log("Election ID:", electionId);
        console.log("Candidate ID:", candidateId);

        console.log("Selected Candidate ID:", candidateId);
        const response = await fetch("/api/votes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                election: electionId,
                candidate: candidateId
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
        } else {
            alert(data.message);
        }
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
