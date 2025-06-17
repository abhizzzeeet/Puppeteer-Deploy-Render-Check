"use strict";
// import express, { Request, Response } from "express";
// import puppeteer from "puppeteer-core";
// import chromium from "@sparticuz/chromium";
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
const express_1 = __importDefault(require("express"));
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
// 👇 Use puppeteer-extra instead of puppeteer-core
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.get("/udyam-scrape", async (_req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    const browser = await puppeteer_extra_1.default.launch({
        args: chromium_1.default.args,
        defaultViewport: chromium_1.default.defaultViewport,
        executablePath: isProd
            ? await chromium_1.default.executablePath()
            : (await Promise.resolve().then(() => __importStar(require("puppeteer")))).executablePath(),
        headless: isProd ? chromium_1.default.headless : true,
    });
    const page = await browser.newPage();
    // Optional: Set user agent and viewport for more human-like behavior
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
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
