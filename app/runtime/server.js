/*
Main production server configuration using NodeJS and ExpressJS
 */
"use strict";
var AWS = require("aws-sdk");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var port = 8080;
var app = express();

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("common"));
app.use(express.static(__dirname));
app.get("*", function response(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/loginService", (req, res) => {
  var loginInfo = req.body;
  console.log(loginInfo);
  var params = {
    TableName: "Profile",
    Key: {
      "emailAddress": loginInfo.email
    }
  };

  docClient.get(params, function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    } else {
      console.log(data);
      if (data.Item.key === loginInfo.key) {
        res.send({config: data.Item.config, profileId: data.Item.profileId});
      } else {
        res.sendStatus(404);
      }
    }
  });
});

app.post("/saveTrack", (req, res) => {
  var track = req.body;
  console.log(track);
  var params = {
    TableName: "Track",
    Item: track
  };

  docClient.put(params, function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(data);
      res.sendStatus(200);
    }
  });
});

app.listen(port);
console.info("==> Listening on port %s.", port);
