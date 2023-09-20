const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");

router.route("/").get(notesController.getAllNotes);
router.route("/").post(notesController.createNote);
router.route("/").patch(notesController.updateNote);
router.route("/").delete(notesController.deleteNote);

module.exports = router;