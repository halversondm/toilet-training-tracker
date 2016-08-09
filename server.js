/* eslint no-console: 0 */
import path from "path";
import express from "express";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import config from "./webpack.config.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import AWS from "aws-sdk";
import historyApiFallback from "connect-history-api-fallback";

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
