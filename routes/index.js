var express = require('express');
var router = express.Router();

const fs = require("fs");
const path = require("path");

const upload = require("../utils/multer").single('image');
const Books = require("../models/bookModel");
const { log } = require('console');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/create', function(req, res, next) {
  res.render('create');
});

router.post('/create',upload , async function(req, res, next) {
     try {
      const newbook = new Books({ ...req.body, image: req.file ? req.file.filename :""});
      await newbook.save();
      res.redirect("/readall");
     } catch (error) {
      res.send(error);
     }
  // BOOKS.push(req.body)
  // Books.create(req.body).then(()=>{
  //   res.redirect("/readall")
  // }).catch((err)=>res.send(err));
});

router.get('/readall',async function(req, res, next) {
     try {
      const books = await Books.find();
      res.render("library",{ books:books });
     } catch (error) {
      res.send(error)
     }

//   Books.find().then((books)=>{
//     res.render("library",{books:BOOKS});
//   }).catch((err)=>res.send(err));
});  

router.get('/delete/:id', async function(req, res, next) {
  try {
    const book = await Books.findByIdAndDelete(req.params.id);
    if(book.image) fs.unlinkSync(path.join(__dirname,"..","public","images", book.image));
    res.redirect("/readall",);
  } catch (error) {
    res.send(error)
  }
  // BOOKS.splice(req.params.index , 1)
  // res.redirect("/readall")
}); 


router.get('/update/:id',async function(req, res, next) {
  try {
    const book = await Books.findById(req.params.id);
    res.render("update", {book:book});
  } catch (error) {
    res.send(error)
  }
  // const i = req.params.index;
  // const b = BOOKS[i];
}); 


router.post('/update/:id', upload, async function(req, res, next) {
  try {
    const data = req.file ? {...req.body,image:req.file.filename}:{...req.body};
    await Books.findByIdAndUpdate(req.params.id, data);
    res.redirect("/readall")
  } catch (error) {
    res.send(error);
  }
  // const i = req.params.index;
  // BOOKS[i] = req.body;
  // res.redirect("/readall")
}); 

router.get('/about', function(req, res, next) {
   res.render("about")
});

module.exports = router;
