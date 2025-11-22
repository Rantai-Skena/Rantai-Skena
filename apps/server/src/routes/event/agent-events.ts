import { Hono } from "hono";
import applicationAgentRoutes from "../application/application.agent";
import eventManageRoutes from "./event.manage";

const router = new Hono();

router.route("/", eventManageRoutes);
router.route("/", applicationAgentRoutes);

export default router;
