// Import required packages
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
require("dotenv").config();

// Set up the Google Sheets API client
const sheets = google.sheets({
  version: "v4",
  auth: process.env.GOOGLE_AUTH_TOKEN,
});

// Create an instance of the Express app
const app = express();

// Enable CORS to allow cross-origin requests from the frontend
app.use(cors());
// app.use(express.json());
// Define a route to retrieve data from the Google Sheet database
app.get("/data", async (req, res) => {
  try {
    // Define the range of cells to retrieve from the sheet
    const range = "Sheet1!B2:E120";

    // Retrieve the values from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREAD_SHEET_ID,
      range,
    });

    // Extract the values from the response
    const rows = response.data.values;

    // Map the rows to an array of objects with temperature, pressure, and humidity properties
    const data = rows.map((row) => ({
      Time: row[0],
      Value0: parseFloat(row[1]),
      Temperature: parseFloat(row[2]),
      Humidity: parseFloat(row[3]),
    }));
    
    // Send the data as a JSON response
    res.json(data);
    console.log(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
