let mongoose = require('mongoose')
let userModel = require('./model/user')

mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true , useUnifiedTopology: true},(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('连接成功');
    }
})

// userModel.create({
//     uname: 'xixi',
//     upwd: 123
// },function(err){
//     if(!err){
//         console.log('插入成功。。。。。');
//     }
// })
module.exports = {userModel}