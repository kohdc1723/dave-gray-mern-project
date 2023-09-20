const asyncHandler = require("express-async-handler");
const Note = require("../models/Note");
const User = require("../models/User");

/**
 * @desc Get all notes
 * @route GET /notes
 * @access Private
**/
const getAllNotes = asyncHandler(async (req, res) => {
    // get all notes from db
    const notes = await Note.find().lean();

    if (!notes.length) {
        return res.status(400).json({ message: "no notes found" });
    }

    const notesWithUsername = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec();

        return { ...note, username: user.username };
    }));

    return res.json(notesWithUsername);
});

/**
 * @desc Create new note
 * @route POST /notes
 * @access Private
**/
const createNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;

    // confirm body data
    if (!user || !title || !text) {
        return res.status(400).json({ message: "all fields are required" });
    }

    // check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: "duplicate note title" });
    }

    // create and store new note
    const note = await Note.create({ user, title, text });
    if (note) {
        return res.status(201).json({ message: "new note created" });
    } else {
        return res.status(400).json({ messge: "invalid note data received" });
    }
});

/**
 * @desc Update a note
 * @route PATCH /notes
 * @access Private
**/
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body;

    // confirm body data
    if (!id || !user || !title || !text || typeof completed !== "boolean") {
        return res.status(400).json({ message: "all fields are required" });
    }

    // confirm note existence
    const note = await Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: "note not found" });
    }

    // check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec();

    // allow rename of the note
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "duplicate note title" });
    }

    // update the note
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;
    const updatedNote = await note.save();

    return res.json(`${updatedNote.title} updated`);
});

/**
 * @desc Delete a note
 * @route DELETE /notes
 * @access Private
**/
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // confirm body data
    if (!id) {
        return res.status(400).json({ message: "note id required" });
    }

    // confirm note exists to delete
    const note = await Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: "note not found" });
    }

    // delete the note
    const result = await note.deleteOne();

    return res.json({ message: `note ${result.title} with id ${result._id} deleted` });
});

module.exports = {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
};