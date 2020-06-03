const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: String,
    id: String,
    password: String,
});

module.exports = mongoose.model("User", userSchema);