import { connect } from "puppeteer-real-browser";
import fs from "fs";
import path from "path";
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

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
  try {
    await page.goto(url, { waitUntil: "networkidle0" });
    const ss = await getScreenshot(page);
    console.log("Screenshot successful, size of base64", ss.length);
    await saveScreenshot(ss);
    console.log("Screenshot saved");
  } catch (error) {
    console.error("Failed to capture screenshot:", error);
  } finally {
    await browser.close();
  }
};

const getScreenshot = async (page) => {
  try {
    console.log(
      "We are processing to capture a screenshot, please wait for 50 seconds..."
    );
    await sleep(50000);
    const screenshot = await page.screenshot({
      fullPage: true,
      path: "test.png",
    });
    console.log("Captured...");
    return screenshot.toString("base64");
  } catch (error) {
    console.error("Error while taking screenshot:", error);
    throw error;
  }
};

const saveScreenshot = (base64) => {
  return new Promise((resolve, reject) => {
    const dirPath = "/pp";
    const filePath = path.join(dirPath, "screenshot.txt");

    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Failed to create directory:", err);
        reject(err);
      } else {
        fs.writeFile(filePath, base64, "utf8", (err) => {
          if (err) {
            console.error("Failed to save screenshot:", err);
            reject(err);
          } else {
            console.log("Screenshot saved successfully to", filePath);
            resolve();
          }
        });
      }
    });
  });
};

getImage();
