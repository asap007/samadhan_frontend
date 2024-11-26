import React, { useState } from 'react';
import {
  CreditCard, 
  Wallet, 
  BarChart, 
  Zap,
  ChevronDown,
  Check,
  RefreshCw,
  History,    // Add these two
  Settings,   // new imports
} from 'lucide-react';
import axios from 'axios'; 

const FinancialAdvicePage = () => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [activeSection, setActiveSection] = useState('purchase');
  const [formData, setFormData] = useState({
    purchaseType: 'electronics',
    totalBudget: '',
    location: '',
    context: {
      vehicleDetails: {
        type: '',
        brand: '',
        preferredSegment: ''
      },
      realEstateDetails: {
        type: '',
        propertyType: '',
        preferredLocalities: []
      },
      productDetails: {
        category: '',
        specificRequirements: []
      }
    },
    paymentPreferences: {
      creditCards: [],
      debitCards: [],
      upiOptions: [],
      netBanking: [],
      emiOptions: ''
    },
    financialPreferences: {
      creditScore: '',
      monthlyIncome: ''
    },
    history: [],
    settings: {
      notifications: true,
      darkMode: false,
      language: 'en'
    }
  });

  const paymentOptions = {
    creditCards: [
      { id: 'hdfc_credit', name: 'HDFC', logo: '💳' },
      { id: 'sbi_credit', name: 'SBI', logo: '🏦' },
      { id: 'icici_credit', name: 'ICICI', logo: '💰' },
      { id: 'axis_credit', name: 'Axis', logo: '🌐' },
      { id: 'kotak_credit', name: 'Kotak', logo: '🔐' }
    ],
    debitCards: [
      { id: 'hdfc_debit', name: 'HDFC', logo: '💳' },
      { id: 'sbi_debit', name: 'SBI', logo: '🏦' },
      { id: 'icici_debit', name: 'ICICI', logo: '💰' },
      { id: 'axis_debit', name: 'Axis', logo: '🌐' },
      { id: 'pnb_debit', name: 'PNB', logo: '🔐' }
    ],
    upiOptions: [
      { id: 'gpay', name: 'GPay', logo: '📱' },
      { id: 'phonepe', name: 'PhonePe', logo: '📲' },
      { id: 'paytm', name: 'Paytm', logo: '💸' },
      { id: 'bhim', name: 'BHIM', logo: '🔄' },
      { id: 'amazonpay', name: 'Amazon Pay', logo: '🛒' }
    ],
    netBanking: [
      { id: 'hdfc_net', name: 'HDFC', logo: '🌐' },
      { id: 'sbi_net', name: 'SBI', logo: '🏦' },
      { id: 'icici_net', name: 'ICICI', logo: '💻' },
      { id: 'axis_net', name: 'Axis', logo: '📡' },
      { id: 'kotak_net', name: 'Kotak', logo: '🔒' }
    ]
  };


  
  const handlePaymentOptionToggle = (category, optionId) => {
    setFormData(prev => ({
      ...prev,
      paymentPreferences: {
        ...prev.paymentPreferences,
        [category]: prev.paymentPreferences[category].includes(optionId)
          ? prev.paymentPreferences[category].filter(id => id !== optionId)
          : [...prev.paymentPreferences[category], optionId]
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');
    
    if (nameParts.length > 1) {
      setFormData(prev => ({
        ...prev,
        [nameParts[0]]: {
          ...prev[nameParts[0]],
          [nameParts[1]]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getAdvice = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://samadhan-backend.onrender.com/api/advice/financial-strategy', formData);
      setAdvice(response.data);
    } catch (error) {
      console.error('Error fetching advice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getAdvice();
  };

  const PaymentOptionsSection = ({ category, options }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
        <CreditCard className="mr-2 text-emerald-500" size={20} />
        {category.replace(/([A-Z])/g, ' $1').trim()}
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {options.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => handlePaymentOptionToggle(category, option.id)}
            className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group shadow-sm ${
              formData.paymentPreferences[category].includes(option.id)
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <span className="text-4xl mb-2 opacity-70 group-hover:opacity-100">{option.logo}</span>
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800">
              {option.name}
            </span>
            {formData.paymentPreferences[category].includes(option.id) && (
              <Check className="absolute top-2 right-2 text-emerald-500" size={18} />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const SectionHeader = ({ 
    title, 
    icon: Icon, 
    section 
  }) => (
    <div 
      onClick={() => setActiveSection(section)}
      className={`cursor-pointer flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 ${
        activeSection === section 
          ? 'bg-yellow-50 text-emerald-700' 
          : 'bg-white text-gray-800 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center">
        <Icon className="mr-3" size={24} />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <ChevronDown 
        className={`transform transition-transform ${
          activeSection === section ? 'rotate-180 text-emerald-500' : 'text-gray-500'
        }`} 
        size={24} 
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 flex items-center">
          <Zap className="h-10 w-10 text-yellow-300 mr-4" />
          <h1 className="text-3xl font-bold text-white">
            Financial Advisory Platform
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-0">
          {/* Sidebar Navigation */}
          <div className="bg-gray-50 border-r border-gray-200 p-4 space-y-4">
          <SectionHeader 
            title="Purchase Details" 
            icon={BarChart} 
            section="purchase"
          />
          <SectionHeader 
            title="Payment Preferences" 
            icon={CreditCard} 
            section="payment"
          />
          <SectionHeader 
            title="Financial Info" 
            icon={Wallet} 
            section="financial"
          />
          <SectionHeader 
            title="History" 
            icon={History} 
            section="history"
          />
          <SectionHeader 
            title="Settings" 
            icon={Settings} 
            section="settings"
          />
        </div>

          {/* Main Content */}
          <div className="md:col-span-2 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Purchase Details */}
              {activeSection === 'purchase' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Type
                    </label>
                    <select
                      name="purchaseType"
                      value={formData.purchaseType}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="electronics">Electronics</option>
                      <option value="vehicle">Vehicle</option>
                      <option value="realestate">Real Estate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Budget (₹)
                    </label>
                    <input
                      type="number"
                      name="totalBudget"
                      value={formData.totalBudget}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter your budget"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter location"
                    />
                  </div>
                </div>
              )}

              {/* History Section */}
                {activeSection === 'history' && (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Electronics Purchase</p>
                            <p className="text-sm text-gray-500">2024-03-15</p>
                          </div>
                          <span className="text-emerald-600 font-semibold">₹45,000</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Vehicle EMI Payment</p>
                            <p className="text-sm text-gray-500">2024-03-10</p>
                          </div>
                          <span className="text-emerald-600 font-semibold">₹12,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Section */}
                {activeSection === 'settings' && (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Notifications</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={formData.settings.notifications} 
                              onChange={() => setFormData(prev => ({
                                ...prev,
                                settings: { ...prev.settings, notifications: !prev.settings.notifications }
                              }))}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Dark Mode</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={formData.settings.darkMode}
                              onChange={() => setFormData(prev => ({
                                ...prev,
                                settings: { ...prev.settings, darkMode: !prev.settings.darkMode }
                              }))}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Payment Preferences */}
              {activeSection === 'payment' && (
                <div className="space-y-6">
                  <PaymentOptionsSection
                    category="creditCards"
                    options={paymentOptions.creditCards}
                  />
                  <PaymentOptionsSection
                    category="debitCards"
                    options={paymentOptions.debitCards}
                  />
                  <PaymentOptionsSection
                    category="upiOptions"
                    options={paymentOptions.upiOptions}
                  />
                  <PaymentOptionsSection
                    category="netBanking"
                    options={paymentOptions.netBanking}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                      <Wallet className="mr-2 text-emerald-500" size={20} />
                      EMI Preferences
                    </h3>
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      value={formData.paymentPreferences.emiOptions}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: 'paymentPreferences.emiOptions',
                            value: e.target.value
                          }
                        })
                      }
                    >
                      <option value="">Select EMI Duration</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="9">9 Months</option>
                      <option value="12">12 Months</option>
                      <option value="18">18 Months</option>
                      <option value="24">24 Months</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Financial Information */}
              {activeSection === 'financial' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Score
                    </label>
                    <input
                      type="number"
                      name="financialPreferences.creditScore"
                      value={formData.financialPreferences.creditScore}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter your credit score"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Income (₹)
                    </label>
                    <input
                      type="number"
                      name="financialPreferences.monthlyIncome"
                      value={formData.financialPreferences.monthlyIncome}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter your monthly income"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'financial' && (
                <button
                  type="submit"
                  className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-xl font-bold tracking-wide hover:opacity-90 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 animate-spin" size={20} />
                      Analyzing Finances...
                    </>
                  ) : (
                    'Get Financial Advice'
                  )}
                </button>
              )}
            </form>
          </div>
        </div>

        {advice && (
          <div className="p-6 bg-gray-50">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-6">
                {/* Optimization Strategy */}
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                  <h3 className="text-lg font-semibold text-emerald-800 mb-3">Optimization Strategy</h3>
                  <div className="text-gray-700 space-y-2">
                    <p><strong>Primary Method:</strong> {advice.advice?.optimizationStrategy?.primaryMethod?.platform} ({advice.advice?.optimizationStrategy?.primaryMethod?.percentage}%)</p>
                    {advice.advice?.optimizationStrategy?.primaryMethod?.bankDetails && (
                      <p><strong>Bank Details:</strong> {advice.advice?.optimizationStrategy?.primaryMethod?.bankDetails}</p>
                    )}
                    <p><strong>Secondary Method:</strong> {advice.advice?.optimizationStrategy?.secondaryMethod?.platform} ({advice.advice?.optimizationStrategy?.secondaryMethod?.percentage}%)</p>
                    {advice.advice?.optimizationStrategy?.secondaryMethod?.advantages && (
                      <div>
                        <strong>Advantages:</strong>
                        <ul className="list-disc pl-5">
                          {advice.advice?.optimizationStrategy?.secondaryMethod?.advantages.map((advantage, index) => (
                            <li key={index}>{advantage}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Potential Savings */}
                {advice.advice?.potentialSavings && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Potential Savings</h3>
                    <p className="text-gray-700 mb-2"><strong>Total:</strong> {advice.advice.potentialSavings.total}</p>
                    <div className="text-gray-700">
                      <strong>Breakdown:</strong>
                      <ul className="list-disc pl-5">
                        {advice.advice.potentialSavings.breakdown.map((saving, index) => (
                          <li key={index}>{saving}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Action Steps */}
                {advice.advice?.actionSteps && advice.advice.actionSteps.length > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3">Action Steps</h3>
                    <ol className="list-decimal pl-5 text-gray-700">
                      {advice.advice.actionSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Risk Assessment */}
                {advice.advice?.riskAssessment && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <h3 className="text-lg font-semibold text-red-800 mb-3">Risk Assessment</h3>
                    <div className="text-gray-700">
                      <p className="mb-2"><strong>Credit Score Impact:</strong> {advice.advice.riskAssessment.creditScoreImpact}</p>
                      <strong>Financial Risks:</strong>
                      <ul className="list-disc pl-5">
                        {advice.advice.riskAssessment.financialRisks.map((risk, index) => (
                          <li key={index}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {(advice.advice?.suggestions?.specificScenario || advice.advice?.contextualRecommendations?.specificScenario) && (
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                    <h3 className="text-lg font-semibold text-purple-800 mb-3">Suggestions</h3>
                    <div className="text-gray-700">
                      {advice.advice?.suggestions?.specificScenario && (
                        <>
                          <strong>Specific Recommendations:</strong>
                          <ul className="list-disc pl-5 mb-4">
                            {advice.advice.suggestions.specificScenario.map((suggestion, index) => (
                              <li key={index}>{suggestion}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      {advice.advice?.contextualRecommendations?.specificScenario && (
                        <>
                          <strong>Additional Recommendations:</strong>
                          <ul className="list-disc pl-5">
                            {advice.advice.contextualRecommendations.specificScenario.map((recommendation, index) => (
                              <li key={index}>{recommendation}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialAdvicePage;



