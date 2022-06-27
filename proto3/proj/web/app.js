//const{readFile , readFileSync} = require('fs').promises;          // this async function is not working
const{readFile , readFileSync} = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const helpers = require('./helpers');


const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../dwn/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


  // 'upload-pic' is the name of HTML form action attribute
app.post('/upload-pic', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.iFilter }).single('profile_pic');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
        //res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./"> Return </a>`);
		// delay for tessaract to finish 
        res.sendFile('./page.html', {root: __dirname });
         
		
    });
});





app.get('/',(request,response) => {
    readFile('./index.html','utf8',(err,html) => {
        if(err) {response.status(500).send('sorry , out of order')}  
        response.send(html);
    })
    });


app.listen(port, () => console.log(`Listening on port ${port}__ available on http://localhost:${port}`));