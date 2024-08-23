// 定义全局变量
let animationActive = false; // 动画开关状态
let isRunning = false; // 是否运行中
let animationInterval;
let switchInterval;
let backgroundSwitchInterval;

function toggleCardNormalAnimation() {
    // 切换动画开关状态
    animationActive = !animationActive;

    // 获取所有的 card-item-effect 元素
    const cardItems = document.querySelectorAll('.card-item-effect');

    // 如果动画是激活的，开始动画
    if (animationActive) {
        // 修改所有 card-item-effect 元素的背景图片
        cardItems.forEach(item => {
            item.style.backgroundImage = "url('/static/img/red_border.png')";
        });

        // 开始执行交替显示和隐藏的效果
        startEffectOne(cardItems);

        // 随机间隔4到8秒进行效果切换
        switchInterval = setInterval(() => {
            const randomEffect = Math.random();
            if (randomEffect > 0.66) {
                startEffectOne(cardItems);
            } else if (randomEffect > 0.33) {
                startEffectTwo(cardItems);
            } else {
                startEffectThree(cardItems);
            }
        }, getRandomInterval(4000, 8000)); // 随机间隔4到8秒
    } else {
        // 如果动画是关闭的，停止动画并显示所有元素
        clearInterval(animationInterval);
        clearInterval(switchInterval);
        cardItems.forEach(item => {
            item.style.opacity = "1";
            item.style.transition = "none";
        });
    }
}

// 效果一：按基数和偶数位置交替显示和隐藏
function startEffectOne(cardItems) {
    clearInterval(animationInterval);
    let toggle = true;
    animationInterval = setInterval(() => {
        cardItems.forEach((item, index) => {
            if (toggle) {
                if (index % 2 === 0) {
                    item.style.opacity = "0"; // 隐藏偶数位置的图片
                } else {
                    item.style.opacity = "1"; // 显示基数位置的图片
                }
            } else {
                if (index % 2 === 0) {
                    item.style.opacity = "1"; // 显示偶数位置的图片
                } else {
                    item.style.opacity = "0"; // 隐藏基数位置的图片
                }
            }
            // 添加渐变动画
            item.style.transition = "opacity 0.4s";
        });
        toggle = !toggle;
    }, 400); // 每0.4秒交替执行
}

// 效果二：按顺序显示和隐藏
function startEffectTwo(cardItems) {
    clearInterval(animationInterval);
    let index = 0;
    animationInterval = setInterval(() => {
        cardItems.forEach((item, i) => {
            if (i === index) {
                item.style.opacity = "1"; // 显示当前索引位置的图片
            } else {
                item.style.opacity = "0"; // 隐藏其他图片
            }
            item.style.transition = "opacity 0.4s";
        });
        index = (index + 1) % cardItems.length; // 循环遍历索引
    }, 400); // 每0.4秒移动到下一个图片
}

// 效果三：按顺序倒序显示和隐藏
function startEffectThree(cardItems) {
    clearInterval(animationInterval);
    let index = cardItems.length - 1;
    animationInterval = setInterval(() => {
        cardItems.forEach((item, i) => {
            if (i === index) {
                item.style.opacity = "1"; // 显示当前索引位置的图片
            } else {
                item.style.opacity = "0"; // 隐藏其他图片
            }
            item.style.transition = "opacity 0.4s";
        });
        index = (index - 1 + cardItems.length) % cardItems.length; // 循环倒序遍历索引
    }, 400); // 每0.4秒移动到上一个图片
}

// 监控全局变量 isRunning 的变化
function monitorIsRunning() {
    clearInterval(backgroundSwitchInterval);
    backgroundSwitchInterval = setInterval(() => {
        const cardItems = document.querySelectorAll('.card-item-effect');
        if (isRunning) {
            // 将背景图片设置为 img/green_border_right.png
            cardItems.forEach(item => {
                item.style.backgroundImage = "url('/static/img/green_border_right.png')";
            });
        } else {
            // 随机切换背景图片
            const images = [
                "url('/static/img/red_border.png')",
                "url('/static/img/green_border.png')",
                "url('/static/img/iceblue_border.png')",
                "url('/static/img/blue_border.png')"
            ];
            cardItems.forEach(item => {
                const randomImage = images[Math.floor(Math.random() * images.length)];
                item.style.backgroundImage = randomImage;
            });
        }
    }, getRandomInterval(2000, 5000)); // 随机间隔2到5秒
}

// 获取2到5秒的随机间隔
function getRandomInterval(min, max) {
    return Math.random() * (max - min) + min;
}

// 在页面加载完成后自动执行动画
window.onload = () => {
    toggleCardNormalAnimation();
    monitorIsRunning();
};
