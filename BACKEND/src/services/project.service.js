import mongoose from 'mongoose'
import projectModel from '../model/project.model.js'

export const createProject = async ({ name, userId, createdBy, isAdminProject }) => {

    if (!name) {
        throw new Error('Name is required')
    }

    if (!userId) {
        throw new Error('User is required')
    }

    // Create a Project
    const project = await projectModel.create({
        name,
        users: [userId],
        createdBy,
        isAdminProject
    })

    return project
}


export const getAllProjectByUserId = async ({ userId }) => {

    if (!userId) {
        throw new Error('User Id is required')
    }

    const allUserProjects = await projectModel.find({
        users: userId
    }).populate('createdBy', 'name email role')

    return allUserProjects

}

export const addUsersToProjects = async ({ projectId, users, userId }) => {

    if (!projectId) {
        throw new Error("projectId id required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Inavlid projectId")
    }


    if (!users) {
        throw new Error("users id required")
    }

    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid userId(s) in users array")
    }

    if (!userId) {
        throw new Error("userId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId")
    }

    const project = await projectModel.findOne({
        _id: projectId,
        users: userId
    })

    if (!project) {
        throw new Error("User not belong to this project")
    }



    const updatedProject = await projectModel.findByIdAndUpdate({
        _id: projectId
    }, {
        $addToSet: {
            users: {
                $each: users
            }
        }
    }, {
        new: true
    })

    return updatedProject

}

export const getProjectById = async ({ projectId }) => {

    if (!projectId) {
        throw new Error("ProjectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid ProjectId")
    }

    const project = await projectModel.findById(projectId).populate('users', 'username').populate('createdBy', 'name email role')

    return project

}