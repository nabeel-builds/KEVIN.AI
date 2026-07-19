import projectModel from "../model/project.model.js";
import * as projectService from '../services/project.service.js'
import { validationResult } from 'express-validator'
import userModel from '../model/user.model.js'
import Project from "../model/project.model.js";

export const createProject = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {

        const { name } = req.body

        const loggedInUser = await userModel.findOne({ email: req.user.email })
        const userId = loggedInUser._id

        const isAdmin = loggedInUser.role === 'admin'

        const newProject = await projectService.createProject({
            name,
            userId,
            createdBy: userId,
            isAdminProject: isAdmin
        })

        return res.status(201).json(newProject)

    } catch (err) {

        console.log(err)
        res.status(400).send(err.message)

    }


}

export const getAllProjects = async (req, res) => {

    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUserProjects = await projectService.getAllProjectByUserId({
            userId: loggedInUser._id
        })

        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: err.message
        })
    }

}

export const addUserToProject = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {

        const { projectId, users } = req.body

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const project = await projectService.addUsersToProjects({
            projectId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: err.message
        })
    }

}

export const getProjectById = async (req, res) => {

    const { projectId } = req.params

    try {

        const project = await projectService.getProjectById({ projectId })

        return res.status(200).json({
            project
        })

    } catch (err) {

        console.log(err)
        return res.status(400).json({
            error: err.message
        })

    }

}

export const deleteProject = async (req, res) => {

    try {
        const { projectId } = req.params

        const project = await Project.findByIdAndDelete(projectId)

        if (!project) {

            return res.status(404).json({
                message: 'Project Not Found'
            })

        }

        res.status(200).json({
            message: 'Project Deleted Successfully',
            project
        })

    } catch (err) {

        res.status(500).json({
            message: 'Server Error',
            error: err.message
        })

    }

}