const express = require("express");
const { callbackify } = require("util");
const app = express()

app.use("/", (req, res, next) => {
    res.send("This is the express server");
})
  
// Handling GET /hello request
app.get("/hello", (req, res, next) => {
    res.send("HELLO THIS IS ARLIND");
})
  
// Server setup
app.listen(3000, () => {
    console.log("Server is Running");
})
function addData(array){
    let obj = {hp:array[0], speed:array[1], damage:array[2]};
    let json = JSON.stringify(obj);
    var fs = require('fs'); 
    fs.writeFile('./playerData.json', json, err => {
        if(err){
            console.log('Error writing file', err)
        }else{
            console.log('Successfully wrote file')
        }
    })      
}
