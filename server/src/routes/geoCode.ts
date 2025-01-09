import express from "express";
import { getGeoCode, getGeoCodeByCampusCamera } from "../controller/geoCode";
const router = express.Router();

router.get("/", getGeoCode);
router.get("/:id", getGeoCodeByCampusCamera);
// router.post("/", createGeoCode);
// router.patch("/:id", updateGeoCode);
// router.delete("/:id", deleteGeoCode);

export default router;
