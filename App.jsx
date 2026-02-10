import React, { useState } from 'react';
import { 
  Home, 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  Bed, 
  Calendar, 
  Layers,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    size: 2000,
    bedrooms: 3,
    age: 10,
    location: 5
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = results ? [
    { name: 'Linear Regression', price: results.predictions.linear_regression, color: '#6366f1' },
    { name: 'SVR', price: results.predictions.svr, color: '#ec4899' }
  ] : [];

  return (
    <div className="app-container">
      <header className="header">
        <h1><Sparkles size={40} style={{ verticalAlign: 'middle', marginRight: '10px' }} /> AI Housing Intelligence</h1>
        <p>Predicting future values with advanced machine learning models</p>
      </header>

      <div className="dashboard-grid">
        {/* Input Card */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers className="text-primary" /> Property Details
          </h2>
          <form onSubmit={handlePredict}>
            <div className="input-group">
              <label><Home size={16} /> Size (sqft)</label>
              <input 
                type="number" 
                name="size" 
                value={formData.size} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="input-group">
              <label><Bed size={16} /> Bedrooms</label>
              <input 
                type="number" 
                name="bedrooms" 
                value={formData.bedrooms} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="input-group">
              <label><Calendar size={16} /> House Age (Years)</label>
              <input 
                type="number" 
                name="age" 
                value={formData.age} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="input-group">
              <label><MapPin size={16} /> Location Rating (1-10)</label>
              <input 
                type="number" 
                name="location" 
                min="1" 
                max="10" 
                value={formData.location} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <button type="submit" className="btn-predict" disabled={loading}>
              {loading ? 'Analyzing...' : 'Predict Value'}
            </button>
          </form>
        </div>

        {/* Results Card */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp className="text-secondary" /> Analysis Results
          </h2>
          
          {!results ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <BarChart3 size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Enter property details and click Predict to see clinical analysis.</p>
            </div>
          ) : (
            <div className="results-section">
              <div className="prediction-item">
                <span className="prediction-label">Linear Regression</span>
                <span className="prediction-value">₹ {results.predictions.linear_regression} L</span>
              </div>
              <div className="prediction-item">
                <span className="prediction-label">SVR Model</span>
                <span className="prediction-value">₹ {results.predictions.svr} L</span>
              </div>
              <div className="prediction-item" style={{ background: 'rgba(99, 102, 241, 0.1)', borderColor: 'var(--primary)' }}>
                <span className="prediction-label" style={{ color: 'white' }}>Best Model: {results.best_model.name}</span>
                <span className="prediction-value" style={{ color: '#fbbf24' }}>{(results.best_model.accuracy * 100).toFixed(0)}% Acc</span>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'white' }}
                    />
                    <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
