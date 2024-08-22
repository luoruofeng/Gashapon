document.getElementById('start-button').onclick = function () {
    document.getElementById('form-modal').style.display = 'flex';
};

document.getElementById('lottery-form').onsubmit = function (event) {
    event.preventDefault();
    const times = document.getElementById('times').value;
    const imageUpload = document.getElementById('image-upload').files[0];

    if (times && imageUpload) {
        document.getElementById('remaining-times').innerText = `剩余次数: ${times}`;

        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('user-image').src = e.target.result;
        };
        reader.readAsDataURL(imageUpload);

        document.getElementById('form-modal').style.display = 'none';
        startLottery(times);
    }
};

function startLottery(times) {
    const ws = new WebSocket('ws://' + window.location.host + '/lottery');
    ws.onopen = function () {
        ws.send(JSON.stringify({ action: 'start', times: times }));
    };

    ws.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.action === 'highlight') {
            highlightImage(data.imageId);
        } else if (data.action === 'select') {
            selectImage(data.imageId);
        }
    };

    ws.onclose = function () {
        console.log('WebSocket connection closed');
    };

    document.getElementById('start-button').onclick = function () {
        ws.close();
    };
}

function highlightImage(imageId) {
    const imageElements = document.getElementsByClassName('circle-image-container');
    for (let i = 0; i < imageElements.length; i++) {
        imageElements[i].classList.remove('highlight');
    }
    document.getElementById('image-' + imageId).classList.add('highlight');
}

function selectImage(imageId) {
    const selectedImage = document.getElementById('image-' + imageId).getElementsByTagName('img')[0].cloneNode();
    document.getElementById('result-display').appendChild(selectedImage);
}
