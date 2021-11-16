const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const peopleSchema = new Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        default: '-'
    },
    LinkedinLink: {
        type: String,
        required: true,
    },
    WhereDidYouFindTheData: {
        type: String,
        required: true,
        default: "yarka"
    },
});
const peoplesModel = mongoose.model("people", peopleSchema);
module.exports = {
    peoplesModel,
};