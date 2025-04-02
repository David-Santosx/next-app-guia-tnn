import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET() {
  try {
    const categories = await prisma.photo.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      where: {
        isPublished: true
      }
    });

    const formattedCategories = categories.map(item => ({
      name: item.category,
      count: item._count.category
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching photo categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch photo categories" },
      { status: 500 }
    );
  }
}