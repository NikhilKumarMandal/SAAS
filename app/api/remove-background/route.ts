import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { auth } from "@clerk/nextjs/server";

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    format: string;
    resource_type: string;
    bytes: number;
    created_at: string;
    [key: string]: unknown;
}

export async function POST(request: NextRequest) {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "saas-images",
                        resource_type: "image",
                        background_removal: "cloudinary_ai" 
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary upload error:", error); // Added logging
                            reject(error);
                        } else {
                            resolve(result as CloudinaryUploadResult);
                        }
                    }
                );
                uploadStream.end(buffer);
            }
        );

        return NextResponse.json(
            {
                publicId: result.public_id,
                url: result.secure_url // Added URL to response
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Image upload failed:", error); // Added logging
        return NextResponse.json(
            {
                error: "Upload image failed"
            },
            {
                status: 500
            }
        );
    }
}


