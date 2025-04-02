const express = require("express");
const app = express();
const PORT = 8000;

// Routes
app.post("/addSchool", (req,res)=>{
    const {name, address, latitude , longitude} = req.body
})

if(!name || !address || !latitude || !longitude){
    return res.status(400).json
}

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`)
})
