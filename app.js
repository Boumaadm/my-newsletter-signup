const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv/config');
const app = express();

mailchip_token = process.env.MAILCHIP_TOKEN;
mailchip_id = process.env.MAILCHIP_ID;
port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  // USE Fetch() API from nodejs to Post data in mailchip //
  //   ||
  //   ||
  //   ||
  //   ||
  //   ||
  //  \  /
  //   \/

  async function postData(url = "") {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + mailchip_token + "",
      },
      body: jsonData,
    });
    return response;
  }

  postData("https://us12.api.mailchimp.com/3.0/lists/" + mailchip_id + "").then(
    (response) => {
      if (response.status === 200) {
        res.sendFile(__dirname + "/succes.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
      console.log(response);
    }
  );
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/succes", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || port, () =>
  console.log(`Server running at http://localhost:${port}/`)
);

