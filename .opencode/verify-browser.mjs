import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const screenshotDir = path.resolve("screenshots");
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runTests() {
  const browser = await chromium.launch();
  const consoleErrors = [];
  const results = {
    mobile375: {},
    desktop1280: {},
    consoleErrors: [],
  };

  for (const width of [375, 1280]) {
    const height = width === 375 ? 812 : 800;
    const viewKey = width === 375 ? "mobile375" : "desktop1280";
    const page = await browser.newPage({ viewport: { width, height } });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(`[${viewKey}] Console error: ${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(`[${viewKey}] Page uncaught error: ${err.message}`);
    });

    await page.goto("http://localhost:8080", { waitUntil: "networkidle" });

    // Test 1: Run a program and display output
    await page.fill("#source", "hallucinate(“the slop must flow”)✨");
    await page.click("#run");
    await page.waitForFunction(
      () => document.querySelector("#output")?.textContent?.includes("the slop must flow"),
    );
    const basicOutput = await page.textContent("#output");

    const basicMetrics = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      outputScrollWidth: document.getElementById("output").scrollWidth,
      outputOffsetWidth: document.getElementById("output").offsetWidth,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
    }));

    if (width === 375) {
      await page.screenshot({ path: path.join(screenshotDir, "after-fix-375.png") });
      await page.screenshot({
        path: path.join(screenshotDir, "after-fix-375-full-width.png"),
        clip: { x: 0, y: 0, width: basicMetrics.docScrollWidth, height },
      });
    } else {
      await page.screenshot({ path: path.join(screenshotDir, "after-fix-1280.png") });
    }

    // Test 2: Edit program and re-run without refreshing
    await page.fill("#source", "hallucinate(“updated slop dynamic test”)✨");
    await page.click("#run");
    await page.waitForFunction(
      () => document.querySelector("#output")?.textContent?.includes("updated slop dynamic test"),
    );
    const updatedOutput = await page.textContent("#output");
    const dynamicSuccess =
      updatedOutput.includes("updated slop dynamic test") &&
      !updatedOutput.includes("the slop must flow");

    // Test 3: Long output and Unicode characters
    const unicodeSource =
      "hallucinate(“✨ Unicode test: ✅ ❌ — ✨”)✨\n" +
      "hallucinate(“SuperLongUnbrokenStringWithoutAnySpaces12345678901234567890123456789012345678901234567890123456789012345678901234567890”)✨\n" +
      "hallucinate(“Line one\\nLine two with ✨”)✨";

    await page.fill("#source", unicodeSource);
    await page.click("#run");
    await page.waitForFunction(
      () => document.querySelector("#output")?.textContent?.includes("SuperLongUnbrokenStringWithoutAnySpaces"),
    );
    const unicodeOutput = await page.textContent("#output");
    const unicodeMetrics = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
    }));

    if (width === 375) {
      await page.screenshot({ path: path.join(screenshotDir, "after-fix-375-long-unicode.png") });
    } else {
      await page.screenshot({ path: path.join(screenshotDir, "after-fix-1280-long-unicode.png") });
    }

    // Test 4: Error messages
    await page.fill("#source", "slop broken = 123");
    await page.click("#run");
    await page.waitForFunction(
      () => document.querySelector("#output .err") !== null || document.querySelector("#output")?.textContent?.includes("syntax error"),
    );
    const errorOutput = await page.textContent("#output");
    const errorMetrics = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
    }));

    if (width === 375) {
      await page.screenshot({ path: path.join(screenshotDir, "after-fix-375-error.png") });
    } else {
      await page.screenshot({ path: path.join(screenshotDir, "after-fix-1280-error.png") });
    }

    results[viewKey] = {
      basicOutput: basicOutput.trim(),
      basicMetrics,
      dynamicSuccess,
      unicodeOutput: unicodeOutput.trim(),
      unicodeMetrics,
      errorOutput: errorOutput.trim(),
      errorMetrics,
    };

    await page.close();
  }

  results.consoleErrors = consoleErrors;
  await browser.close();

  console.log(JSON.stringify(results, null, 2));
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
