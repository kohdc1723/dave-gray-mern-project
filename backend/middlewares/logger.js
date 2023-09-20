const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, filename) => {
    const log = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
        }

        await fsPromises.appendFile(path.join(__dirname, "..", "logs", filename), log);
    } catch (err) {
        console.log(err);
    }
};

const logger = (req, res, next) => {
    const message = `${req.method}\t${req.url}\t${req.headers.origin}`;
    const filename = "requestLog.log";
    logEvents(message, filename);

    console.log(`${req.method} ${req.path}`);
    next();
};

module.exports = { logEvents, logger };