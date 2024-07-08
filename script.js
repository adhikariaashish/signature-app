document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    const clearButton = document.getElementById('clear');
    const downloadButton = document.getElementById('download');
    const downloadWhiteBgButton = document.getElementById('download-white-bg');
    const errorMessage = document.getElementById('error-message');
    const colorPicker = document.getElementById('colorPicker');
    const penSize = document.getElementById('penSize');
    let drawing = false;


    function startDrawing(e) {
        drawing = true;
        draw(e);
    }

    function endDrawing() {
        drawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!drawing) return;
        ctx.lineWidth = penSize.value;
        ctx.lineCap = 'round';
        ctx.strokeStyle = colorPicker.value;

        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    function isCanvasEmpty() {
        const empty = !ctx.getImageData(0, 0, canvas.width, canvas.height).data.some(channel => channel !== 0);
        return empty;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function clearError() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseout', endDrawing);

    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        clearError();
    });


    downloadButton.addEventListener('click', () => {
        clearError();
        if (isCanvasEmpty()) {
            showError('Please draw your signature');
            return;
        }
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'signature.png';
        link.click();
    });

    downloadWhiteBgButton.addEventListener('click', () => {
        clearError();
        if (isCanvasEmpty()) {
            showError('Please draw your signature');
            return;
        }

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

       
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        
        tempCtx.drawImage(canvas, 0, 0);

       
        const dataURL = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'signature.jpg';
        link.click();
    });
});

