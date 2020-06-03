const mongoose = require('mongoose');
const communitySchema = mongoose.Schema({
    user_id: String,
    user_name: String,
    title: String,
    content: String,
});

module.exports = mongoose.model("Community", communitySchema);