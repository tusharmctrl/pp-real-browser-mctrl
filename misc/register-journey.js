import { launch } from "puppeteer";
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const main = async () => {
  const browser = await launch({
    headless: false,
    args: ["--start-fullscreen"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://www.williamhill.com");
  // await page.goto("https://club5.high5casino.com/");
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
  );
  await page.screenshot({ path: "before_click.png", fullPage: true });
  await page.waitForNetworkIdle();
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button, a"));
    const registerButton = buttons.find(
      (button) =>
        button.innerText.toLowerCase().includes("register") ||
        button.innerText.toLowerCase().includes("sign up") ||
        button.innerText.toLowerCase().includes("join") ||
        button.innerText.toLowerCase().includes("registration")
    );
    if (registerButton) {
      registerButton.click();
    }
  });
  console.log("Got the register");
  await sleep(5000);
  await page.screenshot({ path: "after_click.png" });

  await page.evaluate(() => {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.focus();
    });
  });

  await sleep(2000);
  await page.screenshot({ path: "after_inputs_click.png", fullPage: true });

  await browser.close();
};

main();
