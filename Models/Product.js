import mongoose from "mongoose";



//Defining Schema 
const ProductSchema = new mongoose.Schema({
    name : {type:String, required: true, trim: true},
    category : {type:String, required: true, trim: true},
    stock : {type:String, required: true, trim: true},
    price : {type:String, required: true, trim: true},
});

//Model

const ProductModel = mongoose.model("product", ProductSchema);

export default ProductModel