import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const admins = await prisma.user.findMany({
      where: {
        role: "admin"
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        creationInfo: {
          select: {
            ipAddress: true,
            browser: true,
            operatingSystem: true,
            device: true,
            origin: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin users" },
      { status: 500 }
    );
  }
}