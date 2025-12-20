import express from "express";
import { searchUserById, search } from "../controllers/search.controller.js";

const router = express.Router();

// ID lookup (unchanged)
router.get("/user/:id", searchUserById);

// Unified search endpoint (query or body):
// examples:
// GET /api/v1/search?q=react&type=projects&page=2&limit=5
// POST /api/v1/search { "q": "alice", "type": "users", "page": 1 }
router.get("/", search);
router.post("/", search);

export default router;