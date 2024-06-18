import { launch } from "puppeteer";
const main = async () => {
  const browser = await launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://club5.high5casino.com/");
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
  );
  await page.screenshot({ path: "before_click.png" });
  await page.waitForNetworkIdle();
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button, a"));
    const registerButton = buttons.find(
      (button) =>
        button.innerText.toLowerCase().includes("register") ||
        button.innerText.toLowerCase().includes("sign up") ||
        button.innerText.toLowerCase().includes("registration")
    );
    if (registerButton) {
      registerButton.click();
    }
  });

  await page.waitForNavigation();
  await page.screenshot({ path: "after_click.png" });

  await browser.close();
};

main();
