// const express=require('express')
// const app=express()
// const cors=require('cors')

// app.use(cors())
// app.use(express.json())

// app.listen(3005,()=>{
//     console.log('hijdk')
// })
// app.get('/',(req,res)=>{
//     res.send('Hello The server is running')
// })
// app.post('/uploadfile',(req,res)=>{
//     res.send('Rhythm')
// })

const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const fs = require('fs');
const csv = require('fast-csv');
const mysql = require('mysql2')
const multer = require('multer')
const path = require('path')
 
 
//use express static folder
app.use(express.static("./public"))
 
// body-parser middleware use
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))
 
// Database connection
const db=mysql.createConnection({
    user : 'root',
    host:'localhost',
    password:'1234',
    database:'experiment'
})
 
db.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
})
 
//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads/')    
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});
 
//! Routes start
 
//route for Home page
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });
 
//@type   POST
// upload csv to database
app.post('/uploadfile', upload.single("uploadfile"), (req, res) =>{
    UploadCsvDataToMySQL(__dirname + '/uploads/' + req.file.filename);
    console.log('CSV file data has been uploaded in mysql database ' + err);
});
 
function UploadCsvDataToMySQL(filePath){
    let stream = fs.createReadStream(filePath);
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // Remove Header ROW
            csvData.shift();
  
            // Open the MySQL connection
            db.connect((error) => {
                if (error) {
                    console.error(error);
                } else {
                    let query = 'INSERT INTO experiment (time,PM25,Average_temp,rain_precipitation,wind_speed,visibility,cloud_cover,relative_humidity,station,division,organization,season) VALUES ?';
                    db.query(query, [csvData], (error, response) => {
                        console.log(error || response);
                    });
                }
            });
             
            // delete file after saving to MySQL database
            // -> you can comment the statement to see the uploaded CSV file.
            fs.unlinkSync(filePath)
        });
  
    stream.pipe(csvStream);
}
 
//create connection
app.listen(3005, () => console.log(`Server is running`))