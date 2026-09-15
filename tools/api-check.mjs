import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import assert from "node:assert/strict";
const root = path.resolve("api-web");
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
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let phaseOne = "fail";
  let uploaded = false;
  let phaseThree = "bad";
  await page.route("http://127.0.0.1:9077/**", async (route) => {
    const request = route.request();
    const requestUrl = request.url();
    let body;
    let status = 200;
    if (request.method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "*",
          "access-control-allow-methods": "GET,POST,OPTIONS",
        },
      });
      return;
    }
    if (requestUrl.includes("phase1")) {
      if (phaseOne === "fail") {
        status = 503;
        body = {};
      } else if (phaseOne === "bad") body = {};
      else body = { session_id: "fixture-session" };
    } else if (requestUrl.includes("phase2")) {
      assert.match(
        request.headers()["content-type"],
        /multipart\/form-data; boundary=/,
      );
      assert.match(
        request.postDataBuffer().toString("latin1"),
        /name="file"; filename=/,
      );
      assert.equal(request.headers()["x-session-id"], "fixture-session");
      uploaded = true;
      body = {
        ai_output: {
          notice: "Local fixture response; no image analysis performed.",
        },
      };
    } else if (requestUrl.includes("phase3"))
      body =
        phaseThree === "bad"
          ? { products: { bad: "invalid" } }
          : {
              products: {
                fixture: [
                  { name: "Fixture A", price: "PHP 100.00" },
                  { name: "Fixture B", price: null },
                ],
              },
            };
    else body = { routine: [] };
    await route.fulfill({
      status,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(body),
    });
  });
  await page.goto(url);
  await page.getByRole("button", { name: "Open skin profile" }).click();
  await page.getByRole("radio", { name: "Normal", exact: true }).click();
  await page.getByLabel("Budget in PHP").fill("500");
  await page
    .getByLabel("Custom goal", { exact: true })
    .fill("Check client integration");
  await page.getByRole("button", { name: "Next: Choose photo" }).click();
  await page
    .getByText(
      "The service could not complete this request. Check its connection and try again.",
      { exact: true },
    )
    .waitFor();
  assert.equal(await page.getByLabel("Budget in PHP").inputValue(), "500");
  phaseOne = "bad";
  await page.getByRole("button", { name: "Next: Choose photo" }).click();
  await page
    .getByText("The service did not return a session ID.", { exact: true })
    .waitFor();
  phaseOne = "ok";
  await page.getByRole("button", { name: "Next: Choose photo" }).click();
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Choose photo", exact: true }).click();
  await (await chooser).setFiles("assets/icon.png");
  await page
    .getByRole("button", { name: "Send photo for analysis", exact: true })
    .click();
  await page
    .getByText("Local fixture response; no image analysis performed.", {
      exact: true,
    })
    .waitFor();
  assert.equal(uploaded, true);
  await page.getByRole("button", { name: "Explore products" }).click();
  await page
    .getByRole("button", { name: "Load products", exact: true })
    .click();
  await page
    .getByText("The service returned an invalid product category.", {
      exact: true,
    })
    .waitFor();
  assert.equal(
    await page.getByText("Example product A", { exact: true }).count(),
    0,
  );
  phaseThree = "ok";
  await page
    .getByRole("button", { name: "Load products", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Add Fixture A to plan", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Add Fixture B to plan", exact: true })
    .click();
  await page.getByRole("button", { name: "View purchase plan" }).click();
  await page
    .getByText("1 selected item(s) have no price. The total is incomplete.", {
      exact: true,
    })
    .waitFor();
  assert.deepEqual(errors, []);
  console.log(
    "PASS local API fixture: failed and malformed responses, retained profile, explicit multipart image upload, no sample fallback, all products and unknown-price totals.",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
