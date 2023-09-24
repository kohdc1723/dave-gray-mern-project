const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

/**
 * @desc Login
 * @route POST /auth
 * @access Public
**/
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "all fields are required" });
    }

    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: "unauthorized" });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
        return res.status(401).json({ message: "unauthorized" });
    }

    // create access token
    const accessToken = jwt.sign(
        { "userinfo": { username: foundUser.username, roles: foundUser.roles } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );

    // create refresh token
    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    // create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
        httpOnly: true, // accessible only by web server
        secure: true, // https
        sameSite: "none", // cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days, cookie expiry: set to match refresh token
    });

    // send access token containing username and roles
    return res.json({ accessToken });
});

/**
 * @desc Refresh
 * @route GET /auth/refresh
 * @access Public
**/
const refresh = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(401).json({ message: "unauthorized" });
    }

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, asyncHandler(async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "forbidden" });
        }
        
        const foundUser = await User.findOne({ username: decoded.username });
        if (!foundUser) {
            return res.status(401).json({ message: "unauthorized" });
        }

        const accessToken = jwt.sign(
            { "userinfo": { username: foundUser.username, roles: foundUser.roles } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        return res.json({ accessToken });
    }));
};

/**
 * @desc Logout
 * @route POST /auth/logout
 * @access Public
**/
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204) // no content
    }

    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true
    });
    
    return res.json({ message: "cookie cleared" });
};

module.exports = {
    login,
    refresh,
    logout
};