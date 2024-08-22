import os
import sys
import signal
import yaml
import threading
from flask import Flask, render_template, request, jsonify, url_for
from werkzeug.utils import secure_filename
from flask_socketio import emit, join_room, leave_room, SocketIO
from threading import Thread, Event
from service import some_logic  # 导入业务逻辑
import time

# 初始化Flask应用
app = Flask(__name__)

# 加载配置文件
def load_config(config_path):
    with open(config_path, 'r') as file:
        return yaml.safe_load(file)

# 初始化全局配置
config = {}

@app.route('/')
def index():
    return render_template('index.html', config=config)


@app.route('/dashboard')
def dashboard():
    # 模拟从后台传递数据
    data = {
        'total_users': 1500,
        'active_users_today': 350,
        'sales_today': 12345.67
    }
    return render_template('dashboard.html', **data)



@app.route('/card_store', methods=['GET'])
def card_store():
    # 示例图片路径dict
    images = {
        1: 'img/example1.png',
        2: 'img/example2.png',
        3: 'img/example3.png',
        4: 'img/example41.png',
        5: 'img/example5.png',
        6: 'img/example1.png',
        7: 'img/example2.png',
        8: 'img/example3.png',
        9: 'img/example41.png',
        10: 'img/example5.png'
    }
    return render_template('card_store.html', config=config, images=images)

@app.route('/submit_form', methods=['POST'])
def submit_form():
    draw_count = request.form.get('drawCount')
    upload_image = request.files.get('uploadImage')
    
    if upload_image:
        filename = secure_filename(upload_image.filename)
        upload_path = os.path.join('static', 'img', filename)
        upload_image.save(upload_path)
        # 这里可以根据需求处理上传的图片
    
    # 模拟修改按钮图片
    new_button_image = url_for('static', filename='img/button_bg.png')

    # 返回JSON响应
    return jsonify(success=True, new_button_image=new_button_image)


# 优雅退出信号处理
def graceful_exit(signal, frame):
    print("Gracefully shutting down...")
    # 在这里添加你的清理代码，比如终止线程等
    sys.exit(0)

signal.signal(signal.SIGINT, graceful_exit)



if __name__ == '__main__':
    # 解析命令行参数，传入配置文件路径
    config_path = 'config.yaml'
    if len(sys.argv) > 1:
        config_path = sys.argv[1]

    # 加载配置
    config = load_config(config_path)

    print("---------------------------------")
    print(config)
    print(config.get("task_interval",55))

    # 启动Flask应用
    app.run(debug=config.get('debug', False))
