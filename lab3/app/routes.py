from flask import render_template, request, jsonify, send_from_directory
from app import app
from app.utils import allowed_file, analyze_data
import os
from werkzeug.utils import secure_filename
import pandas as pd

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        return jsonify({
            'success': True,
            'message': 'File uploaded successfully',
            'filename': filename,
            'columns': list(pd.read_csv(filepath).columns) if filename.endswith('.csv') else 
                      list(pd.read_excel(filepath).columns)
        })
    
    return jsonify({'error': 'Allowed file types are csv, xlsx'}), 400

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    filename = data.get('filename')
    target = data.get('target')
    features = data.get('features', [])
    
    if not filename or not target:
        return jsonify({'error': 'Filename and target are required'}), 400
    
    result = analyze_data(filename, target, features)
    return jsonify(result)

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)