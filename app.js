const express = require('express')
const AWS = require('aws-sdk')
const app = express()


app.use(express.json())


const creds = new AWS.SharedIniFileCredentials({profile: 'default'});
const sns =new AWS.SNS({creds, region:'us-east-1'})

app.get('/status',(req,res)=> res.send({status:'ok',sns}))



app.post('/subscribe',(req,res)=>{
    let params ={
        Protocol:'sms',
        TopicArn:'arn:aws:sns:us-east-1:787875291801:moshi',
        Endpoint:req.body.phoneNumber
    }
    sns.subscribe(params,(err,data)=>{
        if(err)console.log(err);
        res.send(data)

    })
})

app.post('/publish',(req,res)=>{
    let params ={
        Subject:req.body.subject,
        Message:req.body.message,
        TopicArn:'arn:aws:sns:us-east-1:787875291801:moshi'
    }
    sns.publish(params,(err,data)=>{
        if(err)console.log(err);
        res.send(data)

})
})




// function sendSMS(to_number, message, func_callback) {


//     AWS.config.update({
//         accessKeyId: Config.amazon_sns.accessKeyId,
//         secretAccessKey: Config.amazon_sns.secretAccessKey,
//         region: Config.amazon_sns.region
//     });

//     var sns = new AWS.SNS();

//     var SNS_TOPIC_ARN = Config.amazon_sns.arn.sms;

//     sns.subscribe({
//         Protocol: 'sms',
//         //You don't just subscribe to "news", but the whole Amazon Resource Name (ARN)
//         TopicArn: SNS_TOPIC_ARN,
//         Endpoint: to_number
//     }, function(error, data) {
//         if (error) {
//             common.log("error when subscribe", error);
//             return func_callback(false);
//         }


//         common.log("subscribe data", data);
//         var SubscriptionArn = data.SubscriptionArn;

//         var params = {
//             TargetArn: SNS_TOPIC_ARN,
//             Message: message,
//             //hardcode now
//             Subject: 'Admin'
//         };

//         sns.publish(params, function(err_publish, data) {
//             if (err_publish) {
//                 common.log('Error sending a message', err_publish);

//             } else {
//                 common.log('Sent message:', data.MessageId);
//             }

//             var params = {
//                 SubscriptionArn: SubscriptionArn
//             };

//             sns.unsubscribe(params, function(err, data) {
//                 if (err) {
//                     common.log("err when unsubscribe", err);
//                 }
//                 return func_callback(err_publish != null);
//             });
//         });
//     });
// }



const port = 3000;
app.listen(port,()=>{
    console.log('sms app listening on port 3000')
})