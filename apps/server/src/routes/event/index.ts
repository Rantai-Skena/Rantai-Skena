import { Hono } from "hono";
import eventDetailRoutes from "./event.detail";
import eventListRoutes from "./event.list";
import eventManageRoutes from "./event.manage";

const router = new Hono();

router.route("/", eventListRoutes);
router.route("/", eventDetailRoutes);
router.route("/", eventManageRoutes);

export default router;
