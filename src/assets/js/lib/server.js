const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, "src"))); 

// Serve the home page (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

// Routes for other pages
app.get("/about-us", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "pages", "about-us.html"));
});

app.get("/our-services", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "pages", "our-services.html"));
});

app.get("/our-products", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "pages", "our-products.html"));
});

app.get("/faq", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "pages", "faq.html"));
});

app.get("/contact-us", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "pages", "contact-us.html"));
});

// Catch-all route for any other requests (404)
app.get("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "src", "404.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
