import express, { Request, Response } from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/scrape", async (_req: Request, res: Response) => {
  // const browser = await puppeteer.launch({
  //   args: chromium.args,
  //   defaultViewport: chromium.defaultViewport,
  //   executablePath: await chromium.executablePath(),
  //   headless: chromium.headless,
  // });

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
  await page.goto("https://internshala.com/jobs/");

  const jobs = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll(".individual_internship"));
    return elements.map((el) => ({
      title: el.querySelector("h3")?.textContent?.trim(),
      company: el.querySelector(".company_name")?.textContent?.trim(),
      location: el.querySelector(".location_link")?.textContent?.trim(),
      stipend: el.querySelector(".stipend")?.textContent?.trim()
    }));
  });

  await browser.close();
  res.json(jobs);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
