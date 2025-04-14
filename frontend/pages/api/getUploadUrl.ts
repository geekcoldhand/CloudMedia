import type { NextApiRequest, NextApiResponse } from "next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { fileName, fileType } = req.body;
console.log(fileName, fileType);
  if (!fileName || !fileType) {
    return res.status(400).json({ message: "Missing required fields. file name or file type" });
  }

  const bucketName = process.env.S3_BUCKET_NAME!;
  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  });

  try {
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return res.status(200).json({ uploadUrl, key });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not generate presigned URL." });
  }
}
