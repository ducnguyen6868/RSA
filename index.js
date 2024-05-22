const express = require('express')
const path = require("path") // Đường dẫn 
const handlebars = require('express-handlebars')
const app = express() //Sử dụng thư viện express
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
app.engine('hbs', handlebars.engine({
  extname: '.hbs'
}))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
  res.render('home');
})
//Thư viện làm việc với RSA
const forge = require('node-forge');

// Tạo cặp khóa RSA
const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);
//console.log(privateKey);

//console.log('Khóa công khai:', forge.pki.publicKeyToPem(publicKey));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on("Request lock", (data) => {
    socket.emit("Respone lock", { privateKey, publicKey });
  });
  let data , md ,signature , base64Signature;
  socket.on("sign", (document) => {
    // Dữ liệu cần ký
      data = document;

    // Tạo hàm băm SHA-256 của dữ liệu
     md = forge.md.sha256.create();
    md.update(data, 'utf8');

    // Tạo chữ ký số
     signature = privateKey.sign(md);

    // Chuyển đổi chữ ký thành định dạng Base64 để dễ dàng truyền tải
     base64Signature = forge.util.encode64(signature);

    //console.log('Chữ ký số:', base64Signature);
    socket.emit("signature",base64Signature);
  });
  socket.on("check signature", (data) => {
    const md = forge.md.sha256.create();
    md.update(data.signedDocument, 'utf8');
    const rawSignature = forge.util.decode64(data.signature);
    const verified = publicKey.verify(md.digest().bytes(), rawSignature);
    socket.emit("verification result", verified);
    console.log(verified);
  });
  
})
server.listen(3000, () => {
  console.log('The server is running at http://localhost:3000');
});