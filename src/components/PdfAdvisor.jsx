import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, Send, Loader2, X } from 'lucide-react';

const PdfAdvisor = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTypingText]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files[0]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const typeMessage = async (text) => {
    setCurrentTypingText('');
    for (let i = 0; i < text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20));
      setCurrentTypingText(prev => prev + text[i]);
    }
    setCurrentTypingText('');
  };

  const handleFileUpload = async (file) => {
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setUploadStatus('success');
      
      // Show success message briefly before showing chat
      setTimeout(async () => {
        setShowChat(true);
        // Add initial message
        await typeMessage("I've received your PDF. What would you like to know about it?");
        setMessages([{
          type: 'assistant',
          content: "I've received your PDF. What would you like to know about it?"
        }]);
      }, 1000);
    } else {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage('');
    
    // Add user message immediately
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage
    }]);

    setIsLoading(true);
    
    try {
      // Create FormData with both file and message
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('message', userMessage);

      const response = await fetch('https://samadhan-backend.onrender.com/api/advice/pdf-advice', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      // Type out the response
      await typeMessage(data.message || "Here's what I found in your document...");
      
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: data.message || "Here's what I found in your document..."
      }]);
    } catch (error) {
      console.error('Error:', error);
      await typeMessage("I encountered an error analyzing your document. Please try again.");
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "I encountered an error analyzing your document. Please try again."
      }]);
    }
    
    setIsLoading(false);
  };

  const resetToUpload = () => {
    setShowChat(false);
    setUploadedFile(null);
    setMessages([]);
    setInputMessage('');
    setCurrentTypingText('');
  };

  if (showChat) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-emerald-600 mr-2" />
                <div>
                  <h1 className="font-semibold text-gray-800">{uploadedFile.name}</h1>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={resetToUpload}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto p-4">
          <div className="min-h-[calc(100vh-16rem)] flex flex-col">
            {/* Messages */}
            <div className="flex-1 space-y-4 pb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white shadow-sm border'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {currentTypingText && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-lg p-4 bg-white shadow-sm border">
                    {currentTypingText}
                  </div>
                </div>
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-lg p-4 bg-white shadow-sm border">
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="sticky bottom-0 bg-gray-50 pt-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question about your document..."
                  className="flex-1 border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 text-white rounded-lg px-4 py-2 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-20 pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Upload Card */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FileText className="mr-2 h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Upload Financial Documents
              </h2>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-300 hover:border-emerald-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Drag and drop your PDF here
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                or click the button below to browse
              </p>
              <input
                type="file"
                className="hidden"
                id="fileInput"
                onChange={handleFileChange}
                accept=".pdf"
              />
              <label
                htmlFor="fileInput"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 cursor-pointer transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select PDF File
              </label>
            </div>

            {/* Upload Status Messages */}
            {uploadStatus === 'success' && uploadedFile && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-md flex items-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="ml-2 text-emerald-800">
                  Successfully uploaded: {uploadedFile.name}
                </p>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="ml-2 text-red-800">
                  Please upload a valid PDF file
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Document Guidelines
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-emerald-500 mr-3" />
                <p className="text-sm text-gray-600">
                  Upload financial statements, investment documents, or bank statements in PDF format
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-emerald-500 mr-3" />
                <p className="text-sm text-gray-600">
                  Ensure documents are clear and readable for accurate analysis
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-emerald-500 mr-3" />
                <p className="text-sm text-gray-600">
                  Remove any sensitive personal information before uploading
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-emerald-500 mr-3" />
                <p className="text-sm text-gray-600">
                  Maximum file size: 10MB per document
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfAdvisor;