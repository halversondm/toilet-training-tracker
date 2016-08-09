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
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("common"));
app.use(express.static(__dirname));
app.get("*", function response(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

const deleteEmptyKeys = object => {
  Object.keys(object).forEach(key => {
    if (object[key] === "") {
      delete object[key];
    }
  });
};

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
  deleteEmptyKeys(track);
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

app.post("/saveConfig", (req, res) => {
  var configuration = req.body;
  console.log(configuration);
  var updateExpress = `set config.intervalBetweenToiletVisit = :a, 
  config.rewardForVoiding = :b, config.intervalBetweenDryCheck = :c, config.traineeDurationOnToilet = :d`;
  var params = {
    TableName: "Profile",
    Key: {"emailAddress": configuration.emailAddress},
    UpdateExpression: updateExpress,
    ExpressionAttributeValues: {
      ":a": configuration.config.intervalBetweenToiletVisit,
      ":b": configuration.config.rewardForVoiding,
      ":c": configuration.config.intervalBetweenDryCheck,
      ":d": configuration.config.traineeDurationOnToilet
    },
    Item: configuration
  };

  docClient.update(params, function (err, data) {
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
