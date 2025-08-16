








import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/predict";

const ResultPage = () => {
    const location = useLocation();
    const { name, payload, response } = location.state || {}; 

    const [smokingSimulationResult, setSmokingSimulationResult] = useState(null);
    const [smokingSimulationLoading, setSmokingSimulationLoading] = useState(false);
    const [bmiSimulationResult, setBmiSimulationResult] = useState(null);
    const [bmiSimulationLoading, setBmiSimulationLoading] = useState(false);

    if (!response || !payload) {
        return (
            <div className="container text-center my-5">
                <h2 className="text-danger">No Prediction Data Found</h2>
                <p className="lead">Please go back and submit the form to see a prediction.</p>
                <Link to="/predict" className="btn btn-primary mt-3">Back to Form</Link>
            </div>
        );
    }

    const { predicted_cost, top_factors } = response;
    const chartData = top_factors;

    const handleSmokingSimulation = async () => {
        setSmokingSimulationLoading(true);
        const simulationPayload = { ...payload, smoker: 'no' };
        
        try {
            const res = await axios.post(API_URL, simulationPayload);
            setSmokingSimulationResult(res.data);
        } catch (error) {
            console.error("Error running smoking simulation:", error);
            alert("Could not run the simulation at this time.");
        } finally {
            setSmokingSimulationLoading(false);
        }
    };

    const handleBmiSimulation = async () => {
        setBmiSimulationLoading(true);
        // Simulate reaching a healthy BMI of 24.9
        const simulationPayload = { ...payload, bmi: 24.9 };
        
        try {
            const res = await axios.post(API_URL, simulationPayload);
            setBmiSimulationResult(res.data);
        } catch (error) {
            console.error("Error running BMI simulation:", error);
            alert("Could not run the simulation at this time.");
        } finally {
            setBmiSimulationLoading(false);
        }
    };

    const formatCurrency = (value) => {
        if (typeof value !== 'number') return '₹0.00';
        return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
    };

    return (
        <div className="container my-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold">Prediction Results</h1>
                <p className="lead text-muted">Here is the AI-powered cost estimate for <span className="fw-bold text-primary">{name || 'your profile'}</span>.</p>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card text-center p-4 shadow-lg border-0 rounded-4 mb-5">
                        <div className="card-body">
                            <h5 className="card-title text-muted">Predicted Annual Medical Cost</h5>
                            <p className="display-3 fw-bolder text-success">{formatCurrency(predicted_cost)}</p>
                            <p className="card-text">This is an estimate based on your provided health and demographic data.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card p-4 shadow-lg border-0 rounded-4">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Key Prediction Factors</h3>
                            <p className="text-center text-muted mb-4">These are the top factors that influenced your prediction. Red bars increase the cost, and blue bars decrease it.</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="feature" tick={{ fontSize: 14 }} />
                                    <Tooltip cursor={{ fill: 'rgba(240, 240, 240, 0.5)' }} formatter={(value) => `Impact on Log Scale: ${value.toFixed(2)}`}/>
                                    <Legend payload={[{ value: 'Increases Cost', type: 'square', color: '#dc3545' }, { value: 'Decreases Cost', type: 'square', color: '#0d6efd' }]}/>
                                    <Bar dataKey="value" name="Impact">
                                        {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.value > 0 ? '#dc3545' : '#0d6efd'} />))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* What-If Simulations Section */}
            <div className="row justify-content-center mt-5 gx-lg-5">
                {/* Smoking Simulation */}
                {payload.smoker === 'yes' && (
                    <div className="col-lg-6 mb-4 mb-lg-0">
                        <div className="card p-4 shadow-lg border-0 rounded-4 h-100">
                            <div className="card-body text-center">
                                <h3 className="card-title mb-4">"What-If" Smoking Simulation</h3>
                                <p className="text-muted mb-4">See the potential savings if you were a non-smoker.</p>
                                <button onClick={handleSmokingSimulation} className="btn btn-success btn-lg" disabled={smokingSimulationLoading}>
                                    {smokingSimulationLoading ? 'Simulating...' : 'Simulate Quitting Smoking'}
                                </button>
                                
                                {smokingSimulationResult && (
                                    <div className="mt-4 pt-4 border-top">
                                        <h4 className="mb-3">Simulated Result</h4>
                                        <div className="d-flex justify-content-around align-items-center">
                                            <div><p className="text-muted mb-1">Original</p><p className="h4 fw-bold text-danger">{formatCurrency(predicted_cost)}</p></div>
                                            <div className="h1 text-muted">→</div>
                                            <div><p className="text-muted mb-1">New</p><p className="h4 fw-bold text-success">{formatCurrency(smokingSimulationResult.predicted_cost)}</p></div>
                                        </div>
                                        <div className="mt-3 alert alert-success">
                                            Potential Savings: <strong>{formatCurrency(predicted_cost - smokingSimulationResult.predicted_cost)}</strong>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* BMI Simulation */}
                {payload.bmi >= 25 && (
                     <div className="col-lg-6">
                        <div className="card p-4 shadow-lg border-0 rounded-4 h-100">
                            <div className="card-body text-center">
                                <h3 className="card-title mb-4">"What-If" BMI Simulation</h3>
                                <p className="text-muted mb-4">See the potential savings if you reached a healthy BMI of 24.9.</p>
                                <button onClick={handleBmiSimulation} className="btn btn-info btn-lg text-white" disabled={bmiSimulationLoading}>
                                    {bmiSimulationLoading ? 'Simulating...' : 'Simulate Healthy BMI'}
                                </button>
                                
                                {bmiSimulationResult && (
                                    <div className="mt-4 pt-4 border-top">
                                        <h4 className="mb-3">Simulated Result</h4>
                                        <div className="d-flex justify-content-around align-items-center">
                                            <div><p className="text-muted mb-1">Original</p><p className="h4 fw-bold text-danger">{formatCurrency(predicted_cost)}</p></div>
                                            <div className="h1 text-muted">→</div>
                                            <div><p className="text-muted mb-1">New</p><p className="h4 fw-bold text-success">{formatCurrency(bmiSimulationResult.predicted_cost)}</p></div>
                                        </div>
                                        <div className="mt-3 alert alert-success">
                                            Potential Savings: <strong>{formatCurrency(predicted_cost - bmiSimulationResult.predicted_cost)}</strong>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="text-center mt-5">
                <Link to="/predict" className="btn btn-secondary btn-lg">Make Another Prediction</Link>
            </div>
        </div>
    );
};

export default ResultPage;

