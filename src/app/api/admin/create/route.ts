import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { hashPassword } from "@/lib/auth";
import { UAParser } from "ua-parser-js";

// List of known API clients and automation tools
const suspiciousClients = [
  'postman',
  'insomnia',
  'curl',
  'wget',
  'python-requests',
  'axios',
  'node-fetch',
  'httpie',
  'rest-client',
  'swagger',
];

export async function POST(request: NextRequest) {
  try {
    // Get IP address and user agent information
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    const userAgent = request.headers.get("user-agent") || "unknown";
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();
    
    // Get request origin
    const origin = request.headers.get("origin") || "unknown";
    const referer = request.headers.get("referer") || "unknown";
    
    // Check if request is coming from a suspicious client
    const isSuspiciousClient = checkSuspiciousClient(userAgent, origin, referer);
    
    // Parse request data
    let requestData;
    try {
      requestData = await request.json();
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return NextResponse.json(
        { error: "Invalid JSON format in request body" },
        { status: 400 }
      );
    }

    const { name, email, password, adminKey } = requestData || {};

    if (!name || !email || !password || !adminKey) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, password, and adminKey are required" },
        { status: 400 }
      );
    }

    // Log suspicious client attempts
    if (isSuspiciousClient) {
      await prisma.adminCreationLog.create({
        data: {
          email,
          ipAddress: ip.toString(),
          userAgent,
          browser: `${browser.name || "unknown"} ${browser.version || ""}`,
          operatingSystem: `${os.name || "unknown"} ${os.version || ""}`,
          device: device.type || "unknown",
          origin,
          status: "SUSPICIOUS",
          reason: "Request from API client or automation tool"
        }
      });
      
      // You can choose to block these requests or just flag them
      // Uncomment the following to block suspicious clients
      /*
      return NextResponse.json(
        { error: "Admin creation not allowed from this client" },
        { status: 403 }
      );
      */
    }

    if (adminKey !== process.env.ADMIN_CREATION_KEY) {
      // Log failed attempt with IP for security monitoring
      await prisma.adminCreationLog.create({
        data: {
          email,
          ipAddress: ip.toString(),
          userAgent,
          browser: `${browser.name || "unknown"} ${browser.version || ""}`,
          operatingSystem: `${os.name || "unknown"} ${os.version || ""}`,
          device: device.type || "unknown",
          origin,
          status: "FAILED",
          reason: "Invalid admin key"
        }
      });
      
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Log failed attempt for existing user
      await prisma.adminCreationLog.create({
        data: {
          email,
          ipAddress: ip.toString(),
          userAgent,
          browser: `${browser.name || "unknown"} ${browser.version || ""}`,
          operatingSystem: `${os.name || "unknown"} ${os.version || ""}`,
          device: device.type || "unknown",
          origin,
          status: "FAILED",
          reason: "User already exists"
        }
      });
      
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create the admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
        creationInfo: {
          create: {
            ipAddress: ip.toString(),
            userAgent,
            browser: `${browser.name || "unknown"} ${browser.version || ""}`,
            operatingSystem: `${os.name || "unknown"} ${os.version || ""}`,
            device: device.type || "unknown",
            origin
          }
        }
      },
      include: {
        creationInfo: true
      }
    });

    // Log successful admin creation
    await prisma.adminCreationLog.create({
      data: {
        email,
        ipAddress: ip.toString(),
        userAgent,
        browser: `${browser.name || "unknown"} ${browser.version || ""}`,
        operatingSystem: `${os.name || "unknown"} ${os.version || ""}`,
        device: device.type || "unknown",
        origin,
        status: isSuspiciousClient ? "SUCCESS_SUSPICIOUS" : "SUCCESS",
        userId: user.id
      }
    });

    // Remove sensitive information before returning
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Admin created successfully",
      user: userWithoutPassword,
      suspicious: isSuspiciousClient
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}

// Helper function to check if request is from a suspicious client
function checkSuspiciousClient(userAgent: string, origin: string, referer: string): boolean {
  // Convert to lowercase for case-insensitive matching
  const ua = userAgent.toLowerCase();
  
  // Check for known API clients in user agent
  const hasSuspiciousUserAgent = suspiciousClients.some(client => ua.includes(client));
  
  // Check if origin is missing or not from your domain
  const hasValidOrigin = origin !== "unknown" && 
    (origin.includes("localhost") || 
     origin.includes("guia-tnn") || 
     origin.includes("your-production-domain.com"));
  
  // Check if referer is missing or not from your domain
  const hasValidReferer = referer !== "unknown" && 
    (referer.includes("localhost") || 
     referer.includes("guia-tnn") || 
     referer.includes("your-production-domain.com"));
  
  // Additional checks for browser fingerprinting
  const hasBrowserFingerprint = ua.includes("chrome") || 
                               ua.includes("firefox") || 
                               ua.includes("safari") || 
                               ua.includes("edge");
  
  // Consider it suspicious if:
  // 1. It has a suspicious user agent, OR
  // 2. It's missing both valid origin and referer while not having browser fingerprint
  return hasSuspiciousUserAgent || 
         (!hasValidOrigin && !hasValidReferer && !hasBrowserFingerprint);
}