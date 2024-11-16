document.querySelectorAll('input[name="inputType"]').forEach((input) => {
    input.addEventListener('change', function() {
        document.getElementById('imageInput').style.display = this.value === 'image' ? 'block' : 'none';
        document.getElementById('textInput').style.display = this.value === 'text' ? 'block' : 'none';
    });
});

function processInput() {
    const inputType = document.querySelector('input[name="inputType"]:checked').value;
    if (inputType === 'image') {
        convertImage();
    } else {
        convertTextToImage(document.getElementById('textInput').value);
    }
}

function convertImage() {
    const fileInput = document.getElementById('imageInput');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            canvas.width = 212;
            canvas.height = 34;
            ctx.drawImage(img, 0, 0, 106, 17);
            const imageData = ctx.getImageData(0, 0, 106, 17);
            const binaryData = convertToBinary(imageData);
            ctx.putImageData(binaryData, 0, 0);
            const kValue = calculateKFromImageData(binaryData);
            document.getElementById('valueK').textContent = wrapText(kValue);
        };
        img.src = event.target.result;
    };

    if (fileInput.files.length > 0) {
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function convertTextToImage(text) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 212;
    canvas.height = 34;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 5);
    const imageData = ctx.getImageData(0, 0, 106, 17);
    const binaryData = convertToBinary(imageData);
    ctx.putImageData(binaryData, 0, 0);
    const kValue = calculateKFromImageData(binaryData);
    document.getElementById('valueK').textContent = wrapText(kValue);
}

function convertToBinary(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const value = (avg < 128) ? 0 : 255;
        data[i] = data[i + 1] = data[i + 2] = value;
    }
    return imageData;
}

function calculateKFromImageData(imageData) {
    const data = imageData.data;
    let k = 0n;
    for (let y = 0; y < 17; y++) {
        for (let x = 0; x < 106; x++) {
            const index = (x + y * 106) * 4;
            if (data[index] === 0) {
                const bitPosition = x + 106 * (16 - y);
                k += 2n ** BigInt(bitPosition);
            }
        }
    }
    return k.toString();
}

function wrapText(text) {
    const chunkSize = 80;
    let wrappedText = '';
    for (let i = 0; i < text.length; i += chunkSize) {
        wrappedText += text.substring(i, i + chunkSize) + '\n';
    }
    return wrappedText.trim();
}

function generateLaTeX() {
    const kValue = document.getElementById('valueK').textContent;
    const latexContent = `
\\documentclass[12pt]{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{geometry}
\\usepackage{seqsplit}  % Add the seqsplit package
\\geometry{a4paper, margin=1in}
\\begin{document}

\\begin{figure}[h]
\\centering
\\includegraphics[width=1.0\\textwidth]{image.png}  % Ensure your image is named correctly
\\end{figure}

\\[
\\Huge \\frac{1}{2} < \\left\\lfloor \\text{\\normalsize mod}\\left(\\left\\lfloor \\frac{y}{17} \\right\\rfloor 2^{-17 \\left\\lfloor x \\right\\rfloor - \\text{\\normalsize mod}(\\left\\lfloor y \\right\\rfloor, 17)}, 2\\right) \\right\\rfloor
\\]

\\vspace{2cm}
\\textbf{K = \\seqsplit{${kValue}}}
\\end{document}
    `;

    // Display LaTeX code in a new window or an element
    const win = window.open('', 'LaTeXCode');
    win.document.body.innerHTML = `<pre>${latexContent}</pre>`;
}


function generateLaTeX_002() {
    const kValue = document.getElementById('valueK').textContent;
    const latexContent = `
\\documentclass[12pt]{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\begin{document}

\\begin{figure}[h]
\\centering
\\includegraphics[width=0.8\\textwidth]{image.png} % Ensure your image is named correctly
\\end{figure}

\\[
\\Huge \\frac{1}{2} < \\left\\lfloor \\text{\\normalsize mod}\\left(\\left\\lfloor \\frac{y}{17} \\right\\rfloor 2^{-17 \\left\\lfloor x \\right\\rfloor - \\text{\\normalsize mod}(\\left\\lfloor y \\right\\rfloor, 17)}, 2\\right) \\right\\lfloor
\\]

\\vspace{1cm}
\\centering
\\Large \\textbf{K = ${kValue}}
\\end{document}
    `;

    // Display LaTeX code in a new window or an element
    const win = window.open('', 'LaTeXCode');
    win.document.body.innerHTML = `<pre>${latexContent}</pre>`;
}



function generateLaTeX_001() {
    const kValue = document.getElementById('valueK').textContent;
    const latexContent = `
\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\begin{document}

\\begin{figure}[h]
\\centering
\\includegraphics[width=0.8\\textwidth]{image.png} % Ensure your image is named correctly
\\end{figure}

\\[
\\Huge \\frac{1}{2} < \\left\\lfloor \\text{mod}\\left(\\left\\lfloor \\frac{y}{17} \\right\\rfloor 2^{-17 \\left\\lfloor x \\right\\rfloor - \\text{mod}(\\left\\lfloor y \\right\\rfloor, 17)}, 2\\right) \\right\\rfloor
\\]

\\vspace{2cm}
\\textbf{K =} ${kValue}

\\end{document}
    `;

    // Display LaTeX code in a new window or an element
    const win = window.open('', 'LaTeXCode');
    win.document.body.innerHTML = `<pre>${latexContent}</pre>`;
}


function generateLaTeXOLDer() {
    const kValue = document.getElementById('valueK').textContent;
    const latexContent = `
\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\begin{document}

\\title{Visualized Formula Output}
\\author{Generated Output}
\\date{\\today}
\\maketitle

\\begin{figure}[h]
\\centering
\\includegraphics[width=0.8\\textwidth]{image.png} % Ensure your image is named correctly
\\end{figure}

\\[
\\frac{1}{2} < \\left\\lfloor \\text{mod}\\left(\\left\\lfloor \\frac{y}{17} \\right\\rfloor 2^{-17 \\left\\lfloor x \\right\\rfloor - \\text{mod}(\\left\\lfloor y \\right\\rfloor, 17)}, 2\\right) \\right\\rfloor
\\]

K value: \\
${kValue}

\\end{document}
    `;

    // Display LaTeX code in a new window or an element
    const win = window.open('', 'LaTeXCode');
    win.document.body.innerHTML = `<pre>${latexContent}</pre>`;
}


function generateLaTeXOLD() {
    const kValue = document.getElementById('valueK').textContent;
    const latexContent = `
\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\begin{document}

\\title{Visualized Formula Output}
\\author{Generated Output}
\\date{\\today}
\\maketitle

\\begin{figure}[h]
\\centering
\\includegraphics[width=0.8\\textwidth]{image.png} % Place your image in the same directory
\\end{figure}

\\[
\\frac{1}{2} < \\left\\lfloor \\mathrm{mod}\\left(\\left\\lfloor \\frac{y}{17} \\right\\rfloor 2^{-17 \\lfloor x \\rfloor - \\mathrm{mod}(\\lfloor y \\rfloor, 17)}, 2\\right) \\right\\lfloor
\\]

K value: \\
${kValue}

\\end{document}
    `;

    // Display LaTeX code in a new window or an element
    const win = window.open('', 'LaTeXCode');
    win.document.body.innerHTML = `<pre>${latexContent}</pre>`;
}
