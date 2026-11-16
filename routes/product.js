const express = require('express');
const router = express.Router();

router.get("/start", (req, res) => {
    return res.status(200).json({message: "Products fetched success"});
});

module.exports = router;