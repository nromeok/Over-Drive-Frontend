import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../Context/ToastContext';

export default function ValuationResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [data, setData] = useState(null);
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const stateData = location.state?.valuation || location.state?.data;
    const stateVehicle = location.state?.vehicle;
    
    if (stateData) {
      setData(stateData);
      setVehicle(stateVehicle);
    } else {
      showToast("No valuation data found", "error");
      navigate('/history', { replace: true });
    }
  }, [location, navigate, showToast]);

  if (!data) {
    return <div style={{padding: '40px', color: 'white', textAlign: 'center'}}>Loading detailed report...</div>;
  }

  const score = data.final_score || data.condition_score || 70;
  const riskLevel = data.risk_level || "Medium";
  const summary = data.summary || "AI analysis completed.";
  
  const issues = data.detected_issues || [];
  const positives = data.positive_observations || [];
  const repairs = data.recommended_repairs || [];
  const aiResults = data.ai_results || [];

  const priceRange = data.estimated_price_range_kes || { low: 0, mid: 0, high: 0 };
  const recommendedPrice = data.recommended_price || priceRange.mid;

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto', color: 'white' }}>
      <button 
        onClick={() => navigate('/history')} 
        style={{ marginBottom: '20px', padding: '8px 16px', background: '#334155', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}
      >
        ← Back to History
      </button>

      <h1>AI Vehicle Valuation Report</h1>
      <p style={{ color: '#94a3b8' }}>{vehicle?.make} {vehicle?.model} ({vehicle?.year}) • {vehicle?.mileage?.toLocaleString()} km</p>

      {/* Overall Score */}
      <div style={{ background: '#1e2937', padding: '40px', borderRadius: '16px', textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '72px', fontWeight: 'bold', color: score >= 75 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444' }}>
          {score}<span style={{ fontSize: '28px' }}>/100</span>
        </div>
        <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '18px' }}>Overall Condition Score</p>
        
        <div style={{ marginTop: '16px' }}>
          <span style={{ 
            padding: '6px 20px', 
            borderRadius: '999px', 
            background: riskLevel === 'Low' ? '#166534' : riskLevel === 'Medium' ? '#854d0e' : '#991b1b',
            color: 'white',
            fontWeight: '600'
          }}>
            Risk Level: {riskLevel}
          </span>
        </div>
      </div>

      {/* Market Value */}
      <div style={{ background: '#1e2937', padding: '32px', borderRadius: '16px', marginBottom: '30px' }}>
        <h3>📊 Market Value Estimate [Coming Soon - Kenya 2026]</h3>
        <div style={{ display: 'flex', gap: '40px', marginTop: '20px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: '#94a3b8' }}>Recommended Selling Price</p>
            <h2 style={{ color: '#22c55e', margin: '8px 0' }}>KSh {recommendedPrice.toLocaleString()}</h2>
          </div>
          <div>
            <p style={{ color: '#94a3b8' }}>Price Range</p>
            <p style={{ fontSize: '18px' }}>
              KSh {priceRange.low?.toLocaleString()} - KSh {priceRange.high?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div style={{ background: '#1e2937', padding: '32px', borderRadius: '16px', marginBottom: '30px' }}>
        <h3> AI Summary & Reasoning</h3>
        <div style={{ lineHeight: '1.8', color: '#e2e8f0', whiteSpace: 'pre-line' }}>
          {summary}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Positive Observations */}
        {positives.length > 0 && (
          <div style={{ background: '#1e2937', padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ color: '#22c55e' }}> Positive Observations</h3>
            <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
              {positives.map((item, i) => (
                <li key={i} style={{ marginBottom: '12px', color: '#e2e8f0' }}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Issues */}
        {issues.length > 0 && (
          <div style={{ background: '#1e2937', padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ color: '#f59e0b' }}>⚠️ Detected Issues</h3>
            <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
              {issues.map((issue, i) => (
                <li key={i} style={{ marginBottom: '12px', color: '#e2e8f0' }}>
                  <strong>{issue.area || issue.category || "General"}:</strong> {issue.issue || issue.description || issue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommended Repairs */}
      {repairs.length > 0 && (
        <div style={{ background: '#1e2937', padding: '24px', borderRadius: '16px', marginTop: '20px' }}>
          <h3>🔧 Recommended Repairs</h3>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            {repairs.map((repair, i) => (
              <li key={i} style={{ marginBottom: '12px', color: '#e2e8f0' }}>{repair}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Raw AI Results (for debugging/ transparency) */}
      {aiResults.length > 0 && (
        <div style={{ marginTop: '30px', opacity: 0.8 }}>
          <details>
            <summary style={{ cursor: 'pointer', color: '#94a3b8' }}>View Raw AI Analysis per Image</summary>
            <pre style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', overflow: 'auto', fontSize: '14px' }}>
              {JSON.stringify(aiResults, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}