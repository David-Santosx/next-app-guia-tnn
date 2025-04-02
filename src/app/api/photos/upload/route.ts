import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/prisma";
import { nanoid } from "nanoid";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET_NAME = 'photos-guia-tnn';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const category = formData.get("category") as string;
    const dateTakenStr = formData.get("dateTaken") as string;
    const photographer = formData.get("photographer") as string;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const uniqueId = nanoid();
    const fileExtension = file.name.split('.').pop();
    const filename = `${uniqueId}.${fileExtension}`;
    const filePath = `${category || 'general'}/${filename}`;
    
    const arrayBuffer = await file.arrayBuffer();
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from(BUCKET_NAME)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      console.error("Error details:", JSON.stringify(uploadError));
      return NextResponse.json(
        { error: "Failed to upload image to storage", details: uploadError.message },
        { status: 500 }
      );
    }

    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userEmail = (session.user as any).email;
    
    if (!userEmail) {
      console.error("Missing user email in session:", session);
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true }
    });

    if (!user) {
      console.error("User not found with email:", userEmail);
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 500 }
      );
    }

    let dateTaken = undefined;
    if (dateTakenStr && dateTakenStr.trim() !== '') {
      try {
        dateTaken = new Date(dateTakenStr);
        if (isNaN(dateTaken.getTime())) {
          dateTaken = undefined;
        }
      } catch {
        console.error("Invalid date format:", dateTakenStr);
        dateTaken = undefined;
      }
    }

    const photo = await prisma.photo.create({
      data: {
        id: uniqueId,
        title,
        description: description || null,
        location: location || null,
        url: publicUrl,
        blobKey: filePath,
        size: file.size,
        mimeType: file.type,
        category: category || 'general',
        dateTaken: dateTaken,
        photographer: photographer || null,
        uploadedById: user.id,
      },
    });

    return NextResponse.json({
      message: "Photo uploaded successfully",
      photo,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return NextResponse.json(
      { error: "Failed to upload photo", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
