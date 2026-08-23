const express = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use("/videos", express.static("videos"));

app.get("/", (req, res) => {
    res.render("votehub");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
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
app.get("/elections", (req, res) => {
    res.render("elections");
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
