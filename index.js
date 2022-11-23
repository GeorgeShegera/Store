require("dotenv").config();

const express = require("express");
const Router = require('express');
const router=new Router();
const path=require("path");
const fs=require("fs");
const uuid=require("uuid");
const fileUpload = require("express-fileupload")
const cors=require("cors");
const app = express(router);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(fileUpload({}));
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(express.static(path.join(__dirname, 'build')));


const PORT=8080;

app.get("/",(req,resp)=>{
    resp.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.get("/getProduct",(req,resp)=>{
    let products=[];
    try{
        products = JSON.parse(fs.readFileSync('./products.json'));        
    }catch(err){
        products=[];
    }
    resp.json({res:products});
})

app.post("/addProduct",async (req,resp)=>{
    let products=[];
    try{
        products = JSON.parse(fs.readFileSync('./products.json'));        
    }catch(err){
        products=[];
    }
    let {name,price,description}=req.body;
    const { image } = req.files;
    const nameImg = uuid.v4() + ".jpg";
    await image.mv(path.resolve(__dirname, 'static', nameImg));
    const newProduct={img:nameImg,name,price,description};
    products.push(newProduct);
    fs.writeFileSync('products.json',JSON.stringify(products));       
    resp.json({res:products});
})

app.post("/delProduct",(req,resp)=>{
    console.log(1);
    let products=[];
    try{
        products = JSON.parse(fs.readFileSync('./products.json'));        
    }catch(err){
        products=[];
    }
    const {idx}=req.body;
    products.splice(idx,1);
    fs.writeFileSync('products.json',JSON.stringify(products));       
    resp.json({res:products});
})

    

const start = async () => {
    try {
        app.listen(PORT, () => {

            console.log('server started on port:' + PORT);

        });
    }
    catch (error) {
        console.log(error);
    }
}

start();