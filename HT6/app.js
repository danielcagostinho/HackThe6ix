var methodOverride = require('method-override'),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),    
    express        = require('express'),
    app            = express();

// AWS Setup
var AWS = require("aws-sdk");
AWS.config.update({
    region: 'us-west-1',
    accessKeyId: 'AKIAI7334CVLZX5XYYZQ',
    secretAccessKey: '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',
    });
process.env.aws_access_key_id = 'AKIAI7334CVLZX5XYYZQ';
process.env.aws_secret_access_key = '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';
var cp = new AWS.Comprehend({region: "us-east-1"});

// TODO DELETE

var products = [{'asin': 'B07DRQ3382', 'comments': ['Overall, a nice gift for a friend or relative, but don\'t expect the results indicated in the product description. I personally had below a 50% success rate, so your seeds may or may not grow into anything. Some of the negative aspects of my experience were as follows: 1. The soil discs were not packed well so the entire kit itself was covered in dehydrated soil creating a lot of dust upon opening. This may create some complications if you have strong allergies to dust/dirt or are planning to gift wrap the kit. 2. Some seed packs (namely the Brazilian Rosewood and Black Spruce) came in limited amounts of 4-5 seeds, whereas the other two seed packs had 12-15 seeds each. The Brazilian Rosewood seeds are also quite delicate and a good portion of them came chipped or broken when the kit arrived. As such, the Brazilian Rosewood seeds did not germinate. In addition, having a limited number of seeds decreases germination rates and the ability to "try again" if things don\'t work out the first time you sow the seeds. 3. There are no instructions on how to appropriately treat the D. Regia seeds. Apparently you need to use sand paper or some other tool to remove the hard outer shell in order for the seeds to germinate properly. I didn\'t do that the first time around and wasted seeds because I didn\'t know I needed to do that. It would\'ve been helpful to have those instructions available at the time I sowed the seeds. 4. The bags/sacks provided to house the soil and seeds on initial sowing do not have holes in the bottom to drain water. As a result, you do need to be extra careful when watering as there is a high probability of mold forming. In addition, the wooden markers absorb water and can help facilitate the growth of mold if you insert them into the soil. I would recommend using a plastic marker or nothing at all.', 'My husband wanted to try to grow his own bonzai trees, this kit seemed like it would be the perfect gift. He started growing them at the middle of October. And we are currently one and a 1/2 months into the growing portion. Only 1 type of seed has sprouted so far. We have been getting some mold on the dirt, but I do not think that is from the seeds. My other plants that I have growing in pots nearby also have mold. I do not know yet if it was a good purchase, I am hopeful that even if one plant grows it will be pretty cool. I had hoped that most or all of them would have at least sprouted. UPDATE: 3 months in and only 1 grew. Mold filled the bottom of the box, had to transplant just to save what did grow. Wish it would have worked.', 'A great little kit. To date 3 of my seed types have sprouted, I’m hoping the 4th will as well.', 'SEEDS SOWN: Oct 17, 2018 - I am in the early stages of this project (to the point of nothing yet sprouting), so there is no way i can leave a 100% accurate review as of now, i can say however, whether this be due to my source of water (regular tap) or the soil itself, some sort of micro fungus has begun to grow over the surface (top layer) of the soil. This fungus can be seen to the human eye i do not however have a camera good enough to prove my statement. I do not believe it to be harmful to the bonsai seeds; the look to be small versions of "Leucocoprinus birnbaumii" or the "Plantpot Dapperling", a common house plant infection, but this could mean the soil sent out by this company may be infected with some sort of fungal spore. I am enjoying the experience regardless of the spores, I do hope i am able to enjoy the bonsais if they begin to sprout and grow into beautiful little trees.', 'Update: they sent me a replacement, so, we are going to try to grow these ourselves and I will update with the quality of the seedlings, to see if that is more of a selling point. In any case, their customer service is worthy of 5 stars. —— I received this and there was tape over the finger hole on the box. I went to wrap the item as a Christmas gift and decided to remove the tape and paint came off with it. Now it looks ugly in the front and since I bought this specific bonsai kit for the aesthetics and gift worthiness I’m really disappointed. Why they even put tape on it if they are going to color the box with this material I do not know.', 'out of the 4 starter pots, 2 of the delonix sprouted and grew within 3 weeks. two of the pinus also grew within 4 weeks, but stalled in growth another week after that. i repotted the 2 delonix and they are still steadily growing. the pinus havent done much. as for the other two species, i havent seen anything at all. i still have more seeds so i try again but with regular potting mix', 'I just received my Bonsai kit, and I am very impressed with it. I love the wooden box it is all packaged in, and the little burlap pots to grow your seeds in are so clever. You get 4 different kinds of Bonsai seeds, and 4 pots. It comes with easy to understand instructions, and plant markers to write the date and name of seed type on, which are also made of wood. As I am a garden enthusiast, I thought this would be a fun project to try. This would be a great gift for a young person to teach them the basics of cultivating seeds. Very nice kit for under $20 bucks. I can’t wait to get started growing my own personal Bonsai trees. I would definitely buy this kit again for a gift!!', 'I got this for my husband and he thought it was the most awesome thing when he opened it! He loves growing plants inside and he’s always wanted a bonsai tree. Can’t wait to see them come up!']}]


var test = products[0];


// Mongo and App Config
mongoose.connect('mongodb+srv://client:McAi163fBaW0_@cluster0-96ptv.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
var db = mongoose.connection;


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
// ROOT Route
app.get('/', (req, res) => {
    res.send("HELLO FROM THE ROOT");
});

// INDEX Route
app.get('/reviews', (req, res) => {
    res.render('index');
});

app.post('/reviews', (req, res) => {
    var asin = req.body.asin;
    res.redirect('/reviews/' + asin);
});

// SHOW Route
app.get('/reviews/:id', (req, res) => {
    // Get the ID from the url
    asin = req.params.id;
    var counter = 0;
    // Grab the comments with that ID
    var comments = test.comments;
    var maxIter = comments.length;
    var product = {
        asin: asin,
        comments: [
        ],
        averageScore: [0,0,0,0]
    }
    // Grab the sentiments for each comment
    comments.forEach(comment=> { 
        cp.detectSentiment({LanguageCode: "en", Text: comment}, (err, data) => {
            if(err) {
                console.log(err);
            } else {
                averageScore = [0,0,0,0]
                sentiment = {
                    comment: comment,
                    positive: data.SentimentScore.Positive, 
                    neutral: data.SentimentScore.Neutral,
                    negative: data.SentimentScore.Negative,
                    mixed: data.SentimentScore.Mixed,
                };
                product.averageScore[0] += data.SentimentScore.Positive;
                product.averageScore[1] += data.SentimentScore.Negative;
                product.averageScore[2] += data.SentimentScore.Neutral;
                product.averageScore[3] += data.SentimentScore.Mixed;
                product.comments.push({text: comment, sentiments: sentiment, averageScore: averageScore});
                counter++;
                if (counter == maxIter){
                    product.averageScore[0] = product.averageScore[0]/comments.length;
                    product.averageScore[1] = product.averageScore[1]/comments.length;
                    product.averageScore[2] = product.averageScore[2]/comments.length;
                    product.averageScore[3] = product.averageScore[3]/comments.length;
                    res.render('show',{product: product});
                }
            };
        }); 
    })
});
app.listen(3000, () => {
    console.log("HT6 Server is running");
});



