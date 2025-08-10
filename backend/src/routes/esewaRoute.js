import express from "express";
import { completePayment, fillEsewaForm, initializePayment } from "../controllers/esewa.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.route("/initialize-esewa").post(protect,initializePayment);
router.route("/complete-payment").get(completePayment);
router.route("/generate-esewa-form").get(fillEsewaForm);

export default router;
