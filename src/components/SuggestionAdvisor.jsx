import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  DollarSign,
  MapPin,
  Briefcase,
  Package,
  PieChart,
  Lightbulb,
  TrendingUp,
  RefreshCw,
  Zap,
  BarChart,
  History,
  Settings,
} from 'lucide-react';



const ProductAdvisor = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [formData, setFormData] = useState({
    budget: '',
    monthlyIncome: '',
    productType: '',
    productName: '',
    location: '',
    additionalDetails: '',
    preferredBrands: []
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.budget) errors.budget = 'Budget is required';
    if (!formData.productType) errors.productType = 'Product type is required';
    if (!formData.location) errors.location = 'Location is required';
    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (validationErrors) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://samadhan-backend.onrender.com/api/advice/product-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      
      if (!data) {
        throw new Error('No data received from server');
      }
  
      setAdvice(data); // Just set the data directly, don't try to unnest it
      setStep(3);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to get product advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const StyledInput = ({ icon: Icon, ...props }) => (
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" size={20} />
      <input
        {...props}
        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-800 placeholder-gray-400"
      />
    </div>
  );

  const StyledSelect = ({ icon: Icon, ...props }) => (
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" size={20} />
      <select
        {...props}
        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-800 appearance-none"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          animate={{ rotate: props.value ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.div>
      </div>
    </div>
  );

  const PrimaryButton = ({ children, ...props }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
      {...props}
    >
      {children}
    </motion.button>
  );

  const SecondaryButton = ({ children, ...props }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
      {...props}
    >
      {children}
    </motion.button>
  );

  const Card = ({ children, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      {children}
    </motion.div>
  );

  const ProgressStep = ({ icon: Icon, label, active, completed }) => (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{ scale: active ? 1.1 : 1 }}
        className={`relative rounded-full h-14 w-14 flex items-center justify-center ${
          completed || active ? 'bg-blue-600' : 'bg-gray-200'
        } transition-colors duration-300`}
      >
        <Icon className="text-white" size={24} />
        {completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 bg-green-500 rounded-full p-1"
          >
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </motion.div>
        )}
      </motion.div>
      <span className={`mt-2 text-sm font-medium ${active ? 'text-blue-600' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );

  const renderStep1 = () => (
    <motion.div {...pageTransition} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Budget (₹)</label>
          <StyledInput
            icon={DollarSign}
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            placeholder="Enter your budget"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Monthly Income (₹)</label>
          <StyledInput
            icon={Briefcase}
            type="number"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleInputChange}
            placeholder="Enter your monthly income"
          />
        </div>
      </div>
      <PrimaryButton onClick={() => setStep(2)}>Continue</PrimaryButton>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div {...pageTransition} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Product Type</label>
          <StyledSelect
            icon={ShoppingBag}
            name="productType"
            value={formData.productType}
            onChange={handleInputChange}
          >
            <option value="">Select product type</option>
            <option value="smartphone">Smartphone</option>
            <option value="tablet">Tablet</option>
            <option value="laptop">Laptop</option>
            <option value="car">Car</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="tv">Television</option>
            <option value="refrigerator">Refrigerator</option>
          </StyledSelect>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <StyledInput
            icon={MapPin}
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter your location"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Additional Details</label>
        <textarea
          name="additionalDetails"
          value={formData.additionalDetails}
          onChange={handleInputChange}
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-800 placeholder-gray-400 h-32 resize-none"
          placeholder="Any specific requirements or preferences?"
        />
      </div>

      <div className="flex gap-4">
        <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
        <PrimaryButton onClick={handleSubmit}>Get Recommendations</PrimaryButton>
      </div>
    </motion.div>
  );

  const renderAdvice = () => (
    <motion.div {...pageTransition} className="space-y-8">
      {advice && advice.advice && advice.advice.productRecommendations && advice.advice.productRecommendations.primaryChoice && (
        <>
          <Card>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Package className="mr-2 text-blue-500" />
              Recommended Products
            </h3>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-blue-800 mb-4">Primary Choice</h4>
              <div>
                <p className="text-xl font-medium">{advice.advice.productRecommendations.primaryChoice.name}</p>
                <p className="text-blue-600 font-semibold text-lg mt-1">
                  ₹{advice.advice.productRecommendations.primaryChoice.price}
                </p>
                {advice.advice.productRecommendations.primaryChoice.specifications && (
                  <div className="mt-4">
                    <p className="font-medium text-blue-800 mb-2">Specifications:</p>
                    <ul className="space-y-2">
                      {advice.advice.productRecommendations.primaryChoice.specifications.map((spec, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
{advice.advice.productRecommendations.primaryChoice.reasonsToBuy && (
                <div className="mt-4">
                  <p className="font-medium text-blue-800 mb-2">Why Buy:</p>
                  <ul className="space-y-2">
                    {advice.advice.productRecommendations.primaryChoice.reasonsToBuy.map((reason, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {advice.advice.productRecommendations.alternatives && advice.advice.productRecommendations.alternatives.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">Alternatives</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advice.advice.productRecommendations.alternatives.map((alt, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <p className="font-medium">{alt.name}</p>
                    <p className="text-blue-600 mt-1">₹{alt.price}</p>
                    {alt.keyDifferences && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Key Differences:</p>
                        <ul className="mt-1 space-y-1">
                          {alt.keyDifferences.map((diff, idx) => (
                            <li key={idx} className="text-sm text-gray-700">{diff}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
)}
        </Card>

        {advice.advice.financialAnalysis && (
          <Card>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <PieChart className="mr-2 text-green-500" />
              Financial Analysis
            </h3>
            
            {advice.advice.financialAnalysis.affordabilityScore && advice.advice.financialAnalysis.monthlyImpact && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <p className="font-medium text-green-800">Affordability Score</p>
                  <div className="flex items-baseline mt-2">
                    <p className="text-3xl font-bold text-green-600">
                      {advice.advice.financialAnalysis.affordabilityScore}
                    </p>
                    <p className="text-green-600 ml-1">/10</p>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <p className="font-medium text-green-800">Monthly Impact</p>
                  <p className="text-2xl font-semibold text-green-600 mt-2">
                    {(advice.advice.financialAnalysis.monthlyImpact.percentage * 100).toFixed(1)}%
                  </p>
                  <p className="text-green-600 mt-1">
                    Sustainable for {advice.advice.financialAnalysis.monthlyImpact.sustainabilityPeriod}
                  </p>
                </div>
              </div>
            )}

            {advice.advice.financialAnalysis.savingsSuggestions && advice.advice.financialAnalysis.savingsSuggestions.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-4">Savings Suggestions</h4>
                <ul className="space-y-3">
                  {advice.advice.financialAnalysis.savingsSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {advice.advice.financialAnalysis.budgetingTips && advice.advice.financialAnalysis.budgetingTips.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">Budgeting Tips</h4>
                <ul className="space-y-3">
                  {advice.advice.financialAnalysis.budgetingTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
)}

        {(advice.advice.marketInsights || advice.advice.financialAdvice) && (
          <Card>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="mr-2 text-purple-500" />
              Market & Financial Insights
            </h3>
            
            {advice.advice.marketInsights && advice.advice.marketInsights.priceHistory && (
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <h4 className="font-medium text-purple-800 mb-2">Price Trends</h4>
                <p className="text-lg">{advice.advice.marketInsights.priceHistory.trend}</p>
                <p className="text-purple-600 mt-2">
                  Best time to buy: {advice.advice.marketInsights.priceHistory.bestTimeToBuy}
                </p>
              </div>
            )}

            {advice.advice.marketInsights && advice.advice.marketInsights.futureConsiderations && advice.advice.marketInsights.futureConsiderations.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-4">Future Considerations</h4>
                <ul className="space-y-3">
                  {advice.advice.marketInsights.futureConsiderations.map((consideration, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2" />
                      <span>{consideration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {advice.advice.financialAdvice && (
              <>
                {advice.advice.financialAdvice.immediateSteps && advice.advice.financialAdvice.immediateSteps.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-4">Immediate Steps</h4>
                    <ul className="space-y-3">
                      {advice.advice.financialAdvice.immediateSteps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {advice.advice.financialAdvice.risksToConsider && advice.advice.financialAdvice.risksToConsider.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-6">
                    <h4 className="font-semibold text-red-800 mb-4">Risks to Consider</h4>
                    <ul className="space-y-3">
                      {advice.advice.financialAdvice.risksToConsider.map((risk, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-2" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </Card>
        )}
      </>
    )}

          <div className="flex gap-4">
            <SecondaryButton onClick={() => {
              setStep(1);
              setFormData({
                budget: '',
                monthlyIncome: '',
                productType: '',
                productName: '',
                location: '',
                additionalDetails: '',
                preferredBrands: []
              });
              setAdvice(null);
            }}>
              Start New Search
            </SecondaryButton>
          </div>
            </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"   
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <motion.div layout className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Product Advisor</h2>
            <p className="text-gray-600">Get personalized recommendations based on your needs</p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
            <div className="relative z-10 flex justify-between w-full">
              <ProgressStep
                icon={DollarSign}
                label="Financial Details"
                active={step === 1}
                completed={step > 1}
              />
              <ProgressStep
                icon={Package}
                label="Product Details"
                active={step === 2}
                completed={step > 2}
              />
              <ProgressStep
                icon={Lightbulb}
                label="Recommendations"
                active={step === 3}
                completed={step > 3}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  <RefreshCw className="text-blue-600" size={40} />
                </motion.div>
                <p className="mt-4 text-gray-600">Analyzing your requirements...</p>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderAdvice()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
      );
};



export default ProductAdvisor;