import express from 'express'
import { Router } from "express";
import * as aiController from "../controllers/ai.controller.js";

const router = express.Router()

router.get('/get-result', aiController.getResult)

export default router