/* eslint-disable @typescript-eslint/no-explicit-any */
import puppeteer_prod from "puppeteer-core";
import puppeteer_dev from "puppeteer";
import chromium from "@sparticuz/chromium";

export async function createBrowser(
  url: string
): Promise<{ browser: any; page: any }> {
  let browser;

  if (process.env.NODE_ENV === "production") {
    browser = await puppeteer_prod.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  } else {
    browser = await puppeteer_dev.launch({ headless: true });
  }

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  return { browser, page };
}
