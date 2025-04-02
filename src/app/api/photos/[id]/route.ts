import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/prisma";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET_NAME = 'photos-guia-tnn';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    if (isAdmin) {
      const session = await getServerSession(authOptions);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!session || !session.user || (session.user as any).role !== "admin") {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    const photo = await prisma.photo.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!photo) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      );
    }

    if (!isAdmin && !photo.isPublished) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Error fetching photo:", error);
    return NextResponse.json(
      { error: "Failed to fetch photo" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = params.id;
    const data = await request.json();
    const { title, description, location, category, isPublished, dateTaken, photographer } = data; // Add photographer

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Check if photo exists
    const existingPhoto = await prisma.photo.findUnique({
      where: { id },
    });

    if (!existingPhoto) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      );
    }

    let parsedDateTaken = undefined;
    if (dateTaken) {
      parsedDateTaken = new Date(dateTaken);
      if (isNaN(parsedDateTaken.getTime())) {
        parsedDateTaken = undefined;
      }
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id },
      data: {
        title,
        description,
        location,
        category,
        isPublished,
        dateTaken: parsedDateTaken,
        photographer
      },
    });

    return NextResponse.json({
      message: "Photo updated successfully",
      photo: updatedPhoto,
    });
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json(
      { error: "Failed to update photo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = params.id;

    const photo = await prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      );
    }

    try {
      const { error: deleteError } = await supabaseAdmin
        .storage
        .from(BUCKET_NAME)
        .remove([photo.blobKey]);
      
      if (deleteError) {
        console.error("Error deleting from Supabase Storage:", deleteError);
      }
    } catch (storageError) {
      console.error("Error deleting from Supabase Storage:", storageError);
    }

    await prisma.photo.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}