import express  from "express";
import { getImageKitAuth }  from "../controllers/imageController.js";


const router = express.Router();

router.get("/imagekit", getImageKitAuth);

export default router;
