import express from "express";
import jobsRouter from "./jobsRouter";
import favoritesRouter from "./favoritesRouter";
import positionRouter from "./positionRouter";

const router = express.Router();

router.use("/jobs", jobsRouter)
router.use("/favorites", favoritesRouter)
router.use("/position", positionRouter)

export { router }