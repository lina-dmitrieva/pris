from flask import Flask
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Создаем папки, если их нет
import os
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['MODEL_FOLDER'], exist_ok=True)

from app import routes