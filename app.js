import { connect } from "puppeteer-real-browser";

const getImage = () => {
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
  page.goto(url, { waitUntil: "domcontentloaded" });
  const ss = await getScreenshot(page,browser);
  return ss;
};

const getScreenshot = (page,browser) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const ss = await page.screenshot({
        fullMode: true,
      });
      console.log("almost there...");
      const ssBase64 = ss.toString("base64");
      await browser.close();
      resolve(ssBase64);
    }, 10000);
  })
}

getImage();
