import React, { useState, useEffect } from 'react';
import { Apple, UtensilsCrossed, Salad, Loader2, History } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '../../../api'; // Adjusted path to map your api configuration wrapper

export interface DietViewProps {
  user: { id: string; name: string };
  babyProfile: any;
}

export default function DietView({ user, babyProfile }: DietViewProps) {
  const [target, setTarget] = useState<'baby' | 'mom'>('baby');
  const [dietType, setDietType] = useState('Vegetarian');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dietContent, setDietContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Historical state tracking
  const [historyPlans, setHistoryPlans] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const dietOptions = [
    { value: 'Vegetarian', label: '🌱 Vegetarian' },
    { value: 'Non-Vegetarian', label: '🍗 Non-Vegetarian' },
    { value: 'Vegan', label: '🥗 Vegan' }
  ];

  const isNonVeg = dietType === 'Non-Vegetarian';
  
  const theme = {
    gradientBar: isNonVeg ? 'from-rose-500 to-red-500' : 'from-emerald-500 to-teal-500',
    iconWrapper: isNonVeg ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200',
    iconText: isNonVeg ? 'text-rose-600' : 'text-emerald-600',
    radioChecked: isNonVeg ? 'checked:border-rose-600 checked:bg-rose-50' : 'checked:border-emerald-600 checked:bg-emerald-50',
    radioDot: isNonVeg ? 'bg-rose-600' : 'bg-emerald-600',
    textActive: isNonVeg ? 'text-rose-800' : 'text-emerald-800',
    textHover: isNonVeg ? 'group-hover:text-rose-700' : 'group-hover:text-emerald-700',
    dropdownOpen: isNonVeg ? 'border-rose-500 ring-4 ring-rose-50' : 'border-emerald-500 ring-4 ring-emerald-50',
    dropdownHover: isNonVeg ? 'hover:border-rose-400' : 'hover:border-emerald-400',
    dropdownItemActive: isNonVeg ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800',
    dropdownItemHover: isNonVeg ? 'hover:bg-stone-50 hover:text-rose-700' : 'hover:bg-stone-50 hover:text-emerald-700',
    buttonGradient: isNonVeg ? 'from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-rose-200/50 hover:shadow-rose-200' : 'from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-200/50 hover:shadow-emerald-200',
    resultBorder: isNonVeg ? 'border-rose-200' : 'border-emerald-200',
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "Newborn";
    const birthDate = new Date(dob);
    const today = new Date();
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    if (months < 1) return "Newborn";
    if (months < 12) return `${months} months old`;
    return `${Math.floor(months / 12)} years and ${months % 12} months old`;
  };

  // Fetch previous logs from D1 database
  const loadDietHistory = async () => {
    if (!user?.id) return;
    setIsHistoryLoading(true);
    try {
      const data = await api.get(`/diet/${user.id}`);
      if (Array.isArray(data)) {
        setHistoryPlans(data);
        if (data.length > 0 && !dietContent) {
          // Default display to the latest active configuration plan found
          setDietContent(data[0].content);
          setTarget(data[0].target);
          setDietType(data[0].diet_type);
        }
      }
    } catch (err) {
      console.error("Failed loading diet logs:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadDietHistory();
  }, [user?.id]);

  const generateDietChart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.puter) {
        throw new Error("Puter AI configuration runtime workspace missing.");
      }

      const babyAge = calculateAge(babyProfile?.date_of_birth);
      const babyName = babyProfile?.name || 'Baby';

      const systemPrompt = `You are MUMAA, an expert gentle pediatric and maternal nutritionist companion.
      Generate a practical, safe, highly healthy daily meal and nutrition profile chart.
      
      TARGET SPECIFICS:
      - Selection Type: ${target === 'baby' ? `Baby Primary Nutrition (${babyName} - Age: ${babyAge})` : `Postpartum Maternal Recovery diet (Mom of child aged ${babyAge})`}.
      - Preferences: ${dietType} Diet Structure.
      - Profile Meta Context: Delivery Type is ${babyProfile?.delivery_type || 'unspecified'}. Birth weight: ${babyProfile?.birth_weight || 'unknown'} kg. Background medical parameters: ${babyProfile?.medical_conditions || 'None flagged'}.
      
      OUTPUT FORMATTING:
      Provide structural Markdown layout utilizing clean typography elements. Introduce with a highly affectionate opening paragraph, detail explicit schedules matching Morning, Afternoon, and Evening boundaries, and wrap up with 3 short bulleted advice reminders targeting hydration status or complementary nutrients.`;

      // 1. Generate text configuration via Puter AI client runtime instance
      const response = await window.puter.ai.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Construct a structural ${dietType} guide tailored for ${target === 'baby' ? 'my baby profile instance' : 'my personal maternal intake'}.` }
      ], { model: 'gpt-4o-mini' });

      const generatedContent = response?.message?.content;
      if (!generatedContent) throw new Error("Null generation response returned from execution environment.");

      setDietContent(generatedContent);

      // 2. Dispatch save log transaction payload downstream toward Hono DB layer
      const savedRecord = await api.post('/diet', {
        userId: user.id,
        target,
        dietType,
        content: generatedContent
      });

      // Insert new plan directly to top of local history stack array seamlessly
      if (savedRecord && !savedRecord.error) {
        setHistoryPlans(prev => [
          {
            id: savedRecord.id,
            target,
            diet_type: dietType,
            content: generatedContent,
            created_at: new Date().toISOString()
          },
          ...prev
        ]);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'System encountered context errors generating the plan. Please reload.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto chat-scroll pb-10 bg-stone-50">
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        
        <div className="relative mb-8 text-center bg-white shadow-sm rounded-[3rem]">
          <div className="absolute inset-0 overflow-hidden rounded-[3rem] border border-stone-100 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-white"></div>
            <div className={`absolute bottom-0 left-[25%] -translate-x-1/2 translate-y-1/2 w-[250%] aspect-square rounded-full transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isNonVeg ? 'scale-100 bg-rose-50/60' : 'scale-0 bg-rose-50/60'}`}></div>
          </div>

          <div className="relative z-10 p-6 md:p-10">
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r rounded-t-[3rem] transition-colors duration-500 ${theme.gradientBar}`}></div>

            <div className={`w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center border shadow-sm transition-all duration-500 hover:scale-110 hover:rotate-3 bg-white ${theme.iconWrapper}`}>
              <Apple className="{`w-10 h-10 transition-colors duration-500 ${theme.iconText}`}"/>
            </ div>
            <h3 className="text-3xl font-bold mb-3 text-stone-800 tracking-tight">
            Nutrition Planner 
            </h3>
            <p className="text-base font-medium text-stone-500 mb-10 max-w-lg mx-auto">
              Gentle, safe, and nutritious meal plans for your little one or postpartum recovery.
            </p>

            <div className="relative max-w-xl mx-auto z-20">
              <div className="absolute inset-0 rounded-[2rem] border border-white/50 shadow-inner z-0 pointer-events-none bg-white/40 backdrop-blur-md"></div>

              <div className="relative z-10 p-6">
                
                <div className="flex gap-8 justify-center mb-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="diet-target" 
                        value="baby" 
                        checked={target === 'baby'} 
                        onChange={() => setTarget('baby')}
                        className={`peer w-6 h-6 appearance-none border-2 border-stone-300 rounded-full transition-colors cursor-pointer ${theme.radioChecked}`}
                      />
                      <div className={`absolute w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity scale-50 peer-checked:scale-100 duration-200 pointer-events-none ${theme.radioDot}`}></div>
                    </div>
                    <span className={`text-base font-bold transition-colors ${target === 'baby' ? theme.textActive : `text-stone-600 ${theme.textHover}`}`}>
                      For Baby
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="diet-target" 
                        value="mom" 
                        checked={target === 'mom'} 
                        onChange={() => setTarget('mom')}
                        className={`peer w-6 h-6 appearance-none border-2 border-stone-300 rounded-full transition-colors cursor-pointer ${theme.radioChecked}`}
                      />
                      <div className={`absolute w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity scale-50 peer-checked:scale-100 duration-200 pointer-events-none ${theme.radioDot}`}></div>
                    </div>
                    <span className={`text-base font-bold transition-colors ${target === 'mom' ? theme.textActive : `text-stone-600 ${theme.textHover}`}`}>
                      For Mom
                    </span>
                  </label>
                </div>

                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    {isDropdownOpen && (
                      <div className="fixed inset-0 z-20" onClick={() => setIsDropdownOpen(false)}></div>
                    )}
                    
                    <button 
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`relative z-30 w-full flex items-center justify-between bg-white border-2 rounded-2xl px-5 py-4 text-base font-bold text-stone-700 outline-none transition-all cursor-pointer shadow-sm active:scale-[0.98] ${isDropdownOpen ? theme.dropdownOpen : `border-stone-200 ${theme.dropdownHover}`}`}
                    >
                      <span>{dietOptions.find(opt => opt.value === dietType)?.label}</span>
                      <div className={`transition-transform duration-300 ${isDropdownOpen ? `rotate-180 ${theme.iconText}` : 'text-stone-400'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute z-40 w-full mt-2 bg-white border-2 border-stone-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {dietOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setDietType(option.value);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-5 py-4 text-base font-bold transition-colors ${dietType === option.value ? theme.dropdownItemActive : `text-stone-600 ${theme.dropdownItemHover}`}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={generateDietChart}
                    disabled={isLoading}
                    className={`bg-gradient-to-r text-white px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-lg hover:-translate-y-1 active:scale-95 active:shadow-inner whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${theme.buttonGradient}`}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Create Plan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        {error && (
          <div className="bg-white rounded-[3rem] p-8 md:p-10 border border-rose-100 shadow-sm mt-8 text-center animate-in fade-in slide-in-from-top-2">
             <p className="text-rose-500 font-bold">{error}</p>
          </div>
        )}

        
        {!isLoading && dietContent && (
          <div className={`bg-white rounded-[3rem] p-8 md:p-10 border shadow-sm mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors ${theme.resultBorder}`}>
            <div className="flex items-center gap-4 mb-8 border-b border-stone-100 pb-5">
              <div className={`p-3 rounded-2xl transition-colors duration-500 ${theme.iconWrapper}`}>
              </div>
              <h4 className="text-2xl font-bold text-stone-800">Active Diet Chart</h4>
            </div>
            <div className="markdown-content text-base text-stone-700 font-medium space-y-5 leading-relaxed tracking-wide">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{dietContent}</ReactMarkdown>
            </div>
          </div>
        )}

        
        {!isLoading && historyPlans.length > 1 && (
          <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm mt-8">
            <div className="flex items-center gap-2 mb-4 text-stone-700 font-bold text-sm">
              <History className="w-4 h-4 text-stone-400"/>
              <span>Previous Diet Guides</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {historyPlans.map((plan, index) => (
                <button
                  key={plan.id || index}
                  onClick={() => {
                    setDietContent(plan.content);
                    setTarget(plan.target);
                    setDietType(plan.diet_type);
                  }}
                  className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap active:scale-95 ${
                    dietContent === plan.content 
                      ? 'bg-stone-800 text-white border-stone-900' 
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {plan.target === 'baby' ? '👶 Baby' : '👩 Mom'} — {plan.diet_type} ({new Date(plan.created_at).toLocaleDateString()})
                </button>
              ))}
            </div>
          </div>
        )}

        
        {!isLoading && !dietContent && !error && (
          <div className="text-center py-16 opacity-50 transition-opacity hover:opacity-70 duration-300">
            <div className="w-20 h-20 mx-auto mb-4 bg-stone-200 rounded-full flex items-center justify-center transition-transform hover:scale-105 hover:rotate-6">
              <Salad className="w-10 h-10 text-stone-500"/>
            </div>
            <p className="text-base font-bold text-stone-500">
              {isHistoryLoading ? 'Scanning diet historical entries...' : 'Select configurations above to formulate a meal profile.'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}