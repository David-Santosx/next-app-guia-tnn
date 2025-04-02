import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const isAdmin = searchParams.get("admin") === "true";

    // Check if admin-only request
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

    // Build the query filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (category) {
      filter.category = category;
    }
    
    // Only show published photos for public requests
    if (!isAdmin) {
      filter.isPublished = true;
    }

    // Get total count for pagination
    const totalCount = await prisma.photo.count({
      where: filter,
    });

    // Get photos with pagination
    const photos = await prisma.photo.findMany({
      where: filter,
      orderBy: {
        uploadedAt: "desc",
      },
      skip,
      take: limit,
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      photos,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}