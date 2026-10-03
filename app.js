const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const User = require("./models/User");
const Election = require("./models/Election");
const Candidate = require("./models/Candidate");
const Vote = require("./models/Vote");

const app = express();
app.set("trust proxy", 1);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    },
    tls: {
        rejectUnauthorized: false
    }
});


app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static("public"));
app.use("/videos", express.static("videos"));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        console.log("DATABASE NAME:", mongoose.connection.name);
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;
        next();

    } catch (error) {
        console.log("JWT verification error:", error);

        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

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

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email first"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });

        res.json({
            message: "Login successful"
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error);

        res.status(500).json({
            message: "Login failed"
        });
    }
});

app.post("/api/logout", (req, res) => {
    res.clearCookie("token");

    res.json({
        message: "Logout successful"
    });
});

app.get("/api/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "You are authenticated",
            user
        });

    } catch (error) {
        console.log("Profile error:", error);

        res.status(500).json({
            message: "Unable to fetch profile"
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
        const {
            name,
            email,
            number,
            password
        } = req.body;

        if (!name || !email || !number || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        console.log("CHECKING EXISTING USER");

        const existingUser = await User.findOne({ email });

        console.log("EXISTING USER RESULT:", existingUser);

        // User already exists
        if (existingUser) {

            // Already verified account
            if (existingUser.isVerified) {
                return res.status(409).json({
                    message: "User already exists"
                });
            }

            // Account exists but email is not verified
            const newVerificationToken =
                crypto.randomBytes(32).toString("hex");

            existingUser.name = name;
            existingUser.number = number;
            existingUser.password = await bcrypt.hash(
                password,
                10
            );
            existingUser.verificationToken =
                newVerificationToken;

            await existingUser.save();

            console.log(
                "UNVERIFIED USER UPDATED:",
                existingUser
            );

            const verificationUrl =
                `${req.protocol}://${req.get("host")}/verify-email/${newVerificationToken}`;
            console.log(
                "RESENDING VERIFICATION EMAIL TO:",
                email
            );

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verify your Campus Vote Email",
                html: `
                    <h2>Welcome to Campus Vote</h2>

                    <p>
                        Your Campus Vote account is already registered,
                        but your email is not verified yet.
                    </p>

                    <p>
                        Please click the link below to verify your email:
                    </p>

                    <a href="${verificationUrl}">
                        Verify Email
                    </a>

                    <p>
                        After verification, you can login to Campus Vote.
                    </p>
                `
            });

            return res.json({
                message:
                    "Your email is not verified yet. A new verification link has been sent to your email."
            });
        }

        // New user
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const verificationToken =
            crypto.randomBytes(32).toString("hex");

        const newUser = new User({
            name,
            email,
            number,
            password: hashedPassword,
            verificationToken
        });

        await newUser.save();

        console.log("USER SAVED:", newUser);

        const verificationUrl =

            `${req.protocol}://${req.get("host")}/verify-email/${verificationToken}`;
        console.log("SENDING EMAIL TO:", email);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your Campus Vote Email",
            html: `
                <h2>Welcome to Campus Vote</h2>

                <p>
                    Please verify your email address by clicking
                    the link below:
                </p>

                <a href="${verificationUrl}">
                    Verify Email
                </a>

                <p>
                    This link is used to activate your account.
                </p>
            `
        });

        res.json({
            message:
                "Registration successful. Please check your email to verify your account."
        });

    } catch (error) {
        console.log("REGISTRATION ERROR:", error);

        res.status(500).json({
            message: "Registration failed"
        });
    }
});

app.get("/verify-email/:token", async (req, res) => {
    try {
        const token = req.params.token;

        const user = await User.findOne({
            verificationToken: token
        });

        if (!user) {
            return res.status(400).send(
                "Invalid verification link"
            );
        }

        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();

        res.send(
            "Email verified successfully! You can now login."
        );

    } catch (error) {
        console.log("Verification error:", error);

        res.status(500).send(
            "Email verification failed"
        );
    }
});

app.get("/elections", async (req, res) => {
    try {
        const elections = await Election.find();

        console.log("ELECTIONS:", elections);

        res.render("elections", {
            elections
        });

    } catch (error) {
        console.log("Election fetch error:", error);

        res.status(500).send(
            "Unable to load elections"
        );
    }
});

app.get("/create-election", (req, res) => {
    res.render("create-election");
});

app.post("/api/elections", async (req, res) => {
    try {
        const {
            title,
            status,
            date,
            votingTime
        } = req.body;

        if (!title || !status || !date || !votingTime) {
            return res.status(400).json({
                message: "Please fill all election fields"
            });
        }

        const newElection = new Election({
            title,
            status,
            date,
            votingTime
        });

        await newElection.save();

        console.log(
            "ELECTION SAVED:",
            newElection
        );

        res.json({
            message: "Election created successfully",
            election: newElection
        });

    } catch (error) {
        console.log(
            "Election Error:",
            error
        );

        res.status(500).json({
            message: "Election creation failed"
        });
    }
});

app.post("/api/elections/ongoing", async (req, res) => {
    try {
        const { electionId } = req.body;

        if (!electionId) {
            return res.status(400).json({
                message: "Election ID is required"
            });
        }

        const election =
            await Election.findByIdAndUpdate(
                electionId,
                {
                    status: "ongoing"
                },
                {
                    new: true
                }
            );

        if (!election) {
            return res.status(404).json({
                message: "Election not found"
            });
        }

        res.json({
            message: "Election is now ongoing",
            election
        });

    } catch (error) {
        console.log(
            "Ongoing Election Error:",
            error
        );

        res.status(500).json({
            message:
                "Election could not be made ongoing"
        });
    }
});

app.post("/api/elections/completed", async (req, res) => {
    try {
        const { electionId } = req.body;

        if (!electionId) {
            return res.status(400).json({
                message: "Election ID is required"
            });
        }

        const election =
            await Election.findByIdAndUpdate(
                electionId,
                {
                    status: "completed"
                },
                {
                    new: true
                }
            );

        if (!election) {
            return res.status(404).json({
                message: "Election not found"
            });
        }

        res.json({
            message: "Election is now completed",
            election
        });

    } catch (error) {
        console.log(
            "Completed Election Error:",
            error
        );

        res.status(500).json({
            message:
                "Election could not be completed"
        });
    }
});

app.get("/create-candidate", async (req, res) => {
    try {
        const elections = await Election.find();

        res.render("create-candidate", {
            elections
        });

    } catch (error) {
        console.log(
            "Election fetch error:",
            error
        );

        res.status(500).send(
            "Unable to load elections"
        );
    }
});

app.post("/api/candidates", async (req, res) => {
    try {
        const {
            name,
            position,
            election
        } = req.body;

        if (!name || !position || !election) {
            return res.status(400).json({
                message:
                    "Please fill all candidate fields"
            });
        }

        const electionExists =
            await Election.findById(election);

        if (!electionExists) {
            return res.status(404).json({
                message: "Election not found"
            });
        }

        const newCandidate = new Candidate({
            name,
            position,
            election
        });

        await newCandidate.save();

        console.log(
            "CANDIDATE SAVED:",
            newCandidate
        );

        res.json({
            message:
                "Candidate created successfully",
            candidate: newCandidate
        });

    } catch (error) {
        console.log(
            "Candidate Error:",
            error
        );

        res.status(500).json({
            message:
                "Candidate creation failed"
        });
    }
});

app.get("/candidates", async (req, res) => {
    try {
        const candidates =
            await Candidate.find()
                .populate("election");

        res.render("candidates", {
            candidates
        });

    } catch (error) {
        console.log(
            "Candidate fetch error:",
            error
        );

        res.status(500).send(
            "Unable to load candidates"
        );
    }
});

app.get("/vote/:electionId", async (req, res) => {
    try {
        const { electionId } = req.params;

        const election =
            await Election.findById(electionId);

        if (!election) {
            return res.status(404).send(
                "Election not found"
            );
        }

        const candidates =
            await Candidate.find({
                election: electionId
            });

        res.render("vote", {
            election,
            candidates
        });

    } catch (error) {
        console.log(
            "Vote page error:",
            error
        );

        res.status(500).send(
            "Unable to load voting page"
        );
    }
});

app.get("/create-vote", async (req, res) => {
    try {
        const users = await User.find()
            .select("-password");

        const elections =
            await Election.find();

        const candidates =
            await Candidate.find();

        res.render("create-vote", {
            users,
            elections,
            candidates
        });

    } catch (error) {
        console.log(
            "Vote page fetch error:",
            error
        );

        res.status(500).send(
            "Unable to load vote page"
        );
    }
});

app.post(
    "/api/votes",
    authenticateToken,
    async (req, res) => {
        try {
            const {
                election,
                candidate
            } = req.body;

            const user = req.user.userId;

            if (!election || !candidate) {
                return res.status(400).json({
                    message:
                        "Election and candidate are required"
                });
            }

            const selectedElection =
                await Election.findById(election);

            if (!selectedElection) {
                return res.status(404).json({
                    message:
                        "Election not found"
                });
            }

            if (selectedElection.status !== "ongoing") {
                return res.status(400).json({
                    message:
                        "Voting is not open for this election"
                });
            }

            const selectedCandidate =
                await Candidate.findById(candidate);

            if (!selectedCandidate) {
                return res.status(404).json({
                    message:
                        "Candidate not found"
                });
            }

            if (
                selectedCandidate.election.toString() !==
                election.toString()
            ) {
                return res.status(400).json({
                    message:
                        "Candidate does not belong to this election"
                });
            }

            const existingVote =
                await Vote.findOne({
                    user,
                    election
                });

            if (existingVote) {
                return res.status(409).json({
                    message:
                        "You have already voted in this election"
                });
            }

            const newVote = new Vote({
                user,
                election,
                candidate
            });

            await newVote.save();

            console.log(
                "VOTE SAVED:",
                newVote
            );

            res.json({
                message:
                    "Vote submitted successfully",
                vote: newVote
            });

        } catch (error) {
            console.log(
                "Vote error:",
                error
            );

            res.status(500).json({
                message:
                    "Vote submission failed"
            });
        }
    }
);

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
    console.log(
        `Server running on port ${PORT}`
    );
});