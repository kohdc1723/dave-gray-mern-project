const mongoose = require("mongoose");
const { autoIncrement } =  require("mongoose-plugin-autoinc");

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    title: {
        type: String,
        require: true
    },
    text: {
        type: String,
        require: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

noteSchema.plugin(autoIncrement, {
    model: "Note",
    field: "ticket",
    startAt: 500
});

module.exports = mongoose.model("Note", noteSchema);