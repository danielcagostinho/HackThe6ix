var AWS = require("aws-sdk");
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAVWY4UGXHVSCVZ3PU',
    secretAccessKey: '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',
    });
var cp = new AWS.Comprehend({region: "us-east-1"});

comment = "It's not that big, but still makes a nice gift for that someone who: is from, misses or loves Arizona. I'm US Army, active duty and I travel the world, my wife, who is from AZ and comes with me in my travels really appreciated the home gift. This is not a complaint, but one would have to appreciate the idea of this gift, thus, don't expect the locations to be drawn to scale or remotely in the right place. Such as, Flagstaff is too far north and the 89 isn't traveling in the right direction. It is a nice wall hanging gift."

var keywords = [];
cp.detectSentiment({LanguageCode: "en", Text: comment}, (err, data) => {
    if(err) {
        console.log(err);
    } else {

        cp.detectKeyPhrases({LanguageCode: "en", Text: comment}, (err1, data1) => {
            if(err) {
                console.log(err1);
            } else {
                data1['KeyPhrases'].forEach(function(keyPhrase){
                    keywords.push(keyPhrase['Text']);
                    console.log(keywords)
                })
            }
        });  
    }
    
         
})