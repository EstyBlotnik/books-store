import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinaryConfig";
interface CloudinaryUploadResult {
  secure_url: string;
}
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

    const uploadResult = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "books" }, (error, result) => {
            if (error) reject(error);
            else if (result) {
              resolve(result as CloudinaryUploadResult);
            }
          })
          .end(buffer);
      }
    );
    return NextResponse.json({ imageUrl: uploadResult.secure_url });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
