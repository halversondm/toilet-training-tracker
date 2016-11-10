/*
 Main production server configuration using NodeJS and ExpressJS
 */
"use strict";
console.log("halversondm toilettracker site");

var AWS = require("aws-sdk");
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var port = 3001;
var app = express();
var Excel = require("exceljs");
var uuid = require("uuid");

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

var reportData = (info, callback) => {
    var params = {
        TableName: "Track",
        KeyConditionExpression: "profileId = :profileId AND #date between :rangeStart AND :rangeEnd",
        ExpressionAttributeNames: {"#date": "date"},
        ExpressionAttributeValues: {
            ":profileId": info.profileId,
            ":rangeStart": info.rangeStart,
            ":rangeEnd": info.rangeEnd
        }
    };

    docClient.query(params, callback);
};

app.post("/excel", (req, res) => {
    var info = req.body;
    console.log(info);
    reportData(info, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        if (data.Items.length > 0) {
            var fileName = path.resolve(__dirname, info.profileId + ".xlsx");

            fs.unlink(fileName, ex => {
                // file not found swallow
            });

            var workbook = new Excel.Workbook();
            workbook.creator = "halversondm.com";
            workbook.lastModifiedBy = "halversondm.com";
            workbook.created = new Date();
            workbook.modified = new Date();

            var sheet = workbook.addWorksheet("ToiletData");
            sheet.columns = [
                {header: "Date and Time", key: "date"},
                {header: "Duration on the Toilet", key: "duration"},
                {header: "Type of Activity", key: "typeOfActivity"},
                {header: "Type of Void", key: "typeOfVoid"},
                {header: "Notes", key: "notes"},
                {header: "Was the Visit Prompted?", key: "promptedVisit"}
            ];

            data.Items.forEach(item => {
                sheet.addRow({
                    date: item.date,
                    duration: item.duration,
                    typeOfActivity: item.typeOfActivity,
                    typeOfVoid: item.typeOfVoid,
                    notes: item.notes,
                    promptedVisit: item.promptedVisit
                });
            });

            workbook.xlsx.writeFile(fileName).then(() => {
                res.download(fileName);
            });
        } else {
            res.sendStatus(404);
        }
    });
});

app.post("/signup", (req, res) => {
    var signupInfo = req.body;
    console.log(signupInfo);
    var profile = {
        emailAddress: signupInfo.email,
        key: signupInfo.key,
        name: signupInfo.name,
        config: {
            intervalBetweenToiletVisit: "60",
            rewardForVoiding: "Ice cream!",
            intervalBetweenDryCheck: "30",
            traineeDurationOnToilet: "5"
        },
        profileId: uuid.v4()
    };
    var params = {
        TableName: "Profile",
        Item: profile
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
            if (data.hasOwnProperty("Item")) {
                if (data.Item.key === loginInfo.key) {
                    res.send({config: data.Item.config, profileId: data.Item.profileId});
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.sendStatus(404);
            }
        }
    });
});

app.post("/reportData", (req, res) => {
    var info = req.body;
    console.log(info);
    reportData(info, (err, data) => {
        if (err) {
            console.log(JSON.stringify(err, null, 2));
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
        res.send(data);
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
