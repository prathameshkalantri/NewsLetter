const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    var firstName =req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data = {
        members :[
            {
                email_address: email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
    const url =  "https://us21.api.mailchimp.com/3.0/lists/d7f095f338"
    const option = {
        method: "post",
        auth : "pk:8ca62aeaf19f531384e3c0d3d50a5f6f-us21"
    }
    
    const request = https.request(url, option, function(responce){
        if(responce.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        } else{
            res.sendFile(__dirname+"/failure.html");
        }
        responce.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(3000, function(){
    console.log("server running on port 3000");
});


// 8ca62aeaf19f531384e3c0d3d50a5f6f-us21 api key
// d7f095f338   list id 