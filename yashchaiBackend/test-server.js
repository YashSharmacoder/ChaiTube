import http from "http";

http.createServer((req, res) => {
    console.log("bare server hit");
    res.end("ok");
}).listen(9999, () => {
    console.log("bare server on 9999");
});