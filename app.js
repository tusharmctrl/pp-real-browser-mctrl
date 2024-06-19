import express from "express";
import { connect } from "puppeteer-real-browser";

const app = express();
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getScreenshot = async (url) => {
  const response = await connect({
    headless: "auto",
    fingerprint: true,
    turnstile: true,
    connectOption: {
      protocolTimeout: 1800000,
    },
  });

  const { browser, page } = response;

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await sleep(10000);

    const screenshot = await page.screenshot({
      fullPage: true,
      encoding: "base64",
    });

    return screenshot;
  } finally {
    await browser.close();
  }
};

app.get("/screenshot", async (req, res) => {
  const { url } = req.query;
  console.log(url);
  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }
  try {
    const screenshotBase64 = await getScreenshot(url.toString());
    res.status(200).json({ image: screenshotBase64 });
  } catch (error) {
    console.error("Failed to capture screenshot:", error);
    res.status(500).json({ error: "Failed to capture screenshot" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
