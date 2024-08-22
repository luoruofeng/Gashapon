# websockets/ws_handler.py

import random
import time
from flask_socketio import emit, join_room, leave_room
from app import socketio, config
from threading import Thread, Event
import request

# 存储每个客户端的抽奖状态
clients = {}

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")
    if request.sid in clients:
        clients[request.sid]['stop_event'].set()
        del clients[request.sid]

@socketio.on('start_lottery')
def handle_start_lottery(data):
    times = data.get('times')
    user_image = data.get('user_image')

    if not times or not user_image:
        emit('error', {'message': 'Invalid parameters'})
        return

    stop_event = Event()
    clients[request.sid] = {'stop_event': stop_event}

    # 启动抽奖线程
    thread = Thread(target=run_lottery, args=(request.sid, times, stop_event))
    thread.start()

def run_lottery(sid, times, stop_event):
    images = config.get('images', {})
    image_ids = list(images.keys())

    for i in range(times):
        if stop_event.is_set():
            break

        # 模拟转圈效果
        rounds = random.randint(3, 5)  # 转动圈数
        total_steps = rounds * len(image_ids) + random.randint(0, len(image_ids) - 1)
        
        for step in range(total_steps):
            if stop_event.is_set():
                break
            current_image_id = image_ids[step % len(image_ids)]
            emit('highlight', {'image_id': current_image_id}, room=sid)
            time.sleep(0.1)  # 控制高亮切换速度

        # 最终选中的图片
        selected_image_id = image_ids[total_steps % len(image_ids)]
        emit('selected', {'image_id': selected_image_id, 'round': i + 1}, room=sid)
        time.sleep(1)  # 等待一秒再开始下一次抽奖

    emit('lottery_finished', {}, room=sid)
