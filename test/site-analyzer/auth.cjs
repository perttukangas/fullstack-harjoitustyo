/**
 * @param {puppeteer.Browser} browser
 * @param {{url: string, options: LHCI.CollectCommand.Options}} context
 */
module.exports = async (browser, context) => {
  const page = await browser.newPage();
  await page.goto("http://localhost:3005");

  await page.click('[aria-label="login"]');

  await page.waitForSelector('input[type="email"]');
  const emailInput = await page.$('input[type="email"]');
  await emailInput.type("test@example.com");

  await page.waitForSelector('input[type="password"]');
  const passwordInput = await page.$('input[type="password"]');
  await passwordInput.type("123456");

  const submitButton = await page.$('button[type="submit"]');
  await submitButton.click();

  await page.waitForSelector('[aria-label="logout"]');

  await page.close();
};
