import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import http from 'http'
import app from './src/app.js'
import connectDB from './src/config/db.js'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import projectModel from './src/model/project.model.js'
import { generateResult } from "./src/services/ai.service.js";

connectDB()


const port = process.env.PORT || 3000

const server = http.createServer(app)


const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// Initialized Middleware for authenticate user
io.use(async (socket, next) => {
    try {

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1]

        const projectId = socket.handshake.query.projectId


        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid ProjectId'))
        }

        socket.project = await projectModel.findById(projectId)


        socket.project = await projectModel.findById(projectId)

        if (!socket.project) {
            return next(new Error('Project not found'))
        }

        if (!token) {
            return next(new Error('Authentication error'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return next(new Error('Authentication error'))
        }

        socket.user = decoded

        next()

    } catch (err) {
        next(err)
    }
})



io.on('connection', socket => {

    socket.roomId = socket.project._id.toString()

    console.log("a user connected")



    socket.join(socket.roomId)

    socket.on('project-message', async data => {

        const message = data.message

        const aiIsPresentInMessage = message.includes('@ai');

        if (aiIsPresentInMessage) {

            const prompt = message.replace('@ai', '')
            const result = await generateResult(prompt)
            io.to(socket.roomId).emit('project-message', {
                message: result,
                user: {
                    _id: 'ai',
                    username: 'AI'
                }
            })
            return
        }



        socket.broadcast.to(socket.roomId).emit('project-message', data)
    })


    socket.on('disconnect', () => {
        console.log('user disconnected')
        socket.leave(socket.roomId)
    });
});



server.listen(port, () => {
    console.log(`Server is running on ${port}`)
})