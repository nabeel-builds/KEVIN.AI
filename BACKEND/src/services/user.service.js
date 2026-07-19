import userModel from '../model/user.model.js'

export const createUser = async ({ username, email, password }) => {

    if (!email || !password) {
        throw new Error("Email and password are required")
    }

    if(!username){
        throw new Error ("Username is required")
    }


    const existingUser = await userModel.findOne({ 
        username: username.trim() 
    })

     if (existingUser) {
        throw new Error("Username is already exist")
    }

    const hashedPassword = await userModel.hashPassword(password)

    const user = await userModel.create({

        email,
        password: hashedPassword,
        username: username.trim()

    })

    return user

}

export const getAllUsers = async ({ userId }) => {

    const users = await userModel.find({
        _id: { $ne: userId }
    })

    return users
}