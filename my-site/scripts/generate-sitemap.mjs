import { getAllCities, getCitySlug } from "../lib/data/locations.js";
import fs from "fs";

const domain = "https://callgirl4u.com";
const cities = getAllCities();

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/login</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${domain}/signup</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
${cities.map(city => `  <url>
    <loc>${domain}/call-girls/${getCitySlug(city)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n")}
</urlset>`;

fs.writeFileSync("./public/sitemap.xml", sitemap);
console.log("Sitemap generated successfully!");
