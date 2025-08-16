



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// This component is a self-contained prediction form.
// It is styled using Bootstrap 5 classes and includes custom animations.

function PredictionForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "45",
    sex: "female",
    height: "165", // in cm
    weight: "68",  // in kg
    children: "1",
    smoker: "no",
    region: "southwest",
    chronicConditions: [],
  });
  const [bmi, setBmi] = useState({ value: "24.9", category: "Normal" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const diseaseWeights = {
    "Coronary artery disease": 10,
    "Stroke": 9.5,
    "Hypertension": 9,
    "Diabetes": 9,
    "High cholesterol": 8.5,
    "Congestive heart failure": 8,
    "Chronic kidney disease": 7.5,
    "COPD": 7.5,
    "Depression": 7,
    "Substance use disorders": 7,
    "Cancer": 7,
    "Cardiac arrhythmias": 6.5,
    "Osteoporosis": 6,
    "Arthritis": 6,
    "Asthma": 5.5,
    "Dementia": 5.5,
    "Autism spectrum disorder": 3,
    "Schizophrenia": 3,
    "Hepatitis": 3,
    "HIV infection": 2.5,
  };

  const conditionsList = Object.keys(diseaseWeights);

  useEffect(() => {
    const height = Number(formData.height);
    const weight = Number(formData.weight);
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      let category = "Normal";
      if (bmiValue < 18.5) category = "Underweight";
      else if (bmiValue >= 25 && bmiValue < 30) category = "Overweight";
      else if (bmiValue >= 30) category = "Obese";
      setBmi({ value: bmiValue, category });
    }
  }, [formData.height, formData.weight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConditionChange = (e) => {
    const { value, checked } = e.target;
    let updatedConditions = [...formData.chronicConditions];
    if (checked) {
      updatedConditions.push(value);
    } else {
      updatedConditions = updatedConditions.filter((item) => item !== value);
    }
    setFormData({ ...formData, chronicConditions: updatedConditions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const riskScore = formData.chronicConditions.reduce((total, condition) => {
      return total + (diseaseWeights[condition] || 0);
    }, 0);
    const payload = {
      age: Number(formData.age),
      sex: formData.sex,
      bmi: Number(bmi.value),
      children: Number(formData.children),
      smoker: formData.smoker,
      region: formData.region,
      risk_score: riskScore,
    };
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", payload);
      // FIX: Pass the original payload to the result page for simulations
      navigate("/result", { state: { name: formData.name, payload: payload, response: response.data } });
    } catch (error) {
      console.error("Error making prediction:", error);
      alert("There was an error making the prediction. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  const getBmiStyle = () => {
    switch (bmi.category) {
      case "Underweight": return { color: '#0dcaf0', badge: 'bg-info-subtle text-info-emphasis' };
      case "Normal": return { color: '#198754', badge: 'bg-success-subtle text-success-emphasis' };
      case "Overweight": return { color: '#ffc107', badge: 'bg-warning-subtle text-warning-emphasis' };
      case "Obese": return { color: '#dc3545', badge: 'bg-danger-subtle text-danger-emphasis' };
      default: return { color: '#6c757d', badge: 'bg-secondary-subtle text-secondary-emphasis' };
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const progress = (step / 3) * 100;

  return (
    <>
      <style>{`
        .form-step {
          transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
        }
        .form-step-exit {
          opacity: 0;
          transform: translateX(-20px);
        }
        .form-step-enter {
          opacity: 0;
          transform: translateX(20px);
        }
        .form-step-active {
          opacity: 1;
          transform: translateX(0);
        }
        .condition-checkbox {
          transition: all 0.2s ease;
        }
        .condition-checkbox:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
      <div className="container my-5">
        <div className="card p-4 p-md-5 shadow-lg border-0 rounded-4">
          <h1 className="h2 text-center mb-2">Healthcare Cost Prediction</h1>
          <p className="text-center text-muted mb-4">Enter your details to get an estimated annual medical cost.</p>
          
          {/* Progress Bar */}
          <div className="progress mb-5" style={{height: '10px'}}>
            <div className="progress-bar" role="progressbar" style={{width: `${progress}%`}} aria-valuenow={progress}></div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            <div className={`form-step ${step === 1 ? 'form-step-active' : 'd-none'}`}>
              <h4 className="mb-4">Step 1: Personal Information</h4>
              <div className="row g-4">
                <div className="col-md-6"><label htmlFor="name" className="form-label">Name</label><input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control form-control-lg"/></div>
                <div className="col-md-6"><label htmlFor="age" className="form-label">Age</label><input id="age" type="number" name="age" value={formData.age} onChange={handleChange} required className="form-control form-control-lg"/></div>
                <div className="col-md-6"><label htmlFor="sex" className="form-label">Gender</label><select id="sex" name="sex" value={formData.sex} onChange={handleChange} required className="form-select form-select-lg"><option value="">Select...</option><option value="male">Male</option><option value="female">Female</option></select></div>
                <div className="col-md-6"><label htmlFor="children" className="form-label">Number of Children</label><input id="children" type="number" name="children" value={formData.children} onChange={handleChange} required className="form-control form-control-lg"/></div>
              </div>
            </div>

            {/* Step 2: Health Metrics */}
            <div className={`form-step ${step === 2 ? 'form-step-active' : 'd-none'}`}>
              <h4 className="mb-4">Step 2: Health Metrics</h4>
              <div className="row g-4 align-items-center">
                <div className="col-md-4"><label htmlFor="height" className="form-label">Height (cm)</label><input id="height" type="number" name="height" value={formData.height} onChange={handleChange} required className="form-control form-control-lg"/></div>
                <div className="col-md-4"><label htmlFor="weight" className="form-label">Weight (kg)</label><input id="weight" type="number" name="weight" value={formData.weight} onChange={handleChange} required className="form-control form-control-lg"/></div>
                <div className="col-md-4 text-center mt-md-4"><h5 className="text-muted">Your BMI</h5><p className="display-6 fw-bold" style={{color: getBmiStyle().color}}>{bmi.value}</p><p className={`fw-semibold p-2 rounded ${getBmiStyle().badge}`}>{bmi.category}</p></div>
                <div className="col-md-6"><label htmlFor="smoker" className="form-label">Smoker</label><select id="smoker" name="smoker" value={formData.smoker} onChange={handleChange} required className="form-select form-select-lg"><option value="">Select...</option><option value="yes">Yes</option><option value="no">No</option></select></div>
                <div className="col-md-6"><label htmlFor="region" className="form-label">Region</label><select id="region" name="region" value={formData.region} onChange={handleChange} required className="form-select form-select-lg"><option value="">Select...</option><option value="northeast">Northeast</option><option value="northwest">Northwest</option><option value="southeast">Southeast</option><option value="southwest">Southwest</option></select></div>
              </div>
            </div>

            {/* Step 3: Chronic Conditions */}
            <div className={`form-step ${step === 3 ? 'form-step-active' : 'd-none'}`}>
              <h4 className="mb-4">Step 3: Chronic Conditions</h4>
              <div className="row g-3">
                {conditionsList.map((condition) => (<div key={condition} className="col-md-6"><div className="form-check p-3 border rounded-3 condition-checkbox"><input id={condition} type="checkbox" value={condition} checked={formData.chronicConditions.includes(condition)} onChange={handleConditionChange} className="form-check-input"/><label htmlFor={condition} className="form-check-label ms-2">{condition} <span className="text-muted small">(Risk: {diseaseWeights[condition]})</span></label></div></div>))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between pt-4 mt-4 border-top">
              {step > 1 && <button type="button" onClick={prevStep} className="btn btn-secondary btn-lg">Previous</button>}
              <div className="ms-auto">
                {step < 3 && <button type="button" onClick={nextStep} className="btn btn-primary btn-lg">Next</button>}
                {step === 3 && <button type="submit" disabled={loading} className="btn btn-success btn-lg">{loading ? "Predicting..." : "Predict Cost"}</button>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PredictionForm;


