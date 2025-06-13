import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

import matplotlib
matplotlib.use('Agg')  # <- Добавь эту строку перед импортом pyplot

import matplotlib.pyplot as plt
import io
import base64
import os
from config import Config
from joblib import dump


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def read_data_file(filepath, filename):
    if filename.endswith('.csv'):
        return pd.read_csv(filepath)
    elif filename.endswith('.xlsx'):
        return pd.read_excel(filepath)
    return None

def analyze_data(filename, target_column, features):
    filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
    df = read_data_file(filepath, filename)

    if df is None:
        return {'error': 'Failed to read file'}

    # Проверка наличия колонок
    if target_column not in df.columns:
        return {'error': f'Target column {target_column} not found'}

    for feature in features:
        if feature not in df.columns:
            return {'error': f'Feature column {feature} not found'}

    # Визуализация и анализ данных
    result = {
        'plots': generate_plots(df, target_column, features),
        'stats': generate_stats(df),
        'model_results': None
    }

    # Обучение модели (если возможно)
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if features and target_column in numeric_cols:
        result['model_results'] = train_model(df, target_column, features, filename)

    return result

def generate_plots(df, target_column, features):
    plots = {}

    # Гистограмма целевой переменной
    plt.figure(figsize=(10, 6))
    df[target_column].hist()
    plt.title(f'Distribution of {target_column}')
    plots['target_dist'] = save_plot_to_base64()

    # Матрица корреляций
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) > 1:
        plt.figure(figsize=(12, 8))
        corr = df[numeric_cols].corr()
        plt.matshow(corr, fignum=1)
        plt.xticks(range(len(corr.columns)), corr.columns, rotation=90)
        plt.yticks(range(len(corr.columns)), corr.columns)
        plt.colorbar()
        plots['correlation_matrix'] = save_plot_to_base64()

    return plots

def save_plot_to_base64():
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()
    return base64.b64encode(img.getvalue()).decode('utf8')

def generate_stats(df):
    return {
        'descriptive': df.describe().to_dict(),
        'missing_values': df.isnull().sum().to_dict()
    }

def train_model(df, target_column, features, filename):
    X = df[features].copy()
    y = df[target_column]

    # Удаляем строки с пропущенными значениями
    combined = pd.concat([X, y], axis=1).dropna()
    X = combined[features]
    y = combined[target_column]

    # Обработка категориальных признаков
    X = pd.get_dummies(X)

    # Разделение данных
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Обучение модели
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Предсказания
    y_pred = model.predict(X_test)

    # Оценка модели
    mse = mean_squared_error(y_test, y_pred)

    # Сохраняем модель
    model_path = os.path.join(Config.MODEL_FOLDER, f'model_{filename.split(".")[0]}.joblib')
    dump(model, model_path)

    return {
        'mse': mse,
        'rmse': np.sqrt(mse),
        'feature_importances': pd.Series(model.feature_importances_, index=X.columns).to_dict()
    }
