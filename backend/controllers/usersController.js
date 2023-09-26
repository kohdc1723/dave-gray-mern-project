const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Note = require("../models/Note");

/**
 * @desc Get all users
 * @route GET /users
 * @access Private
**/
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").lean();

    if (!users) {
        return res.status(400).json({ message: "no users found" });
    } else {
        return res.json(users);
    }
});

/**
 * @desc Create new user
 * @route POST /users
 * @access Private
**/
const createUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    // confirm body data
    if (!username || !password) {
        return res.status(400).json({ message: "all fields are required" });
    }

    // check for duplicate username
    const duplicate = await User.findOne({ username }).collation({ locale: "en", strength: 2 }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: "duplicate username" });
    }

    // hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userObject = (!Array.isArray(roles) || !roles.length) ? (
        { username, password: hashedPassword }
    ) : (
        { username, password: hashedPassword, roles }
    );

    // create and store new user
    const user = await User.create(userObject);

    if (user) {
        return res.status(201).json({ message: `new user ${username} created` });
    } else {
        return res.status(400).json({ message: `invalid user data received` });
    }
});

/**
 * @desc Update a user
 * @route PATCH /users
 * @access Private
**/
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    // confirm body data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
        return res.status(400).json({ message: "all fields are required" });
    }

    // confirm the user existence
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "user not found" });
    }

    // check for duplicate
    const duplicate = await User.findOne({ username }).collation({ locale: "en", strength: 2 }).lean().exec();
    // allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "duplicate username" });
    }

    // update the user
    user.username = username;
    user.roles = roles;
    user.active = active;
    if (password) user.password = await bcrypt.hash(password, 10);

    const updatedUser = await user.save();

    return res.json({ message: `${updatedUser.username} updated` });
});

/**
 * @desc Delete a user
 * @route DELETE /users
 * @access Private
**/
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // confirm body data
    if (!id) {
        return res.status(400).json({ message: "user id required" });
    }

    // check for the assigned notes
    const notes = await Note.findOne({ user: id }).lean().exec();
    if (notes) {
        return res.status(400).json({ message: "user has assigned notes" });
    }

    // delete the user
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "user not found" });
    } else {
        const result = await user.deleteOne();
        return res.json({ message: `username ${result.username} with id ${result._id} deleted` });
    }
});

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};