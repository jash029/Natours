// server/routes/visaRoutes.js
// Express API Router for Global Visa Sync

import express from "express";
import { visaController } from "../controllers/visaController.js";

const router = express.Router();

// 1. Countries List
router.get("/countries", visaController.getCountries);

// 2. Visa Checklist Single Lookup
router.post("/visa-checklist", visaController.getChecklist);

// 3. Batch Passenger Manifest Benchmark
router.post("/batch-checklist", visaController.getBatchChecklist);

// 4. Cache Statistics & LRU Management
router.get("/cache/stats", visaController.getCacheStats);
router.post("/cache/purge", visaController.purgeCache);

export default router;
