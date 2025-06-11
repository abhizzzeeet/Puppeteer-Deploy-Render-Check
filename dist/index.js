"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
    // const browser = await puppeteer.launch({
    //   args: chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath(),
    //   headless: chromium.headless,
    // });
    const isProd = process.env.NODE_ENV === "production";
    const browser = await puppeteer_core_1.default.launch({
        args: chromium_1.default.args,
        defaultViewport: chromium_1.default.defaultViewport,
        executablePath: isProd
            ? await chromium_1.default.executablePath()
            : (await Promise.resolve().then(() => __importStar(require("puppeteer")))).executablePath(),
        headless: isProd ? chromium_1.default.headless : true,
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
