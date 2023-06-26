// require('dotenv').config();
// const http = require('http');
// const app = require('./index');

// const server = http.createServer(app);

// server.listen(process.env.PORT);

// console.log('hiii from server');



require('dotenv').config();
const http = require('http');
const app = require('./index');
const cors = require("cors");
const { Server } = require("socket.io");
const ChatType = require('./model/chatType');
const chatMessage = require('./model/chatMessageSchema');
const User = require('./model/userSchema');
const Admin = require('./model/adminSchema');

app.use(cors());



const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST"]
    }
})

const users = {};
const admin = {};

io.on("connection", (socket) => {
    console.log(`User Connnected : ${socket.id}`);

    socket.on("join_room", (data, type) => {
        socket.join(data);
        const data1 = data;
        console.log(`User with Id: ${socket.id} joined room : ${data}`)
        console.log(typeof (data), type, '38');
        if (type === 'USER') {

            ChatType.find({ userid: data1 }, (err, result) => {
                if (err) {
                    console.error(err);
                    // Handle the error response here
                } else {
                    if (result) {
                        const resultLength = Object.keys(result).length;
                        console.log('Result length:', resultLength);
                        if (resultLength === 0) {
                            const user = ChatType({ userid: data1 })
                            user.save();

                        }
                    }
                    User.updateOne(
                        { userid: data1 },
                        { $set: { isOnline: true } },
                        (err, result) => {
                          if (err) {
                            console.error('Failed to update document:', err);
                            return;
                          }
                          //userOnline
                          socket.to(data).emit("userOnline", data1);
                        //   console.log('Document updated successfully');
                        //   console.log('Modified document count:', result.modifiedCount);
                        }
                      );

                    // Handle the result/response here
                }
            });


        }
        if (type === "ADMIN") {
            Admin.updateOne(
            { admin_id: "admin" },
            { $set: { isOnline: true } },
            (err, result) => {
              if (err) {
                console.error('Failed to update document:', err);
                return;
              }
              //userOnline
              socket.to(data).emit("adminOnline", data1);
           
            }
          );
        }
        



    })

    // chatting system
    socket.on("userMessage", (data) => {
        console.log(data);
        const { room, author, message, time } = data;
        const newChat = new chatMessage({ room, author, message, time });
        newChat.save()
            .then((savedChat) => {
                console.log('User message saved:', savedChat);
            })
            .catch((error) => {
                console.error('Error saving user message:', error);

            });
        socket.to(data.room).emit("admin_receive_message", data);
    })

    socket.on("adminMessgae", (data) => {
        const { room, author, message, time } = data;
        const newChat = new chatMessage({ room, author, message, time });
        newChat.save()
            .then((savedChat) => {
                console.log('User message saved:', savedChat);
            })
            .catch((error) => {
                console.error('Error saving user message:', error);

            });
        socket.to(data.room).emit("user_receive_message", data);
    })


    //User logout event
    socket.on('userLogout', (userId)=>{ 
        console.log('126');
        User.updateOne(
            { userid: userId },
            { $set: { isOnline: false } },
            (err, result) => {
              if (err) {
                console.error('Failed to update document:', err);
                return;
              }
            socket.to(userId).emit("userOffline", userId);
            }
          );  
    })

    //admin logout event
    socket.on('adminLogout',(adminId) => {
        console.log(adminId,'155');
        Admin.updateOne(
            {admin_id:adminId},
            {$set:{isOnline:false}},
            (err,result) => {
                if(err){
                    console.error('failed to update document:',err);
                    return;
                }
                socket.to(adminId).emit("falnaOffline",adminId);
            }
        );
    })

    socket.on("disconnect", () => {
        console.log(`user ${socket.id} disconnected`);
        // const userId = Object.keys(users).find((key)=>users[key] === socket.id);
        // if(userId){
        //     delete users[userId];
        //     io.emit('userOffline', userId);
        // }
    })
})





server.listen(process.env.PORT);

console.log('hiii from server');