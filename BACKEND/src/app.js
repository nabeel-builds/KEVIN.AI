import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import userRoute from './routes/user.route.js'
import projectRoute from './routes/project.route.js'
import aiRoutes from './routes/ai.route.js'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://kevin-ai-mu.vercel.app'
    ],
    credentials: true
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/users', userRoute)
app.use('/projects', projectRoute)
app.use('/ai', aiRoutes)

app.get('/', (req, res) => {
    res.send("Hello World!")
})

export default app