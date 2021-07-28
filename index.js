let express = require('express')
let {ApolloServer , gql , UserInputError} = require('apollo-server-express')
let cors = require('cors')

let {userModel} = require('./tools/connect')



let todoLists = [
    {time: '7:00' , event: '起床'},
    {time: '8:00' , event: '出门'},
    {time: '9:00' , event: '开始工作'},
    {time: '11:30', event:'吃午饭'},
    {time: '14:30', event:'开始下午工作'},
    {time: '18:00', event:'下班回家'}
]





let typeDefs = gql(`
    type User{
        _id: ID,
        uname: String,
        upwd: Int
    }
    type flag{
        state: Boolean
    }
    type userPayload{ 
        user: User
    }
    type list{
        time: String,
        event: String
    }
    
    input loginInput {
        uname: String!,
        upwd: Int!
    }
    input createUserInput{
        uname: String!,
        upwd: Int!
    }

    type Query{
        users: [User!],
        todoLists: [list]
    }

    type Mutation{
        login(user: loginInput): userPayload,
        createUser(user: createUserInput): userPayload

        createTodoList(time: String , event: String): list
        deleteTodoList(time: String): flag
        updateTodoList(time: String , event: String): list
    }
`)

let resolvers = {
    Query: {
        async users(){
            const users = await userModel.find()
            return users
        },
        todoLists(){
            return todoLists
        }
    },
    Mutation: {
        async createUser(parent,args,context){
            //判断用户是否存在
            // console.log(args.user.uname);
             let uname = args.user.uname
             let upwd = args.user.upwd
             let checkUser = await new Promise((resolve,reject)=>{
                userModel.find({uname},function(err,docs){
                    if(!err){
                        resolve(docs)
                    }else{
                        reject('出错了')
                    }
                })
            })
            if(checkUser.length == 0){
                let createUser = await new Promise((resolve,reject)=>{
                    userModel.create({
                        uname,
                        upwd
                    },(err,docs) => {
                        if(!err){
                            resolve(docs)
                        }else{
                            reject('error')
                        }
                    })
                })
                console.log(createUser);
                return {
                    user: {
                        ...createUser.toObject()
                    }
                }
            }else{
                throw new  UserInputError('用户已存在')
            }

        },
        async login(parent,args,context){
            let uname = args.user.uname
            let upwd = args.user.upwd
            let user = await new Promise((resolve,reject)=>{
                userModel.find({uname , upwd},(err,docs)=>{
                    if(!err){
                        resolve(docs)
                    }else{
                        reject('error')
                    }
                })
            })
            console.log(user);        
            if(user.length !== 0){ //用户存在
                return {
                    user: {
                        ...user[0].toObject()
                    }
                }
            }else{
                throw new UserInputError('账户或密码错误')
            }
        },
        createTodoList(parent,args,context){
            let list = {}
            list.time = args.time
            list.event = args.event
            todoLists.push(list)
            return list
        },
        deleteTodoList(parent,args,context){
            let value = todoLists.find(list=>{
                return list.time == args.time
            })
            let index = todoLists.indexOf(value)
            console.log(value,index);
            if(index !== -1){
                todoLists.splice(index,1)
                return{
                    state: true
                }
            }else{
                return{
                    state: false
                }
            }
        },
        updateTodoList(parent,args,context){
            let time = args.time
            let event = args.event
            let targetList = todoLists.find(list=>list.time == time
            )
            if(targetList !== undefined){
                targetList.event = event
                return{
                    ...targetList
                }
            }else{
                return {
                    time: "error",
                    event: "error"
                }
            }
           
        }
        
    }
}

let app = express()
app.use(cors())
let server = new ApolloServer({
    typeDefs,
    resolvers,
    
})

async function fun1(){
await server.start()
server.applyMiddleware({app})
app.listen({port:4000}, ()=>{
    console.log(`4000端口服务已经启动。。。。。`);
})
}
fun1()

app.get('/',(req,res)=>{
    res.send('hello')
})