const http = require("http");



const server = http.createServer((req, res) => {
   console.log("server created");
   res.end("helloworfd");
});

server.listen(5000,"localhost", () => {
   console.log("server is running on port 5000");
});