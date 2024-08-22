// 创建WebSocket连接
let ws;

function connectWebSocket() {
    ws = new WebSocket('ws://' + window.location.host + '/lottery');

    ws.onopen = function() {
        console.log('WebSocket connection established');
    };

    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.action === 'highlight') {
            highlightImage(data.imageId);
        } else if (data.action === 'select') {
            selectImage(data.imageId);
        }
    };

    ws.onclose = function() {
        console.log('WebSocket connection closed');
        document.getElementById('start-button').src = '/static/img/start_button.png'; // 重新显示开始按钮
    };

    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
}

// 开始抽奖按钮的点击事件
document.getElementById('start-button').onclick = function() {
    const button = document.getElementById('start-button');
    if (button.src.includes('start_button.png')) {
        document.getElementById('form-modal').style.display = 'flex';
    } else {
        terminateLottery();
    }
};

// 表单提交事件，开始抽奖
document.getElementById('lottery-form').onsubmit = function(event) {
    event.preventDefault();
    const times = document.getElementById('times').value;
    const imageUpload = document.getElementById('image-upload').files[0];

    if (times && imageUpload) {
        document.getElementById('remaining-times').innerText = `剩余次数: ${times}`;

        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('user-image').src = e.target.result;
        };
        reader.readAsDataURL(imageUpload);

        document.getElementById('form-modal').style.display = 'none';
        startLottery(times);
    }
};

// 开始抽奖函数，初始化WebSocket
function startLottery(times) {
    connectWebSocket();

    ws.onopen = function() {
        ws.send(JSON.stringify({ action: 'start', times: times }));
        document.getElementById('start-button').src = '/static/img/stop_button.png'; // 更改按钮为终止按钮
    };
}

// 终止抽奖函数
function terminateLottery() {
    if (ws) {
        ws.close();
        ws = null;
        console.log('Lottery terminated by user.');
    }
}

// 高亮显示当前图片
function highlightImage(imageId) {
    const imageElements = document.getElementsByClassName('circle-image-container');
    for (let i = 0; i < imageElements.length; i++) {
        imageElements[i].classList.remove('highlight');
    }
    document.getElementById('image-' + imageId).classList.add('highlight');
}

// 选中图片并显示在页面下方
function selectImage(imageId) {
    const selectedImage = document.getElementById('image-' + imageId).getElementsByTagName('img')[0].cloneNode();
    selectedImage.classList.add('selected-image');
    document.getElementById('result-display').appendChild(selectedImage);
}

// 页面加载时设置默认WebSocket连接处理
window.onload = function() {
    connectWebSocket();
};
