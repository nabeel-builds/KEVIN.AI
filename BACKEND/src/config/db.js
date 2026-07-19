import mongoose from "mongoose";


async function connectDB(){

    try{
       await mongoose.connect(process.env.MONGO_URI,{
        tls:true,
        authSource: 'admin',
        serverSelectionTimeoutMS: 10000
       })
        console.log('Server is connected to DB')
    }catch(err){ 
        console.log('Database is not connected',err)
        process.exit(1)
    }
}

export default connectDB