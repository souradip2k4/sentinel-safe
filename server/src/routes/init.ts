import express from "express";
const router = express.Router();
import { initGeoCode } from "../controller/init";

router.get("/geo", initGeoCode);

export default router;
