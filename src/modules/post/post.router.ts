import express, { Router } from "express";
import { postController } from "./post.controller";

import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", postController.getAllPost);

router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.getMyPosts
);

router.get(
    "/stats",
    auth(UserRole.ADMIN),
    postController.getStats
)


router.get("/:postId", postController.getPostById);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.createPost
);

router.patch(
    "/:postId",
    auth(UserRole.USER, UserRole.ADMIN),
    postController.updatePost
);

router.delete(
    "/:postId",
    auth(UserRole.USER, UserRole.ADMIN),
    postController.deletePost
)

export const postRouter: Router = router;
