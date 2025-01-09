import express from "express";
import {
  createLocMetrics,
  getLocMetrics,
  getLocMetricsByIDCampus,
} from "../controller/LocMetrics";
const router = express.Router();

router.get("/", getLocMetrics);
router.get("/:id", getLocMetricsByIDCampus);
// router.get("/r/:id", getLocMetricsByRisk);
// router.get("/t/:id", getLocMetricsByTime);
// router.get("/o/", getLocMetricsByGeoCode);
// router.get("/l/", getLatestData);
router.post("/", createLocMetrics);
// router.patch("/c/:id", updateLocMetricsByCampus);
// router.patch("/:id", updateLocMetrics);
// router.delete("/:id", deleteLocMetrics);

export default router;
