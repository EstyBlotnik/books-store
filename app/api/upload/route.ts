import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinaryConfig";
import { CldOgImage } from "next-cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    console.log(formData);

    const file = formData.get("image") as File | null;

    if (!file) {
      console.log("error: No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // העלאת התמונה ל-Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "books" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });
    return NextResponse.json({ imageUrl: (uploadResult as any).secure_url });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
