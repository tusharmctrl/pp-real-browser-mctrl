import { connect } from "puppeteer-real-browser";
import fs from 'fs';
import path from 'path';

const getImage = async () => {
  const url = process.env.URL || "";
  if (!url) {
    console.error("URL environment variable is not set!");
    process.exit(1);
  }
  const response = await connect({
    headless: "auto",
    fingerprint: true,
    turnstile: true,
  });
  const { browser, page } = response;
  console.log("Received Browser");
  console.log("Moving to page..");
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const ss = await getScreenshot(page, browser);
  console.log("Screenshot successful, size of base64", ss.length);
  await saveScreenshot(ss);
  console.log("Screenshot saved");
};

const getScreenshot = (page, browser) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const ss = await page.screenshot({
        fullPage: true,
      });
      console.log("Almost there...");
      const ssBase64 = ss.toString("base64");
      await browser.close();
      resolve(ssBase64);
    }, 10000);
  });
};

const saveScreenshot = (base64) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join('/pp', 'screenshot.txt');
    fs.writeFile(filePath, base64, 'utf8', (err) => {
      if (err) {
        console.error("Failed to save screenshot:", err);
        reject(err);
      } else {
        console.log("Screenshot saved successfully to", filePath);
        resolve();
      }
    });
  });
};

getImage();
