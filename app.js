require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const User = require("./models/User");
const Election = require("./models/Election");
const Candidate = require("./models/Candidate");
const Vote = require("./models/Vote");
const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });



app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use("/videos", express.static("videos"));

app.get("/", (req, res) => {
    res.render("votehub");
});
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/api/login", async (req, res) => {
    console.log("LOGIN ROUTE HIT");
    console.log("FORM DATA:", req.body);

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        res.json({
            message: "Login successful"
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error);

        res.status(500).json({
            message: "Login  failed"
        });
    }
});

app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/api/register", async (req, res) => {
    console.log("REGISTER ROUTE HIT");
    console.log("FORM DATA:", req.body);

    try {
        const { name, email, password } = req.body;

        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();

        console.log("USER SAVED:", newUser);

        res.json({
            message: "Registration successfull"
        });

    } catch (error) {
        console.log("SAVE ERROR:", error);

        res.status(500).json({
            message: "Registration failed"
        });
    }
});
app.get("/create-election", (req, res) => {
    res.render("create-election");
});


app.get("/create-candidate", async (req, res) => {
    try {
        const elections = await Election.find();

        res.render("create-candidate", {
            elections
        });

    } catch (error) {
        console.log("Election fetch error:", error);

        res.status(500).send("Unable to load elections");
    }
});




app.post("/api/elections", async (req, res) => {

    try {
        const { title, status, date, votingTime } = req.body;


        const newElection = new Election({
            title,
            status,
            date,
            votingTime
        });

        await newElection.save();
        console.log("ELECTION SAVED:", newElection);

        res.json({
            message: "Election created successfully",
            election: newElection
        });


    } catch (error) {
        console.log("Election Error", error);


        res.status(500).json({
            message: "Election creation failed"
        });
    }
});

app.post("/api/candidates", async (req, res) => {
    try {
        const { name, position, election } = req.body;

        const newCandidate = new Candidate({
            name,
            position,
            election
        });

        await newCandidate.save();

        console.log("CANDIDATE SAVED:", newCandidate);

        res.json({
            message: "Candidate created successfully",
            candidate: newCandidate
        });

    } catch (error) {
        console.log("Candidate Error:", error);

        res.status(500).json({
            message: "Candidate creation failed"
        });
    }
});
app.get("/candidates", async (req, res) => {
    try {
        const candidates = await Candidate.find()
            .populate("election");

        res.render("candidates", {
            candidates
        });

    } catch (error) {
        console.log("Candidate fetch error:", error);

        res.status(500).send("Unable to load candidates");
    }
});

app.post("/api/votes", async (req, res) => {
    try {
        const { user, election, candidate } = req.body;
        const newVote = new Vote({
            user,
            election,
            candidate
        });
        await newVote.save();
        console.log("VOTE SAVED:", newVote);
        res.json({
            message: "Vote created successfully",
            vote: newVote
        });
    } catch (error) {
        console.log("Vote error", error);
        res.status(500).json({
            message: "Vote creation failed"
        });
    }
});



app.get("/create-vote", async (req, res) => {
    try {
        const users = await User.find();
        const elections = await Election.find();
        const candidates = await Candidate.find();

        res.render("create-vote", {
            users,
            elections,
            candidates

        });

    } catch (error) {
        console.log("Vote page fetch error:", error);
        res.status(500).send("Unable to load vote page");
    }
});


app.get("/resources", (req, res) => {
    res.render("resources");
});
app.get("/pricing", (req, res) => {
    res.render("pricing");
});
app.get("/contact", (req, res) => {
    res.render("contact");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
