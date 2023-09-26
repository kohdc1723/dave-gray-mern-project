const { logEvents } = require("./logger");

const errorHandler = (err, req, res, next) => {
    const message = `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`;
    const filename = "errorLog.log";
    logEvents(message, filename);

    console.log(err.stack);
    const status = res.statusCode ? res.statusCode : 500; // server error

    return res.status(status).json({ message: err.message, isError: true });
};

module.exports = errorHandler;