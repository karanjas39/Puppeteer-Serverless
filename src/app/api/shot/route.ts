// src/app/api/screenshot/route.ts
import { createBrowser } from "@/utils/browser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      return NextResponse.json(
        { error: "A valid URL is required" },
        { status: 400 }
      );
    }

    const browser = await createBrowser();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const screenshot = await page.screenshot({ encoding: "binary" });
    await browser.close();

    return new NextResponse(screenshot, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    return NextResponse.json(
      { error: "Failed to capture screenshot" },
      { status: 500 }
    );
  }
}
