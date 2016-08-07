/**
 * Created by halversondm on 8/7/16.
 */

var params = {
    TableName: "Track",
    KeyConditionExpression: "profileId = :profileId",
    ExpressionAttributeValues: {":profileId": 1}
};

docClient.query(params, function(err, data) {
    if (err)
        console.log(JSON.stringify(err, null, 2));
    else
        console.log(JSON.stringify(data, null, 2));
});