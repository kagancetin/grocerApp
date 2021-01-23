const Product = require("../model/product");
const Transactions = require("../model/transactions");
module.exports = {
    index: async (req, res, next) => {
        res.render("pages/index");
    },
    look: async (req, res, next) => {
        res.render("pages/look");
    },
    allProducts:async (req, res, next) => {
        let products = await Product.find({removed: false});
        res.render("pages/allProducts",{products: products.map(part=>part.toJSON())});
    },
    allBarcodeWithoutProducts: async (req, res, next) => {
        let barcodeWithoutProducts = await Product.find({barcode : "",removed: false});
        res.send(barcodeWithoutProducts.map(part=>part.toJSON()));
    },
    addProduct: (req, res, next) => {
        let data = req.body;
        const addData = new Product(data);
        addData.save((err,doc)=>{
            if(err){
                console.log(err);
                res.send(false);
            } 
            else{
                res.send(doc);
            }
        });
    },
    editProduct: (req, res, next) => {
        let editProduct = Product.findByIdAndUpdate(req.params.id,req.body,{new: true}, (err,doc)=>{
            if(err){
                console.log(err);
                req.flash("error", "Güncellemede bir hata oldu lütfen tekrar deneyiniz!");
                res.redirect('back');
            } 
            else{
                let message = doc.name + " ürünü başarı ile güncellenmiştir."
                req.flash("success", message);
                res.redirect('back');
            }
        });
    },

    removeProduct: async (req, res, next) => {
        let anySales = await Transactions.find({
            salesList: {
                $elemMatch: {                           
                  "product":req.params.id
                }
            }
        });
        
        if(anySales.length>0){
            let removeProduct = Product.findByIdAndUpdate(req.params.id,{
                "$set": {
                    "shortcut": "",
                    "removed":true
                }
            },(err,doc)=>{
                if(err){
                    console.log(err);
                    req.flash("error", "Silme işleminde bir hata oldu lütfen tekrar deneyiniz!");
                    res.redirect('back');
                } 
                else{
                    let message = doc.name + " ürünü başarı ile silinmiştir."
                    req.flash("success", message);
                    res.redirect('back');
                }
            });
        }
        else{
            let removeProduct = Product.findByIdAndRemove(req.params.id,(err,doc)=>{
                if(err){
                    console.log(err);
                    req.flash("error", "Silme işleminde bir hata oldu lütfen tekrar deneyiniz!");
                    res.redirect('back');
                } 
                else{
                    let message = doc.name + " ürünü başarı ile silinmiştir."
                    req.flash("success", message);
                    res.redirect('back');
                }
            });
        }
    },

    shortcutProduct: (req, res, next) => {
        let removeProduct = Product.findOneAndUpdate(
            { "_id": req.params.id},
            
            { 
                "$set": {
                    "shortcut": req.body.shortcut,
                }
            },
            {new: true},
            (err,doc)=>{
                if(err){
                    console.log(err);
                    req.flash("error", "Kısayol tuşu işleminde bir hata oldu lütfen tekrar deneyiniz!");
                    res.redirect('back');
                } 
                else{
                    let message = doc.name + " ürününün kısayol tuşu '"+ doc.shortcut +"' olarak kaydedilmiştir."
                    req.flash("success", message);
                    res.redirect('back');
                }
            }
        );
    },

    searchProductByBarcode: async (req, res, next) => {
        let products = await Product.findOne({"barcode" : req.body.barcode,removed: false},(err,doc)=>{
            if(err) res.send({err:"Bir hata oluştu"});
            if(doc){
                res.send(doc);
            }
            else{
                res.send(false);
            }
        
        });
    },

    searchProductByShortcut: async (req, res, next) => {
        console.log(req.body.shortcut);
        if(req.body.shortcut != ""){
            let products = await Product.findOne({"shortcut" : req.body.shortcut,removed: false},(err,doc)=>{
                console.log(doc);
                if(err) res.send({err:"Bir hata oluştu"});
                if(doc){
                    res.send(doc);
                }
                else{
                    res.send(false);
                }
            
            });
        }
    },

    getQuantityTypes: async(req, res, next) => {
        let quantityTypes = await Product.distinct("quantity", (err, doc)=> {
            if(err) throw err;
            else{
                res.send(doc);
            }
        })
    }
}