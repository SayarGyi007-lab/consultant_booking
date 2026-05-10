import { Router } from "express";
import { protect } from "../middlewares/authentication";
import { createReview, deleteReview, getReviewsByConsultant, updateReview } from "../controller/review.controller";
import { userOnly } from "../middlewares/authorization";
import { validate } from "../middlewares/validation";
import { createReviewSchema, updateReviewSchema } from "../validation/review";

const router = Router();

router.post("/", protect, userOnly, validate(createReviewSchema), createReview);
router.put("/:consultantId", protect, userOnly, validate(updateReviewSchema), updateReview);
router.delete("/:consultantId", protect, userOnly, deleteReview);
router.get("/:consultantId", protect, getReviewsByConsultant);

export default router;