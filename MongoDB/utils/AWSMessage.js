var { AWS, sns } = require('./aws_sns');

let sendMessage = (PhoneNumber, Message) => {
    Message = Message || "You are invited to the world of BBFitness";
    // Create publish parameters
    var params = {
        PhoneNumber,
        Message
    };

    // Create promise and SNS service object
    var publishTextPromise = sns.publish(params).promise();

    // Handle promise's fulfilled/rejected states
    publishTextPromise.then(
        function (data) {
            console.log("MessageID is " + data.MessageId);
        }).catch(
            function (err) {
                // console.error(err, err.stack);
            });

}

module.exports = {
    sendMessage
}