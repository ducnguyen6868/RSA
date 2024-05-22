document.addEventListener("DOMContentLoaded", () => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
        console.log("connected");
        const createSignatureButton = document.getElementById("create-signature");
        createSignatureButton.addEventListener("click", () => {
            socket.emit("Request lock", "PrivateKey and PublicKey");
            socket.once("Respone lock", (data) => {
                const div = document.querySelector(".lock-container");
                const privateKey = document.createElement("p");
                privateKey.textContent = data.privateKey;
                const publicKey = document.createElement("p");
                publicKey.textContent = data.publicKey;
                div.appendChild(privateKey);
                div.appendChild(publicKey);
                console.log(privateKey);
            })
        });
        const signButton = document.getElementById("sign");
        signButton.addEventListener("click", () => {
            const data = document.getElementById("file-content").value;
            console.log(data);
            if (data === "") {
                alert("Vui lòng nhập nội dung trong văn bản ký !");
            } else {
                socket.emit("sign", data);
                socket.on("signature", (data) => {
                    const signatureArea = document.getElementById("signed-document");
                    signatureArea.textContent = data;
                })
            }
        });
        const checkButton = document.getElementById("check-signature");
        checkButton.addEventListener("click", () => {
            const signedDocument = document.getElementById("file-content-other").value;
            const signature = document.getElementById("signature-check").value;
            socket.emit("check signature", { signedDocument, signature });
            socket.on("verification result", (result) => {
                if (result === true) {
                    document.getElementById("verification-result").value = "Chữ ký đúng";
                } else {
                    document.getElementById("verification-result").value = "Chữ ký sai";
                }
            })
        });
    });
    const saveButton = document.getElementById("saved-signature");
    saveButton.addEventListener("click", () => {
        const signatureArea = document.getElementById("signed-document");
        const signature = signatureArea.value;
        if (signature === "") {
            alert("Không tìm thấy chữ ký !!!");
        } else {
            const blob = new Blob([signature], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'chuky.txt'; // Tên file khi lưu

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Giải phóng bộ nhớ    

        }
    });
    const tranferButton = document.getElementById("tranfered-signature");
    tranferButton.addEventListener("click", () => {
        const signatureArea = document.getElementById("signed-document");
        const signature = signatureArea.value;
        if (signature === "") {
            alert("Không tìm thấy chữ ký !!!");
        } else {
            const signatureCheck = document.getElementById("signature-check");
            signatureCheck.textContent = signature;
        }
    });
});