const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const path = require("path");
const port = 5000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const amazonURL =
    "https://www.amazon.in/gp/browse.html?node=4092115031&ref_=nav_em_sbc_tvelec_gaming_consoles_0_2_9_12";

  let data = [];
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(amazonURL, { waitUntil: "domcontentloaded" });

    data = await page.$$eval(".a-list-item", (elements) => {
      console.log(elements);
      return elements.map((el) => ({
        title:
          el.querySelector(".octopus-pc-asin-title")?.innerText.trim() ||
          "No Title Available",
        price:
          el.querySelector(".a-price .a-offscreen")?.innerText.trim() ||
          "No Price Available",
        imageURL:
          el.querySelector("img")?.src || "https://via.placeholder.com/150",
      }));
    });

    await browser.close();
  } catch (error) {
    console.error("Error during scraping:", error.message);
  }

  // console.log("Scraped Data:", data);

  // Render the EJS template
  res.render("index", { data });
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
