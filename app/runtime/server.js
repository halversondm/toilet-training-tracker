/*
 Main server configuration using NodeJS and ExpressJS
 */
"use strict";
console.log("halversondm toilettracker site");

const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const port = 3001;
const app = express();
const Excel = require("exceljs");
const uuid = require("uuid");

let endpoint = "https://dynamodb.us-east-1.amazonaws.com";
let fileLocation = __dirname;

if (process.env.NODE_ENV === "development") {
    endpoint = "http://localhost:8000";
    fileLocation = path.join(__dirname, "dist");
}

AWS.config.update({
    region: "us-east-1",
    endpoint: endpoint
});

const docClient = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("common"));
app.use(express.static(fileLocation));

app.get("*", (req, res) => {
    res.sendFile(path.join(fileLocation, "index.html"));
});

const deleteEmptyKeys = object => {
    Object.keys(object).forEach(key => {
        if (object[key] === "") {
            delete object[key];
        }
    });
};

const reportData = (info, callback) => {
    const params = {
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
    const info = req.body;
    console.log(info);
    reportData(info, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        if (data.Items.length > 0) {
            const fileName = path.resolve(__dirname, info.profileId + ".xlsx");

            fs.unlink(fileName, ex => {
                // file not found swallow
            });

            const workbook = new Excel.Workbook();
            workbook.creator = "halversondm.com";
            workbook.lastModifiedBy = "halversondm.com";
            workbook.created = new Date();
            workbook.modified = new Date();

            const sheet = workbook.addWorksheet("ToiletData");
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
    const signupInfo = req.body;
    console.log(signupInfo);
    const profile = {
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
    const params = {
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
    const loginInfo = req.body;
    console.log(loginInfo);
    const params = {
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
    const info = req.body;
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
    const track = req.body;
    deleteEmptyKeys(track);
    console.log(track);
    const params = {
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
    const configuration = req.body;
    console.log(configuration);
    const updateExpress = `set config.intervalBetweenToiletVisit = :a, 
  config.rewardForVoiding = :b, config.intervalBetweenDryCheck = :c, config.traineeDurationOnToilet = :d`;
    const params = {
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

app.listen(port, "0.0.0.0", err => {
    if (err) {
        console.log(err);
    }
    console.info("==> Listening on port %s", port);
});
