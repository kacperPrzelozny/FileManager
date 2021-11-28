var express = require('express');
var app = express();
var path = require('path');
var counter = 0;
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var formidable = require('formidable');
const { type } = require('os');
var PORT = process.env.PORT || 3000;
var data = [];
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

app.get("/", function(req, res) {
    res.render('upload.hbs');
})
app.get("/upload", function(req, res) {
    res.render('upload.hbs');
})
app.get('/filemanager', function(req, res) {
    let toSend = {
        data
    }
    res.render('filemanager.hbs', toSend)
})


app.post('/uploadFile', function(req, res) {
    let form = formidable({});
    form.multiples = true
    form.uploadDir = __dirname + '/static/upload/'
    form.keepExtensions = true
    form.parse(req, function(err, fields, files) {
        console.log(typeof(files.uploadedFile))
        if (!files.uploadedFile.length) {
            counter++
            let iconSrc = ""
            if (files.uploadedFile.type == "image/jpeg") {
                iconSrc = "jpg.png"
            } else if (files.uploadedFile.type == "text/plain") {
                iconSrc = "txt.png"
            } else iconSrc = "random.png"
            let file = {
                id: counter,
                name: files.uploadedFile.name,
                icon: iconSrc,
                size: files.uploadedFile.size,
                type: files.uploadedFile.type,
                path: files.uploadedFile.path,
                savedate: Date.now()
            }
            data.push(file)
            console.log(data)
        } else {
            files.uploadedFile.map((file) => {
                let iconSrc = ""
                if (file.type == "image/jpeg") {
                    iconSrc = "jpg.png"
                } else if (file.type == "text/plain") {
                    iconSrc = "txt.png"
                } else iconSrc = "random.png"
                counter++
                data.push({
                    id: counter,
                    name: file.name,
                    icon: iconSrc,
                    size: file.size,
                    type: file.type,
                    path: file.path,
                    savedate: Date.now()
                })
            })
        }
        console.log(data)
        res.redirect("/filemanager")
    });
});
app.get("/reset", (req, res) => {
    data = []
    counter = 0
    res.redirect("/filemanager")
})

app.get("/delete/:id", (req, res) => {
    let id = req.params.id;

    function deleteFile(element, index, array) {
        return (element.id != id);
    }
    data = data.filter(deleteFile)
    console.log(data)
    if(data.length == 0) counter=0
    res.redirect("/filemanager")
})

app.get("/info/:id", (req, res) => {
    let id = req.params.id;

    function filterFile(element, index, array) {
        return (element.id == id);
    }
    let file = data.filter(filterFile)
    console.log(file)
    res.render("info.hbs", file[0])
})

app.get("/info", (req, res) => {
    res.render("info.hbs")
})

app.get("/download/:id", (req, res) => {
    let id = req.params.id;

    function filterFile(element, index, array) {
        return (element.id == id);
    }
    let file = data.filter(filterFile)
    res.download(file[0].path, file[0].name)
})

app.listen(PORT, function() {
    console.log('listening on port: ' + PORT)
})
