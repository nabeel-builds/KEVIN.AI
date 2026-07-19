import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {

    try {

        // Finding the Token
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).send({ error: 'Unauthorized User' })
        }

        // After Redis Initialization
        // If token is already used and find in in Redis 
        const isBlackListedToken = await redisClient.get(token)

        if (isBlackListedToken) {

            res.cookie('token', ' ')

            return res.status(401).send({
                error: 'Unauthorized User'
            })
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()

    } catch (err) {
        console.log('AUTH ERROR:', err.message)
        res.status(401).send({ error: err.message })
    }

}
