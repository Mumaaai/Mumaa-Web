import { useState, useEffect } from 'react';
import { 
  Stethoscope, ShieldAlert, Phone, AlertCircle, HeartPulse, 
  User, Edit2, Check, Flame, Thermometer, AlertTriangle, 
  Sparkles, Heart 
} from 'lucide-react';

interface EmergencyProfile {
  bloodType: string;
  allergies: string;
  pediatricianName: string;
  pediatricianPhone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalConditions: string;
}

const EMERGENCY_GUIDES = [
  {
    id: 'choking',
    title: 'Baby Choking',
    icon: ShieldAlert,
    color: 'text-rose-600 bg-rose-50 border-rose-100 hover:bg-rose-100/50',
    activeColor: 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-100',
    steps: [
      'Confirm they cannot cry, cough, or breathe.',
      'Place the baby face down along your forearm, supporting their jaw.',
      'Give 5 firm back blows with the heel of your hand between their shoulder blades.',
      'If not cleared, flip face up on your arm, supporting their head.',
      'Give 5 chest thrusts using two fingers on the breastbone (about 1.5 inches deep).',
      'Repeat pattern. If baby becomes unconscious, begin infant CPR immediately and dial emergency.'
    ]
  },
  {
    id: 'fever',
    title: 'High Fever',
    icon: Thermometer,
    color: 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100/50',
    activeColor: 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-100',
    steps: [
      'An infant under 3 months with a rectal temp of 100.4°F (38°C) or higher needs immediate pediatric evaluation.',
      'Ensure the room is well-ventilated and dress the baby in lightweight clothing.',
      'Offer extra fluids (breast milk or formula) to prevent dehydration.',
      'Use lukewarm water sponge bath if baby is uncomfortable (never use ice or rubbing alcohol).',
      'Do not give fever-reducing medication without consulting your pediatrician first.'
    ]
  },
  {
    id: 'poisoning',
    title: 'Poison / Swallow',
    icon: AlertTriangle,
    color: 'text-purple-605 bg-purple-50 border-purple-100 hover:bg-purple-100/50',
    activeColor: 'bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-100',
    steps: [
      'If baby swallowed something toxic, immediately call local Poison Control or Emergency.',
      'Do NOT induce vomiting unless explicitly told by medical professionals.',
      'Identify what they ingested and keep the packaging or bottle near you to describe to paramedics.',
      'If the chemical is on skin or eyes, flush gently with lukewarm water for 15-20 minutes.'
    ]
  },
  {
    id: 'burns',
    title: 'Burns & Scalds',
    icon: Flame,
    color: 'text-orange-605 bg-orange-50 border-orange-100 hover:bg-orange-100/50',
    activeColor: 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100',
    steps: [
      'Immediately cool the burn under cool, running tap water for at least 10 minutes.',
      'Never apply ice, butter, grease, or ointment to a fresh burn.',
      'Gently remove clothing from the burned area, but do not pull if stuck.',
      'Cover loosely with clean, non-stick gauze or plastic wrap. Seek medical evaluation.'
    ]
  }
];

interface EmergencyViewProps {
  user?: any;
  babyProfile?: any;
}

export default function EmergencyView({ user, babyProfile }: EmergencyViewProps) {
  const [profile, setProfile] = useState<EmergencyProfile>({
    bloodType: 'O+',
    allergies: 'None recorded',
    pediatricianName: 'Dr. Sarah Carter',
    pediatricianPhone: '+1-555-0199',
    emergencyContactName: 'Grandpa John',
    emergencyContactPhone: '+1-555-0144',
    medicalConditions: 'None'
  });
  
  const [babyInfo, setBabyInfo] = useState({ name: 'Little One', age: '0 months' });
  const [isEditing, setIsEditing] = useState(false);
  const [activeGuide, setActiveGuide] = useState('choking');

  useEffect(() => {
    if (babyProfile) {
      const name = babyProfile.name || 'Little One';
      let ageStr = '0 months';
      if (babyProfile.date_of_birth) {
        const birthDate = new Date(babyProfile.date_of_birth);
        const today = new Date();
        const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
        ageStr = months < 1 ? '0 months' : months < 12 ? `${months} months` : `${Math.floor(months / 12)} year(s)`;
      }
      setBabyInfo({ name, age: ageStr });
      
      setProfile(prev => ({
        ...prev,
        bloodType: babyProfile.blood_group || prev.bloodType,
        allergies: babyProfile.medical_conditions || prev.allergies
      }));
    } else {
      try {
        const session = localStorage.getItem('mumaa_session');
        if (session) {
          const userObj = JSON.parse(session);
          const name = userObj.babyName || 'Little One';
          
          let ageStr = '0 months';
          if (userObj.babyDOB) {
            const birthDate = new Date(userObj.babyDOB);
            const today = new Date();
            const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
            ageStr = months < 1 ? '0 months' : months < 12 ? `${months} months` : `${Math.floor(months / 12)} year(s)`;
          }
          setBabyInfo({ name, age: ageStr });
        }
      } catch (e) {
        console.error(e);
      }
    }

    try {
      const stored = localStorage.getItem('mumaa_emergency_profile');
      if (stored) {
        setProfile(prev => ({ ...prev, ...JSON.parse(stored) }));
      }
    } catch (e) {
      console.error(e);
    }
  }, [babyProfile]);

  const handleSave = () => {
    localStorage.setItem('mumaa_emergency_profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const selectedGuide = EMERGENCY_GUIDES.find(g => g.id === activeGuide) || EMERGENCY_GUIDES[0];
  const GuideIcon = selectedGuide.icon;

  return (
    <div className="h-full overflow-y-auto chat-scroll p-4 md:p-8 bg-[#FFFDFB]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-850 flex items-center gap-3">
              <span className="p-2 bg-rose-50 rounded-2xl text-rose-500 shadow-sm">
                <HeartPulse className="w-7 h-7" />
              </span>
              Emergency Info
            </h1>
            <p className="text-stone-500 font-semibold mt-1">Keep critical health facts accessible and follow emergency pediatric procedures.</p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Wallet ID Card & Hotlines (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Elegant Light Cream/Rose Medical ID Card */}
            <div className="bg-gradient-to-br from-[#FFFDFB] to-[#FFF7F4] text-stone-800 rounded-[2.5rem] p-6 shadow-sm border border-stone-150 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              
              <div className="absolute -right-16 -top-16 w-36 h-36 bg-rose-50 rounded-full blur-2xl opacity-60 pointer-events-none" />
              
              {/* ID Header */}
              <div className="flex justify-between items-start z-10 border-b border-stone-150 pb-4">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black tracking-widest uppercase text-rose-500">Mumaa Companion</span>
                  <h3 className="text-sm font-black tracking-wide text-stone-850">EMERGENCY MEDICAL ID</h3>
                </div>
                
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="px-3.5 py-1.5 bg-stone-50 hover:bg-stone-100 active:scale-95 transition-all text-stone-700 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 border border-stone-200 cursor-pointer"
                >
                  {isEditing ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-3.5 h-3.5 text-rose-500" /> Edit
                    </>
                  )}
                </button>
              </div>

              {/* ID Fields */}
              <div className="my-5 space-y-4.5 z-10 text-xs font-semibold">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-0.5">Baby Name & Age</span>
                  <span className="text-base font-black text-stone-850">{babyInfo.name} ({babyInfo.age})</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Blood Type</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={profile.bloodType} 
                        onChange={e => setProfile({...profile, bloodType: e.target.value})}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-800 font-bold text-xs focus:border-rose-300 outline-none"
                      />
                    ) : (
                      <span className="font-extrabold text-stone-800 bg-stone-50 border border-stone-150 px-2 py-0.5 rounded">{profile.bloodType}</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Allergies</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={profile.allergies} 
                        onChange={e => setProfile({...profile, allergies: e.target.value})}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-800 font-bold text-xs focus:border-rose-300 outline-none"
                      />
                    ) : (
                      <span className="font-extrabold text-rose-650 bg-rose-50/50 px-2.5 py-0.5 rounded border border-rose-100">{profile.allergies}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-0.5">Pediatrician</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={profile.pediatricianName} 
                        onChange={e => setProfile({...profile, pediatricianName: e.target.value})}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-800 font-bold text-xs focus:border-rose-300 outline-none"
                      />
                    ) : (
                      <span className="font-bold text-stone-800 block truncate">{profile.pediatricianName}</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-0.5">Phone Contact</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={profile.pediatricianPhone} 
                        onChange={e => setProfile({...profile, pediatricianPhone: e.target.value})}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-800 font-bold text-xs focus:border-rose-300 outline-none"
                      />
                    ) : (
                      <a href={`tel:${profile.pediatricianPhone}`} className="text-rose-500 hover:underline text-xs flex items-center gap-1 font-bold">
                        <Phone className="w-3 h-3 fill-current shrink-0" />
                        {profile.pediatricianPhone}
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-0.5">Emergency Contact</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={profile.emergencyContactName} 
                        onChange={e => setProfile({...profile, emergencyContactName: e.target.value})}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-800 font-bold text-xs focus:border-rose-300 outline-none"
                      />
                    ) : (
                      <span className="font-bold text-stone-800 block truncate">{profile.emergencyContactName}</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-0.5">Contact Phone</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={profile.emergencyContactPhone} 
                        onChange={e => setProfile({...profile, emergencyContactPhone: e.target.value})}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-800 font-bold text-xs focus:border-rose-300 outline-none"
                      />
                    ) : (
                      <a href={`tel:${profile.emergencyContactPhone}`} className="text-rose-500 hover:underline text-xs flex items-center gap-1 font-bold">
                        <Phone className="w-3 h-3 fill-current shrink-0" />
                        {profile.emergencyContactPhone}
                      </a>
                    )}
                  </div>
                </div>

              </div>

              {/* ID Footer */}
              <div className="text-[9px] text-stone-450 border-t border-stone-150 pt-3 font-semibold z-10 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                Keep updated. Show this card to medical teams in emergencies.
              </div>

            </div>

            {/* Emergency Action Hotlines */}
            <div className="space-y-3">
              <span className="text-xs font-black text-stone-400 uppercase tracking-widest block mb-2 px-1">Quick Hotlines</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="tel:911"
                  className="flex items-center justify-between p-4 bg-white hover:bg-rose-50 border border-stone-150 rounded-2xl transition-all font-extrabold text-rose-600 active:scale-98 shadow-sm group cursor-pointer"
                >
                  <div className="min-w-0">
                    <span className="block text-[9px] uppercase tracking-wider font-bold text-stone-400">Emergency / Ambulance</span>
                    <span className="text-lg font-black block mt-0.5 text-stone-850">911</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
                    <Phone className="w-4 h-4 fill-current" />
                  </div>
                </a>

                <a 
                  href="tel:18002221222"
                  className="flex items-center justify-between p-4 bg-white hover:bg-rose-50 border border-stone-150 rounded-2xl transition-all font-extrabold text-rose-600 active:scale-98 shadow-sm group cursor-pointer"
                >
                  <div className="min-w-0">
                    <span className="block text-[9px] uppercase tracking-wider font-bold text-stone-400">Poison Control</span>
                    <span className="text-lg font-black block mt-0.5 text-stone-850">1-800-222-1222</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
                    <Phone className="w-4 h-4 fill-current" />
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Right Panel: Protocol Steps (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Guide tabs selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EMERGENCY_GUIDES.map(guide => {
                const ItemIcon = guide.icon;
                const isActive = activeGuide === guide.id;
                return (
                  <button
                    key={guide.id}
                    onClick={() => setActiveGuide(guide.id)}
                    className={`py-3.5 px-3 rounded-2xl border transition-all font-extrabold text-xs flex flex-col items-center gap-2 active:scale-95 shadow-sm cursor-pointer ${
                      isActive ? guide.activeColor : guide.color
                    }`}
                  >
                    <ItemIcon className="w-5 h-5 shrink-0" />
                    <span>{guide.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Steps Visual checklist */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-stone-100 space-y-6">
              
              <div className="flex items-center gap-3 pb-4 border-b border-stone-50">
                <div className="p-3 bg-rose-50 rounded-2xl text-rose-500 shadow-sm shrink-0">
                  <GuideIcon className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-850 tracking-tight">
                    {selectedGuide.title} Protocols
                  </h3>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">Perform these steps in sequence immediately</p>
                </div>
              </div>

              {/* Step cards list */}
              <div className="space-y-3">
                {selectedGuide.steps.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="flex gap-4 items-start p-4 bg-stone-50/40 rounded-2xl border border-stone-150/40 hover:border-stone-200 transition-colors shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                      {idx + 1}
                    </div>
                    <p className="text-stone-750 text-sm font-semibold leading-relaxed mt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Warning reminder at bottom of guides */}
              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-3 text-stone-600 text-xs font-semibold leading-relaxed">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  Keep calm. Administer first aid step-by-step while waiting for professional help. If baby becomes unresponsive, start pediatric CPR immediately.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
