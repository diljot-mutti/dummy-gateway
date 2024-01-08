var express = require("express");
var router = express.Router();
var axios = require("axios");

var serviceURLS = [process.env.SERVICE1_URL];
console.log(process.env.SERVICE1_URL);
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Hello folks!" });
});

router.get("/ping", function (req, res, next) {
  res.send("pong from Gateway");
});

router.get("/test", async function (req, res, next) {
  // Create an empty array to store the responses
  let responses = [];
  // Create an array of promises for each ping request
  let reqPromises = serviceURLS.map(async (host) => {
    let url = host + "/ping";
    try {
      // Make the ping request
      let response = await axios.get(url);

      // Push the response in the desired format to the 'responses' array
      responses.push({ url, response: response.data });
    } catch (err) {
      // If there's an error, push an object with the URL and an error message
      responses.push({ url, error: err.message });
    }
  });

  // Wait for all promises to resolve
  await Promise.all(reqPromises);

  // Send the responses array in the response
  res.render("test", { responses });
});

module.exports = router;
