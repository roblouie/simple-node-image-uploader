const express = require('express');
const fs = require('fs');
const multer  = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: 'uploaded-images/',
  filename(request, file, callback) {
    const extension = path.extname(file.originalname);
    callback(null, path.basename(file.originalname, extension) + Date.now() + extension);
  }
});
const upload = multer({ storage: storage });

const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/images', express.static('uploaded-images'));

app.post('/upload-photos', upload.array('photos'), function (req, res) {
  const uploadInfo = req.files.map(file => {
    return {
      sourceName: file.originalname,
      newName: file.filename
    };
  });
  res.send(uploadInfo);
});

app.get('/test-upload', (request, response) => {
  response.send(`
    <form action="upload-photos" method="post" enctype="multipart/form-data">
      <input type="file" name="photos" multiple>
      <input type="submit">
    </form>
  `);
});

app.get('/list-images', (req, res) => {
  fs.readdir('./uploaded-images', (err, files) => {
    res.send(files);
  });
});

app.listen(3000, () => console.log('Listening on port 3000. Note this is a simple sample uploader and does not have the proper security checks for a production app.'));