import random

def select_random_image():
    images = get_available_images()
    return random.choice(list(images.keys()))

def get_available_images():
    # 模拟从配置或数据库中获取可用图片
    return {
        '1': '/static/img/example1.png',
        '2': '/static/img/example2.png',
        '3': '/static/img/example3.png',
    }
