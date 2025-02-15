import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function createBrowser() {
  if (process.env.NODE_ENV === "production") {
    return await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  } else {
    const puppeteerDev = await import("puppeteer");
    return await puppeteerDev.default.launch({ headless: true });
  }
}
