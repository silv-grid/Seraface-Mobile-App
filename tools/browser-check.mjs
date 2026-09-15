import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import assert from "node:assert/strict";
const root = path.resolve("dist");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (!pathname.startsWith("/")) {
      res.writeHead(404);
      res.end();
      return;
    }
    const file = path.resolve(root, pathname.slice(1) || "index.html");
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    const bytes = await readFile(
      path.extname(file) ? file : path.join(root, "index.html"),
    );
    res.writeHead(200, {
      "content-type": types[path.extname(file)] || "text/html",
    });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const url = "http://127.0.0.1:" + server.address().port + "/";
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "chrome",
});
await mkdir("docs/images", { recursive: true });
try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 1100 },
    reducedMotion: "reduce",
  });
  page.setDefaultTimeout(15000);
  const errors = [];
  const remote = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (req) => {
    if (
      !req.url().startsWith(url) &&
      !req.url().startsWith("data:") &&
      !req.url().startsWith("blob:")
    )
      remote.push(req.url());
  });
  await page.goto(url);
  await page.getByRole("button", { name: "Open skin profile" }).click();
  await page
    .getByRole("button", { name: "Continue sample walkthrough" })
    .click();
  await page.getByText("Choose one skin type.", { exact: true }).waitFor();
  await page.getByRole("radio", { name: "Normal", exact: true }).click();
  await page.getByLabel("Budget in PHP").fill("500");
  await page
    .getByLabel("Custom goal", { exact: true })
    .fill("Try the local planner");
  await page.getByLabel("Product name", { exact: true }).fill("Past example");
  await page
    .getByRole("button", { name: "Add Experience", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Remove experience Past example",
      exact: true,
    })
    .click();
  assert.equal(
    await page.getByText("Past example", { exact: true }).count(),
    0,
  );
  await page
    .getByRole("button", { name: "Continue sample walkthrough" })
    .click();
  await page.getByRole("button", { name: "View sample report" }).click();
  await page
    .getByText(
      "Sample report only. No skin findings were generated and no photo was analyzed.",
      { exact: true },
    )
    .waitFor();
  await page.getByRole("button", { name: "Explore products" }).click();
  await page
    .getByRole("button", { name: "Load products", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Add Example product A to plan", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Add Example product B to plan", exact: true })
    .click();
  await page.screenshot({
    path: "docs/images/products-web-phone.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "View purchase plan" }).click();
  await page.getByText("₱420.50", { exact: true }).waitFor();
  await page
    .getByText("₱79.50 remaining before unpriced items", { exact: true })
    .waitFor();
  await page.screenshot({
    path: "docs/images/plan-web-phone.png",
    fullPage: true,
  });
  await page.reload();
  await page.getByRole("button", { name: "Open skin profile" }).waitFor();
  await page.getByRole("tab", { name: "Budget" }).click();
  await page.getByText("₱420.50", { exact: true }).waitFor();
  await page.getByRole("tab", { name: "Routine" }).click();
  await page.getByRole("button", { name: "Load routine", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Mark Sample morning entry complete" })
    .click();
  await page
    .getByRole("checkbox", { name: "Completed today - undo" })
    .waitFor();
  await page.screenshot({
    path: "docs/images/routine-web-phone.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 320, height: 900 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "No horizontal overflow",
  );
  await page.getByRole("tab", { name: "Home" }).click();
  await page
    .getByRole("button", { name: "Clear local data", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep my data", exact: true }).click();
  await page
    .getByRole("button", { name: "Clear local data", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm clear local data", exact: true })
    .click();
  await page.getByRole("tab", { name: "Budget" }).click();
  await page
    .getByText(
      "Your plan is empty. Add items from Products to compare them with your budget.",
    )
    .waitFor();
  await page.evaluate(() =>
    localStorage.setItem("seraface:v1:sample", "broken"),
  );
  await page.reload();
  await page
    .getByText(
      "Saved data could not be opened. Retry, or discard it to start again.",
    )
    .waitFor();
  await page
    .getByRole("button", { name: "Discard unreadable local data" })
    .click();
  await page.getByRole("button", { name: "Open skin profile" }).waitFor();
  await page.getByRole("button", { name: "Open skin profile" }).click();
  await page.evaluate(() => {
    window.originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error("fixture storage failure");
    };
  });
  await page.getByLabel("Budget in PHP").fill("600");
  await page
    .getByText(
      "Changes are only in memory because local storage could not be written. Keep this window open and retry saving.",
      { exact: true },
    )
    .waitFor();
  assert.equal(await page.getByLabel("Budget in PHP").inputValue(), "600");
  await page.evaluate(() => {
    Storage.prototype.setItem = window.originalSetItem;
  });
  await page.getByRole("button", { name: "Retry saving", exact: true }).click();
  await page
    .getByRole("button", { name: "Retry saving", exact: true })
    .waitFor({ state: "hidden" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({
    path: "docs/images/profile-web-desktop.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  assert.deepEqual(remote, []);
  console.log(
    "PASS sample profile, experience removal, report, purchase plan, persistence, checklist, clear, corrupt-data recovery and 320px layout; zero remote requests.",
  );
} catch (error) {
  const page = browser.contexts()[0]?.pages()[0];
  if (page) {
    await page.screenshot({
      path: "docs/images/check-failure.png",
      fullPage: true,
    });
    console.error((await page.locator("body").innerText()).slice(-6000));
  }
  throw error;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
