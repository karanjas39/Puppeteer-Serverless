import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const maxDuration = 20;
chromium.setGraphicsMode = false;

export async function POST(request: Request) {
  const { url } = await request.json();
  let browser = null;

  try {
    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

    browser = await puppeteer.launch({
      args: [
        ...(isLocal ? puppeteer.defaultArgs() : chromium.args),
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--single-process",
        "--disable-extensions",
      ],
      defaultViewport: {
        width: 1280,
        height: 720,
        deviceScaleFactor: 1,
      },
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
      headless: true,
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    page.setDefaultNavigationTimeout(15000);

    await page.goto(url, { waitUntil: "domcontentloaded" });
    const pageTitle = await page.title();

    await browser.close();
    browser = null;

    return Response.json({
      url,
      pageTitle,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "An error occurred",
        url,
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
