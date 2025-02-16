import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

export const maxDuration = 20;
chromium.setGraphicsMode = false;

export async function POST(request: Request) {
  const { url } = await request.json();

  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

  const browser = await puppeteer.launch({
    args: isLocal ? puppeteer.defaultArgs() : chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ||
      (await chromium.executablePath(
        "https://your-cdn.com/path-to-chromium-pack.tar"
      )),
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(url);
  const pageTitle = await page.title();
  await browser.close();

  return Response.json({
    url,
    pageTitle,
  });
}
