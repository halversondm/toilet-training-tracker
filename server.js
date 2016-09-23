"use strict";

import path from "path";
import fs from "fs";
import express from "express";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import config from "./webpack.config.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import AWS from "aws-sdk";
import historyApiFallback from "connect-history-api-fallback";
import Excel from "exceljs";

var uuid = require("uuid");

const isDeveloping = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = express();

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));

if (isDeveloping) {
    console.log("Running the 'hot' version of the code");
    const compiler = webpack(config);
    app.use(historyApiFallback({verbose: false}));
    app.use(webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: "app",
        hot: true,
        quiet: false,
        noInfo: false,
        lazy: false,
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    }));

    app.use(webpackHotMiddleware(compiler));
} else {
    console.log("Running the 'production' version of the code");
    app.use(express.static(path.resolve(__dirname, "dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
}

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
    var updateExpress = `set config.intervalBetweenToiletVisit = :a, config.rewardForVoiding = :b, 
    config.intervalBetweenDryCheck = :c, config.traineeDurationOnToilet = :d`;
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

app.listen(port, "0.0.0.0", err => {
    if (err) {
        console.log(err);
    }
    console.info("==> Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
});
