import { NextRequest,NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


interface CloudinaryUploadResult { 
    public_id: string;
    bytes: number;
    duration?:number;
    [key: string]: any;
}

export async function POST(request: NextRequest) {

    try {
        const { userId } = auth()

         if (!userId) {
             return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
            );
         }
        const fromData = await request.formData();
        const file = fromData.get('file') as File | null;
        const title = fromData.get("title") as string;
        const description = fromData.get("description") as string;
        const oringinalSize = fromData.get("oringinalSize") as string;

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
                        resource_type: "video",
                        folder: "saas-videos",
                        transformation: [
                            {
                                quality: "auto",
                                fetch_format: "mp4"
                            }
                        ]
                        
                     },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResult)
                    }
                )
                uploadStream.end(buffer);
            }
        ) 

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                oringinalSize,
                comparessedSize: String(result.bytes),
                duration: result.duration || 0

            }
        })
        return NextResponse.json(video)
    } catch (error) {
        return NextResponse.json(
            {
                error: "Upload Video Failed"
            },
            {
                status: 500
            }
        )
    } finally {
        await prisma.$disconnect()
    }

}