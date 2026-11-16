const error = (err, req, res, next) => {
    // console.log("error handler");
    console.log("stack trace", err.stack);

    return res.status(500).json({
        error: "Internal server error. please check the log for details",
    })

}

module.exports = error;