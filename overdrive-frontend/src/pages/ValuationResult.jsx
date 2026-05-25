import './ValuationResult.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  TrendingUp,
  Car,
  Sparkles,
  Gauge,
  BrainCircuit,
  BadgeCheck
} from 'lucide-react';
import { useToast } from '../Context/ToastContext';

export default function ValuationResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [aiImageResults, setAiImageResults] = useState([]);
  const [comparables, setComparables] = useState([]);

  useEffect(() => {
    let rawData = location.state?.valuation ||
                  location.state?.data ||
                  location.state?.full_analysis ||
                  location.state;

    if (Array.isArray(rawData)) rawData = rawData[0];

    if (!rawData) {
      showToast("No valuation data found", "error");
      navigate('/history', { replace: true });
      return;
    }

    let processedData = { ...rawData };

    if (typeof processedData.ai_results === 'string') {
      try {
        const parsed = JSON.parse(processedData.ai_results);
        processedData = { ...processedData, ...parsed };
        setAiImageResults(parsed.image_results || []);
      } catch (e) {
        console.error("Failed to parse ai_results:", e);
      }
    } else if (Array.isArray(processedData.ai_results)) {
      setAiImageResults(processedData.ai_results);
    }

    if (processedData.market_valuation?.comparables) {
      setComparables(processedData.market_valuation.comparables);
    } else if (processedData.comparables) {
      setComparables(processedData.comparables);
    }

    setData(processedData);
  }, [location, navigate, showToast]);

  if (!data) {
    return <div className="valuation-page">Loading valuation report...</div>;
  }

  const vehicle = data.vehicle || {
    make: data.make || "Toyota",
    model: data.model || "Corolla",
    year: data.year || 2024,
    mileage: data.mileage || 0
  };

  const condition = {
    final_score: data.final_score || 0,
    risk_level: data.risk_level || "Unknown",
    condition_rating: data.condition_rating || "",
    summary: data.recommendation || data.summary || "No summary available."
  };

  const market = data.market_valuation || {};
  const recommendedPrice = data.market_estimate || market.recommended_price || market.final_estimate || 0;
  const marketAverage = market.market_average || 0;
  const comparableCount = market.comparable_vehicles || data.comparable_count || comparables.length;

  const getScoreClass = (score) => {
    if (score >= 85) return 'score-good';
    if (score >= 70) return 'score-medium';
    return 'score-bad';
  };

  const getRiskClass = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      default: return 'risk-high';
    }
  };

  // Split recommendation into paragraphs for better readability
  const recommendationParagraphs = condition.summary
    .split(/\n\n|\n/)
    .filter(p => p.trim().length > 0);

  return (
    <div className="valuation-page">
      <div className="valuation-container">

        <button className="back-btn" onClick={() => navigate('/history')}>
          <ArrowLeft size={18} />
          Back to History
        </button>

        {/* HERO */}
        <div className="hero-card">
          <div className="hero-content">
            <div>
              <div className="vehicle-title">
                {vehicle.make} {vehicle.model} {vehicle.year}
              </div>
              {vehicle.mileage > 0 && (
                <div className="vehicle-subtitle">
                  <Gauge size={18} /> {vehicle.mileage.toLocaleString()} km
                </div>
              )}
            </div>
            <Car size={80} style={{ opacity: 0.1 }} />
          </div>
        </div>

        {/* PRICE CARD */}
        <div className="price-card">
          <div className="price-label">Recommended Market Price</div>
          <div className="price-value">KSh {recommendedPrice.toLocaleString()}</div>

          <div className="price-stats">
            <div className="price-stat">
              <div className="price-stat-label">Market Average</div>
              <div className="price-stat-value">KSh {marketAverage.toLocaleString()}</div>
            </div>
            <div className="price-stat">
              <div className="price-stat-label">Comparables Analyzed</div>
              <div className="price-stat-value">{comparableCount}</div>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="section-title">
              <Sparkles className="icon-yellow" size={28} />
              <div>
                <div className="stat-label">Condition Score</div>
                <div className={`stat-value ${getScoreClass(condition.final_score)}`}>
                  {condition.final_score}
                </div>
                <div className="stat-sub">{condition.condition_rating || "Fair"}</div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="section-title">
              <ShieldCheck size={28} />
              <div>
                <div className="stat-label">Risk Level</div>
                <div className={`risk-badge ${getRiskClass(condition.risk_level)}`}>
                  {condition.risk_level}
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="section-title">
              <BrainCircuit className="icon-purple" size={28} />
              <div>
                <div className="stat-label">AI Confidence</div>
                <div className="stat-value">{data.confidence_score || 95}%</div>
                <div className="stat-sub">Based on Kenyan market data</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI ASSESSMENT - IMPROVED */}
        <div className="section-card">
          <div className="section-title">
            <BadgeCheck className="icon-green" size={28} />
            <h2>AI Vehicle Assessment</h2>
          </div>
          <div className="summary-box">
            {recommendationParagraphs.map((paragraph, index) => (
              <p key={index} className="recommendation-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* IMAGE ANALYSIS & COMPARABLES remain the same */}
        {aiImageResults.length > 0 && (
          <div className="section-card">
            <div className="section-title">
              <Sparkles className="icon-yellow" size={28} />
              <h2>Detailed Image Analysis</h2>
            </div>
            <div className="analysis-grid">
              {aiImageResults.map((result, index) => (
                <div key={index} className="analysis-item">
                  <h4>Image {index + 1} — Score: <span className={getScoreClass(result.condition_score)}>{result.condition_score}/100</span></h4>
                  
                  {result.positive_observations?.length > 0 && (
                    <>
                      <div className="section-title" style={{ margin: '20px 0 12px' }}>
                        <ShieldCheck size={20} className="icon-green" />
                        Positive Observations
                      </div>
                      <ul className="analysis-list">
                        {result.positive_observations.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </>
                  )}

                  {result.detected_issues?.length > 0 && (
                    <>
                      <div className="section-title" style={{ margin: '20px 0 12px' }}>
                        <AlertTriangle size={20} className="icon-red" />
                        Detected Issues
                      </div>
                      <ul className="analysis-list">
                        {result.detected_issues.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </>
                  )}

                  {result.recommended_repairs?.length > 0 && (
                    <>
                      <div className="section-title" style={{ margin: '20px 0 12px' }}>
                        <Wrench size={20} />
                        Recommended Repairs
                      </div>
                      <ul className="analysis-list">
                        {result.recommended_repairs.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {comparables.length > 0 && (
          <div className="section-card">
            <div className="section-title">
              <TrendingUp className="icon-green" size={28} />
              <h2>Market Comparables</h2>
            </div>
            <div className="comparables-grid">
              {comparables.slice(0, 6).map((comp, i) => (
                <div key={i} className="comparable-card">
                  <div className="comparable-title">
                    {comp.make} {comp.model} {comp.year}
                  </div>
                  <div className="comparable-price">
                    KSh {Number(comp.price || 0).toLocaleString()}
                  </div>
                  <div className="comparable-location">
                    {comp.location || 'Kenya'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}