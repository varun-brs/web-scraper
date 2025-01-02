const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const amazonURL =
    "https://www.amazon.in/gp/browse.html?node=4092115031&ref_=nav_em_sbc_tvelec_gaming_consoles_0_2_9_12";

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(amazonURL);

  const data = await page.$$eval(
    ".a-section.octopus-pc-card-content .a-list-item",
    (elements) => {
      return elements.map((el) => ({
        title:
          el.querySelector(".octopus-pc-asin-title")?.innerText ||
          "No title available",
        price:
          el.querySelector(".a-price .a-offscreen")?.innerText ||
          "No price available",
        imageURL: el.querySelector("img")?.src || "No image available",
      }));
    }
  );

  await browser.close();

  res.render("index", { data });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
