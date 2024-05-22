document.addEventListener("DOMContentLoaded", () => {
    const file = document.getElementById("file-button");
    const insertFile = document.getElementById("insert-file");
    file.addEventListener("click", () => {
        insertFile.click();
    });
    insertFile.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            if (file.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('file-content').value = e.target.result;
                };
                reader.readAsText(file);
            } else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
                readDocFile(file);
            } else {
                alert("Định dạng file không được hỗ trợ!");
            }
        }
    });

    function readDocFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            mammoth.convertToHtml({ arrayBuffer: e.target.result }, {
                styleMap: [
                    "b => strong", // In đậm
                    "i => em",     // In nghiêng
                    "u => u",      // Gạch chân
                    "strike => strike", // Gạch ngang
                    "color => span.color", // Màu chữ
                    "p[style-name='Heading 1'] => h1:fresh",
                    "p[style-name='Heading 2'] => h2:fresh",
                    "p[style-name='Heading 3'] => h3:fresh",
                    "p[style-name='Normal'] => p:fresh"
                ]
            })
            .then(result => {
                document.getElementById('file-content').value = result.value;
                applyColors(result.value);
            })
            .catch(err => {
                console.error(err);
                alert("Lỗi khi đọc file .doc hoặc .docx!");
            });
        };
        reader.readAsArrayBuffer(file);
    }

    function applyColors(html) {
        // Áp dụng màu sắc từ văn bản
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        doc.querySelectorAll('span[color]').forEach(span => {
            span.style.color = span.getAttribute('color');
        });
        document.getElementById('file-content').innerHTML = doc.body.innerHTML;
    }
    const fileOther = document.getElementById("insert-button-other");
    const insertFileOther = document.getElementById("file-input-other");
    fileOther.addEventListener("click", () => {
        insertFileOther.click();
    });
    insertFileOther.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            if (file.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('file-content-other').value = e.target.result;
                };
                reader.readAsText(file);
            } else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
                readDocFileOhter(file);
            } else {
                alert("Định dạng file không được hỗ trợ!");
            }
        }
    });

    function readDocFileOhter(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            mammoth.convertToHtml({ arrayBuffer: e.target.result }, {
                styleMap: [
                    "b => strong", // In đậm
                    "i => em",     // In nghiêng
                    "u => u",      // Gạch chân
                    "strike => strike", // Gạch ngang
                    "color => span.color", // Màu chữ
                    "p[style-name='Heading 1'] => h1:fresh",
                    "p[style-name='Heading 2'] => h2:fresh",
                    "p[style-name='Heading 3'] => h3:fresh",
                    "p[style-name='Normal'] => p:fresh"
                ]
            })
            .then(result => {
                document.getElementById('file-content-other').value = result.value;
                //applyColorsOther(result.value);
            })
            .catch(err => {
                console.error(err);
                alert("Lỗi khi đọc file .doc hoặc .docx!");
            });
        };
        reader.readAsArrayBuffer(file);
    }

    function applyColorsOhter(html) {
        // Áp dụng màu sắc từ văn bản
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        doc.querySelectorAll('span[color]').forEach(span => {
            span.style.color = span.getAttribute('color');
        });
        document.getElementById('file-content-other').innerHTML = doc.body.innerHTML;
    }
});