import ProductModel from '../Models/Product.js'

class ProductController{
    static getAllProduct = async(req, res) => {
        try {
            const products = await ProductModel.find()

            if (!products) {
                return res.status(404).json({ message: 'No products found' }); 
            } else {
                res.status(200).json({ products });
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    static createProduct = async(req,res) =>{
        const {name , category, stock, price} = req.body
        if(name && category && stock && price){
            const product = new ProductController({
                name:name,
                category:category,
                stock:stock,
                price:price
            })
            await product.save()
            res.send({"status":"success", "message":"Product is added"})
        }
        else{
            res.send({"status":"failed", "message":"All fields are required"})
        }
    }
}

export default ProductController
