from setuptools import setup, find_packages

def parse_requirements(filename):
    """从requirements.txt中读取依赖项"""
    with open(filename, 'r') as file:
        # 返回列表，去掉每行的空白字符
        return [line.strip() for line in file if line.strip() and not line.startswith('#')]

# 读取requirements.txt中的依赖
requirements = parse_requirements('requirements.txt')

setup(
    name='gashapon',
    version='0.1.0',
    description='A Flask project with Bootstrap 5.3.3 integration',
    author='Your Name',
    author_email='your.email@example.com',
    url='https://github.com/yourusername/my_flask_project',
    packages=find_packages(),
    install_requires=requirements,  # 从requirements.txt中读取的依赖
    extras_require={
        'dev': [
            'flake8',  # 用于代码检查
            'pytest',  # 用于测试
        ],
    },
    entry_points={
        'console_scripts': [
            'runserver=my_flask_project.app:main',  # 启动Flask应用的命令
        ],
    },
    include_package_data=True,  # 包括非Python文件（如HTML、CSS、JS）
    package_data={
        '': ['templates/*.html', 'static/css/*.css', 'static/js/*.js', 'static/img/*', 'static/music/*'],
    },
    python_requires='>=3.6',
)
