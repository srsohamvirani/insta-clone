const express = require("express");
const app = express();
const PORT = 5000;
const cors = require("cors");
const data = require("./data")


app.use(cors());

app.get("/about", (req, res) => {
    res.json("about page");
});

app.get("/", (req, res) => {
    res.json(data);
});

app.listen(PORT, () => {
    console.log("Server is running on" + PORT);    
});