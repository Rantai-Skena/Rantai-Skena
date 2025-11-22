import "dotenv/config";
import { serve } from "@hono/node-server";
import { auth } from "@rantai-skena/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import agentProfileRoutes from "./routes/agent/profile";
import applicationAgentRoutes from "./routes/application/application.agent";
import applicationArtistRoutes from "./routes/application/application.artist";
import applicationStatusRoutes from "./routes/application/application.status";
import artistProfileRoutes from "./routes/artist/profile";
import authRoleRoutes from "./routes/auth/role";
import agentEventRoutes from "./routes/event/agent-events";
import eventRoutes from "./routes/event/index";
import galleryRoutes from "./routes/gallery/gallery";
import musicRoutes from "./routes/music/music";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.route("/api/auth", authRoleRoutes);
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/artist", artistProfileRoutes);
app.route("/api/agent", agentProfileRoutes);

app.route("/api/events", eventRoutes);
app.route("/api/agent/events", agentEventRoutes);

app.route("/api/applications", applicationArtistRoutes);
app.route("/api/applications", applicationStatusRoutes);
app.route("/api/events", applicationAgentRoutes);

app.route("/api/music", musicRoutes);
app.route("/api/gallery", galleryRoutes);

app.get("/", (c) => c.text("OK"));

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server running at http://localhost:${info.port}`);
  },
);

export default app;
