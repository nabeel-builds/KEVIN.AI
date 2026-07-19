import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({

    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: [true, 'Project name already exist'],
    },

    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },

    isAdminProject:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

const Project = mongoose.model('project', projectSchema)

export default Project