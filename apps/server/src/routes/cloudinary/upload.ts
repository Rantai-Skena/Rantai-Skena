import { v2 as cloudinary } from "cloudinary";
import { Hono } from "hono";

const router = new Hono();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

router.post("/", async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"] as File;

  if (!file) {
    return c.json({ success: false, error: "No file provided" }, 400);
  }

  // Convert file ke base64
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const fileType = file.type;

  const uploaded = await cloudinary.uploader.upload(
    `data:${fileType};base64,${base64}`,
    {
      folder: "rantai-skena",
    },
  );

  return c.json({
    success: true,
    url: uploaded.secure_url,
  });
});

export default router;
