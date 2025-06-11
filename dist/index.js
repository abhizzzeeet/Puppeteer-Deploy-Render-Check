"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.get("/scrape", async (_req, res) => {
    const browser = await puppeteer_core_1.default.launch({
        args: chromium_1.default.args,
        defaultViewport: chromium_1.default.defaultViewport,
        executablePath: await chromium_1.default.executablePath(),
        headless: chromium_1.default.headless,
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
