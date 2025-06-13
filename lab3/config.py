import os
from pathlib import Path

BASE_DIR = Path(__file__).parent

class Config:
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    MODEL_FOLDER = os.path.join(BASE_DIR, 'models')
    STATIC_FOLDER = os.path.join(BASE_DIR, 'app', 'static')
    TEMPLATES_FOLDER = os.path.join(BASE_DIR, 'app', 'templates')
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB limit
    ALLOWED_EXTENSIONS = {'csv', 'xlsx'}