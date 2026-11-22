import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: Request) {
  try {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME || "growmore-website";
    const publicUrlBase = (
      process.env.R2_PUBLIC_URL ||
      "https://pub-d70940bb93eb4727953b2e2c02263b46.r2.dev"
    ).replace(/\/$/, "");

    if (!accountId || !accessKeyId || !secretAccessKey) {
      return NextResponse.json(
        { error: "R2 credentials missing in Vercel / .env.local" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = String(formData.get("folder") || "uploads").replace(
      /[^a-zA-Z0-9_-]/g,
      ""
    );

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${folder}/${Date.now()}-${safeName}`;

    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    );

    return NextResponse.json({ url: `${publicUrlBase}/${key}` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "R2 upload error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}