document.addEventListener('DOMContentLoaded', function() {
    // File upload
    document.getElementById('uploadForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('dataFile');
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        
        const statusElement = document.getElementById('uploadStatus');
        statusElement.innerHTML = '<div class="alert alert-info">Uploading file...</div>';
        
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (!response.ok || data.error) {
                throw new Error(data.error || 'Upload failed');
            }
            
            statusElement.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
            
            // Populate selects
            const targetSelect = document.getElementById('targetColumn');
            const featureSelect = document.getElementById('featureColumns');
            
            targetSelect.innerHTML = '<option value="">Select target</option>';
            featureSelect.innerHTML = '';
            
            data.columns.forEach(col => {
                targetSelect.innerHTML += `<option value="${col}">${col}</option>`;
                featureSelect.innerHTML += `<option value="${col}">${col}</option>`;
            });
            
            // Show analysis section
            document.getElementById('analysisSection').style.display = 'block';
            document.getElementById('resultsSection').style.display = 'none';
            
        } catch (error) {
            statusElement.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
            console.error('Upload error:', error);
        }
    });
    
    // Data analysis
    document.getElementById('analysisForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('dataFile');
        const target = document.getElementById('targetColumn').value;
        const features = Array.from(document.getElementById('featureColumns').selectedOptions)
            .map(opt => opt.value);
        
        const statusElement = document.getElementById('analysisStatus');
        statusElement.innerHTML = '<div class="alert alert-info">Analyzing data...</div>';
        
        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: fileInput.files[0].name,
                    target: target,
                    features: features
                })
            });
            
            const data = await response.json();
            
            if (!response.ok || data.error) {
                throw new Error(data.error || 'Analysis failed');
            }
            
            statusElement.innerHTML = '<div class="alert alert-success">Analysis complete</div>';
            
            // Show results
            displayResults(data);
            document.getElementById('resultsSection').style.display = 'block';
            
        } catch (error) {
            statusElement.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
            console.error('Analysis error:', error);
        }
    });
    
    function displayResults(data) {
    // Отображаем статистику
    document.getElementById('descriptiveStats').innerHTML = 
        createTableFromStats(data.stats.descriptive);
    document.getElementById('missingValues').innerHTML = 
        createTableFromStats(data.stats.missing_values, false);
    
    // Отображаем графики
    const plotsContainer = document.getElementById('plotsContainer');
    plotsContainer.innerHTML = '';
    
    for (const [name, plotData] of Object.entries(data.plots)) {
        const title = name.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            
        plotsContainer.innerHTML += `
            <div class="col-md-6">
                <div class="plot-container">
                    <h5>${title}</h5>
                    <img src="data:image/png;base64,${plotData}" class="img-fluid">
                </div>
            </div>
        `;
    }
    
    // Отображаем результаты модели
    const modelResults = document.getElementById('modelResults');
    if (data.model_results) {
        const model = data.model_results;
        modelResults.innerHTML = `
            <h5>Model Performance</h5>
            <p>RMSE: ${model.rmse.toFixed(4)}</p>
            
            <h5 class="mt-4">Feature Importances</h5>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Importance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(model.feature_importances)
                            .sort((a, b) => b[1] - a[1])
                            .map(([feature, importance]) => `
                                <tr>
                                    <td>${feature}</td>
                                    <td>${importance.toFixed(4)}</td>
                                </tr>
                            `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        modelResults.innerHTML = '<p>No model results available.</p>';
    }
}

    
    function createTableFromStats(stats, transpose=true) {
        if (transpose) {
            const cols = Object.keys(stats);
            const metrics = Object.keys(stats[cols[0]]);
            
            return `
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            ${cols.map(col => `<th>${col}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${metrics.map(metric => `
                            <tr>
                                <td><strong>${metric}</strong></td>
                                ${cols.map(col => `
                                    <td>${typeof stats[col][metric] === 'number' ? 
                                        stats[col][metric].toFixed(2) : stats[col][metric]}
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            return `
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Column</th>
                            <th>Missing Values</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(stats).map(([col, count]) => `
                            <tr>
                                <td>${col}</td>
                                <td>${count}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    }
});