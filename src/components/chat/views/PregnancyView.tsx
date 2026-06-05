import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Utensils, Brain, ListChecks, Droplets, Flower2, GlassWater, Circle, MessageSquare, Headset, Send, Bot, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PregnancyView() {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: "Hi Ananya! I'm your pregnancy AI guide. Do you have any questions about your Week 24 milestones, diet, or exercises?" }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    const newMsg = { id: Date.now(), type: 'user', text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    
    // Simulate AI response for now
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        type: 'ai', 
        text: "I'm currently a prototype interface! Soon, I'll be connected to the AI backend to answer all your pregnancy questions." 
      }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col p-6 lg:p-8 bg-[#fdfaf8] overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <button className="inline-flex items-center gap-2 text-rose-700 hover:text-rose-800 font-medium text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Journey
          </button>
          <h1 className="text-[2rem] md:text-[2.5rem] font-bold text-stone-900 tracking-tight leading-tight mb-2">Daily Tips & Insights</h1>
          <p className="text-stone-500 text-lg">Personalized wellness advice for Week 24</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column (Span 2) */}
          <div className="xl:col-span-2 space-y-8">
            {/* Featured Wellness Card */}
            <div className="bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
               {/* Image half */}
               <div className="w-full md:w-5/12 h-[300px] md:h-auto bg-stone-200 relative">
                 <img 
                   src="/images/pexels-suresh-photography-922908746-32761033.jpg" 
                   alt="Featured Wellness"
                   className="w-full h-full object-cover object-top" 
                 />
               </div>
               {/* Content half */}
               <div className="w-full md:w-7/12 p-8 lg:p-12 flex flex-col justify-center">
                 <div className="text-[10px] font-bold text-rose-700 uppercase tracking-widest mb-3">Featured Wellness</div>
                 <h2 className="text-2xl lg:text-[1.75rem] font-semibold text-stone-900 leading-tight mb-4">Stay Active, Stay Happy: Embracing Movement</h2>
                 <p className="text-stone-600 mb-8 leading-relaxed">A gentle 15-minute walk or light stretching can significantly boost your mood and improve sleep quality tonight.</p>
                 <button className="bg-[#9c4221] hover:bg-[#85371b] text-white px-6 py-3 rounded-full w-max text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                   Explore Tips <ArrowRight className="w-4 h-4" />
                 </button>
               </div>
            </div>

            {/* Insights Grid */}
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-5">Today's Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Card 1 */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <Utensils className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-stone-500 mb-1 uppercase tracking-wider">Nutrition</div>
                      <h3 className="text-lg font-semibold text-stone-900 mb-2">Iron-Rich Foods</h3>
                      <p className="text-stone-600 text-[13px] leading-relaxed">Boost your energy levels by including spinach, lentils, or lean red meat in your lunch today.</p>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Brain className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-stone-500 mb-1 uppercase tracking-wider">Mental Health</div>
                      <h3 className="text-lg font-semibold text-stone-900 mb-2">Managing Anxiety</h3>
                      <p className="text-stone-600 text-[13px] leading-relaxed">If you're feeling overwhelmed, try the 4-7-8 breathing technique to ground yourself in the moment.</p>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                      <ListChecks className="w-5 h-5 text-stone-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-stone-500 mb-1 uppercase tracking-wider">Preparation</div>
                      <h3 className="text-lg font-semibold text-stone-900 mb-2">Nursery Essentials</h3>
                      <p className="text-stone-600 text-[13px] leading-relaxed">It's a great week to start looking at crib safety standards and sustainable mattress options.</p>
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <Droplets className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-stone-500 mb-1 uppercase tracking-wider">Physical Care</div>
                      <h3 className="text-lg font-semibold text-stone-900 mb-2">Hydration is Key</h3>
                      <p className="text-stone-600 text-[13px] leading-relaxed">Staying hydrated helps prevent common third-trimester swelling and maintains healthy amniotic levels.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Span 1) */}
          <div className="space-y-6">
            {/* Today's Focus Card */}
            <div className="bg-[#f5f0eb] rounded-[2rem] p-8 relative overflow-hidden flex flex-col shadow-inner border border-[#e8dfd5]">
              {/* Subtle dotted pattern overlay */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#9c4221 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-center mb-6">
                  <Flower2 className="w-10 h-10 text-[#9c4221]" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-semibold text-stone-900 text-center mb-3">Today's Focus</h3>
                <p className="text-stone-600 text-center text-sm leading-relaxed mb-8">Take a moment for yourself and your baby with a focused task.</p>
                
                <div className="space-y-4 mb-8">
                  <button className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-sm border border-white hover:border-[#9c4221]/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Flower2 className="w-4 h-4 text-[#9c4221]" />
                      <span className="text-[15px] font-medium text-stone-800">5-Minute Meditation</span>
                    </div>
                    <Circle className="w-5 h-5 text-stone-300 group-hover:text-[#9c4221] transition-colors" />
                  </button>
                  
                  <button className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-sm border border-white hover:border-[#9c4221]/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <GlassWater className="w-4 h-4 text-[#9c4221]" />
                      <span className="text-[15px] font-medium text-stone-800">Log 8 Glasses of Water</span>
                    </div>
                    <Circle className="w-5 h-5 text-stone-300 group-hover:text-[#9c4221] transition-colors" />
                  </button>
                </div>
                
                <button className="mt-auto w-full bg-[#1c1917] hover:bg-black text-white py-4 rounded-full text-[15px] font-medium transition-colors shadow-md">
                  Mark as Complete
                </button>
              </div>
            </div>

            {/* Ask Dr. Sarah Card */}
            <div className="bg-[#e8f5e9] rounded-[2rem] p-6 shadow-sm border border-emerald-100/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                    <img src="/images/pexels-daniel-reche-718241-1556706.jpg" alt="Dr. Sarah" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-stone-900 font-semibold text-[15px]">Ask Dr. Sarah</h4>
                    <span className="bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm">Coming Soon</span>
                  </div>
                  <div className="text-emerald-700 text-xs font-medium mt-0.5">Expert Online Now</div>
                </div>
              </div>
              <p className="text-emerald-900/80 text-[13px] leading-relaxed mb-5">
                Have questions about your week 24 milestones? Our experts are here to guide you.
              </p>
              <button className="text-emerald-700 font-medium text-sm flex items-center gap-2 hover:text-emerald-800 transition-colors group">
                Start Chat <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
          
        </div>

        {/* AI Chat Interface */}
        <div className="mt-8 bg-[#fafafa] rounded-[2rem] border border-stone-100 flex flex-col h-[500px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#ff7657]/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-7 h-7 text-[#ff7657]" />
              </div>
              <div>
                <h3 className="font-bold text-stone-800 text-[17px] mb-1">Pregnancy AI Assistant</h3>
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-[0.15em]">Always here to help</p>
              </div>
            </div>
            <div className="text-[12px] font-bold text-[#ff7657] bg-[#ff7657]/10 px-4 py-2 rounded-full">
              AI Connected
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.type === 'ai' && (
                    <div className="w-10 h-10 rounded-full bg-[#ff7657]/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-[#ff7657]" />
                    </div>
                  )}
                  <div className={`px-6 py-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                    msg.type === 'user' 
                      ? 'bg-[#ff7657] text-white' 
                      : 'bg-white border border-stone-200 text-stone-600'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-6 bg-white border-t border-stone-100">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about symptoms, diet, or baby's growth..." 
                className="w-full bg-white border-2 border-[#ff7657]/30 hover:border-[#ff7657]/50 rounded-full pl-6 pr-16 py-4 text-[15px] focus:outline-none focus:border-[#ff7657] transition-colors placeholder:text-stone-400 text-stone-800 shadow-[0_2px_15px_rgba(255,118,87,0.1)]"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-3 w-10 h-10 bg-[#d4d4d4] hover:bg-[#a3a3a3] disabled:opacity-50 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
