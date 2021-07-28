let mongoose = require('mongoose')
let Schema = mongoose.Schema
let userSchema = new Schema({
    uname: String,
    upwd: Number
})
let userModel = mongoose.model('user',userSchema)
module.exports = userModel