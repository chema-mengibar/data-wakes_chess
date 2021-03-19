var http = require('http');
var fs = require('fs');


fs.readFile('../src/index.html', function(err, html) {
    if (err) {
        throw err;
    }
    http.createServer(function(req, res) {

        console.log(req)

        // let mimeType = 'text/plain'; // formato por defecto (podemos escoger el que deseemos)
        // const lastPoint = path.split('').lastIndexOf('.');
        // const ext = path.substring(lastPoint + 1);
        // if (ext === 'html' || ext === 'htm') {
        //     mimeType = 'text/html';
        // }
        // if (ext === 'css') {
        //     mimeType = 'text/css';
        // }
        // if (ext === 'js') {
        //     mimeType = 'application/javascript';
        // }
        // res.set('content-type', mimeType);

        var mimeType = mimeTypes[filename.split('.').pop()];

        console.dir(req.url);
        res.writeHeader(200, { "Content-Type": mimeType });
        res.write(html);
        res.end();
    }).listen(3001);
});