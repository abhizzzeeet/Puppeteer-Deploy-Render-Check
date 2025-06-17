// import express, { Request, Response } from "express";
// import puppeteer from "puppeteer-core";
// import chromium from "@sparticuz/chromium";

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.get("/scrape", async (_req: Request, res: Response) => {
//   // const browser = await puppeteer.launch({
//   //   args: chromium.args,
//   //   defaultViewport: chromium.defaultViewport,
//   //   executablePath: await chromium.executablePath(),
//   //   headless: chromium.headless,
//   // });

//   const isProd = process.env.NODE_ENV === "production";

//   const browser = await puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath: isProd
//       ? await chromium.executablePath()
//       : (await import("puppeteer")).executablePath(),
//     headless: isProd ? chromium.headless : true,
//   });

//   const page = await browser.newPage();
//   await page.goto("https://internshala.com/jobs/");

//   const jobs = await page.evaluate(() => {
//     const elements = Array.from(document.querySelectorAll(".individual_internship"));
//     return elements.map((el) => ({
//       title: el.querySelector("h3")?.textContent?.trim(),
//       company: el.querySelector(".company_name")?.textContent?.trim(),
//       location: el.querySelector(".location_link")?.textContent?.trim(),
//       stipend: el.querySelector(".stipend")?.textContent?.trim()
//     }));
//   });

//   await browser.close();
//   res.json(jobs);
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express, { Request, Response } from "express";
import chromium from "@sparticuz/chromium";

// 👇 Use puppeteer-extra instead of puppeteer-core
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/udyam-scrape", async (_req: Request, res: Response) => {
  const isProd = process.env.NODE_ENV === "production";

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: isProd
      ? await chromium.executablePath()
      : (await import("puppeteer")).executablePath(),
    headless: isProd ? chromium.headless : true,
  });

  const page = await browser.newPage();

  // Optional: Set user agent and viewport for more human-like behavior
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1366, height: 768 });

  await page.goto("https://udyamregistration.gov.in/UdyamRegistration.aspx", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  console.log("Page loaded. Scraping...");

  const data = await page.evaluate(() => {
    return {
      title: document.title,
      heading: document.querySelector("h1, h2, h3")?.textContent?.trim(),
      label: document.querySelector("label")?.textContent?.trim(),
    };
  });

  await browser.close();
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
