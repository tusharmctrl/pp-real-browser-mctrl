import { connect } from "puppeteer-real-browser";

const getImage = () => {
  const url = process.env.URL || "";
  if (!url) {
    console.error("URL environment variable is not set!");
    process.exit(1);
  }
  connect({
    headless: "auto",
    fingerprint: true,
    turnstile: true,
  })
    .then(async (response) => {
      const { browser, page } = response;
      console.log("Received Browser");
      setTimeout(async () => {
        const ss = await page.screenshot({
          fullMode: true,
        });
        console.log("almost there...");
        const ssBase64 = ss.toString("base64");
        console.log(ss.toString("base64"));
        await browser.close();
        return ssBase64;
      }, 10000);
      page.goto(url, { waitUntil: "domcontentloaded" });
      console.log("Moving to page..");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

getImage();
