/**
 * Created by halversondm on 8/6/16.
 */
"use strict";

var AWS = require("aws-sdk");

// AWS.config.update({
//     region: "us-west-2",
//     endpoint: "http://localhost:8000"
// });

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: "Profile",
    Item: {
        "profileId": 1,
        "emailAddress": "ryan.halverson06@gmail.com",
        "key": "test",
        "config": {
            "intervalBetweenDryCheck": 30,
            "intervalBetweenToiletVisit": 60,
            "traineeDurationOnToilet": 7,
            "rewardForVoiding": "Ice Cream"
        }
    }
};

docClient.put(params, function (err, data) {
    if (err) {
        console.error("Unable to insert Item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Item inserted.  Result:", JSON.stringify(data, null, 2));
    }
});