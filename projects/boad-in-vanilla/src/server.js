const http = require("http")
const url = require("url")
const path = require("path")
const fs = require("fs")
constport = process.argv[2] || 8888
const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "svg": "image/svg+xml",
    "json": "application/json",
    "js": "text/javascript",
    "css": "text/css"
};

http.createServer(function(request, response) {

    const uri = url.parse(request.url).pathname
    let filename = path.join(process.cwd(), uri);

    fs.exists(filename, function(exists) {
        if (!exists) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory())
            filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if (err) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.write(err + "\n");
                response.end();
                return;
            }

            var mimeType = mimeTypes[filename.split('.').pop()];

            if (!mimeType) {
                mimeType = 'text/plain';
            }

            response.writeHead(200, { "Content-Type": mimeType });
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(3001);