const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});


// Routes for other pages
app.get("/about-us", function (req, res) {
  res.sendFile(path.join(__dirname, "src", "pages", "/about-us.html"));
});

app.get("/our-services", function (req, res) {
  res.sendFile(path.join(__dirname, "our-services.html"));
});

app.get("/our-products", function (req, res) {
  res.sendFile(path.join(__dirname, "our-products.html"));
});

app.get("/faq", function (req, res) {
  res.sendFile(path.join(__dirname, "faq.html"));
});

app.get("/contact-us", function (req, res) {
  res.sendFile(path.join(__dirname, "contact-us.html"));
});

// Catch-all route for any other requests
app.get("*", function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "404.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
