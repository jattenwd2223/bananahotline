'use strict';

const request = require('request');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));


// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
        // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});


// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "yinyeezus"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

let ring_stat = false;

function is_option(input){
    return(input.length == 1 && !isNaN(input))
}

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;
    let image_req = false;
    let image_payload;
  
    // Checks if the message contains text
    if (received_message.text) {    
        let response_text;

        if (ring_stat == true && is_option(received_message.text)){
            let error = false;

            switch(received_message.text){
                case "1":
                    response_text = "Looks like you're back for more, you horny slut... stay put like a good girl while you get connected."
                    break;
                case "2":
                    response_text = "Thank you for calling master, I've been waiting so long... please give me a minute to get my body ready for you"
                    break;
                case "3":
                    response_text = "Banana Hotline tech support, thank you for calling. Please hold while we connect you to the next available representative."
                    break;
                case "4":
                    response_text = "Welcome to Dr.Banana's therapy. Please hold."
                    break;
                case "5":
                    response_text = "Hi boo, you're doing great and I love you. Hold on for a sec while I get on <3"
                    break; 
                default:
                    response_text = "Please try with these following options: \n \t 1 = S \n \t 2 = M \n \t 3 = tech support \n \t 4 = dr phil shit \n \t 5 = wholesome <3"   
                    error = true;            

            }
            if(!error){
                ring_stat = false; 
            }


        }
        else {
            switch (received_message.text) {
                case "ring":
                    response_text = "Thank you for calling Banana Hotline! Please enter an option!";
                    ring_stat = true;
                    break;
                case "banana411":
                    response_text = "enter 'ring' to connect, and use these options: \n \t 1 = S \n \t 2 = M \n \t 3 = tech support \n \t 4 = dr phil shit \n \t 5 = wholesome <3 \n \nenter 'spicy' to get a daily dose of spice \n \nenter 'cute' to see a v v v v v cute image!";
                    break;
                case "spicy":
                    image_req = true;
                    image_payload = {
                        "url":"https://lh3.googleusercontent.com/yNpWb2Ar0c8vRYQsf6WOOsCYAuCuDrphBOAgBSvZsSMGzn5O1S8lVoKLvplPm-sO8xxQcx0xbzUSWLvy-DslNFoLpPSTgsYDmVg7xWNrh4teR4FMgZvX2cbuUP1JGhXKO-GH6XA7LqWp-x5t7QE2HstzxAgqsdOx12GUeW6qyJOYRcX_pOdsKvbOe2AbR32kbfwj5yd2OrluVkGW97C7cLh64GLA4Kvw24UCbbZvqrT7bp1fOgcOrGuH2rfCHxIiN-QTJCebhWdwhFy_6m6ehNVgfA7oTuzIS0SbzErz_MmpSEoQak1yL_QRKqMyzR0xuzqvb6eKdwGdtABJ_qKrOYBbPW11rojLqU3z8WzRB7DC5csSXXuoxXxTyM90na1p4jK-_qlJ4653DssP6HktK0gCVEFLsaX1Jm-eA-mfPxA1gEs4aqeIm-HeDx0_GM3NdM6hMRyozq1cuqPzpsh-Q5gkOaz89rdBP7GuFWugz6EsSHZ7JpL3cRq7OHdE1TXRdWf1X09wG_ukDXBajNx7Vu56mWb8nSdCXizYRI9Opyi_dsjZbQVo2ceEYNwm-K3E_EQKXMSaWOoGPH0m8drnq1uTOjc4YxMrSfdCsAY1LAgglaPKjkpcAlSdMZD1zP_AgvH2ONwY5azwhqjzB-usgQNi=w890-h1580-no", 
                        "is_reusable":true
                    }
                    break;
                case "cute":
                    image_req = true;
                    image_payload = {
                        "url":"https://doc-08-14-docs.googleusercontent.com/docs/securesc/gnth8a63p65rne1vpg5tepttaqjunbve/6gqc991fb50ks3ghbqqdkqufj2fnklqq/1546034400000/10403636626535349627/10403636626535349627/1GsXH9hK6qdVQidGovv82Iwxj0izckv6v?e=view&h=06799207954161304006&nonce=bma17cviirio2&user=10403636626535349627&hash=j3i3s0qc8g6fou0qkcdcksn12adqtid2", 
                        "is_reusable":true
                    }
                default:
                    response_text = "type 'banana411' for help!";
            }
        }

        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        console.log("IMAGEREQQQQQQQQQQQQQQQ")
        console.log(image_req);
        if (image_req == false){ 
            response = {
                "text": response_text
            }
        }
        else{
            console.log("ASDFADSFASDFDSAFADSFADSFADSFASDFASDFASDFADSFASDFSADF\n\n\n\n");
            response = {
                "attachment":{
                    "type":"image", 
                    "payload":image_payload
                }
            }
        }
    } 
    else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
          	"attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                              "type": "postback",
                              "title": "No!",
                              "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    } 
  
    // Sends the response message
    callSendAPI(sender_psid, response); 

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;
      
    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thank you for submitting!" }
    } 
    else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
          console.error("Unable to send message:" + err);
        }
    }); 
}