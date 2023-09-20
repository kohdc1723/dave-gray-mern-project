require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const { logger, logEvents } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/dbConnect");

const PORT = process.env.PORT || 3500;

const app = express();

connectDB();

// middlewares
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/root"));
app.use("/users", require("./routes/usersRoutes"));
app.use("/notes", require("./routes/notesRoutes"));
app.all("*", (req, res) => {
    res.status(404);

    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ message: "404 not found" });
    } else {
        res.type("txt").send("404 not found");
    }
});

// error handler middleware
app.use(errorHandler)

mongoose.connection.once("open", () => {
    console.log("connected to mongodb");
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    });
});

mongoose.connection.on("error", err => {
    console.log(err);

    const error = `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`;
    const filename = "mongoErrorLog.log";
    logEvents(error, filename);
});