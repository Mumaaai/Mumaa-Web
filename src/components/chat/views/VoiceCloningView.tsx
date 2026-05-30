export default function VoiceCloningView() {
  return (
    <div className="h-full flex flex-col p-6 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-black text-stone-800 tracking-tight mb-2">Voice Cloning</h1>
        <p className="text-stone-500 mb-8">Record, clone, and manage voice profiles for personalized experiences.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-800 mb-2">Record Voice</h3>
            <p className="text-stone-600 text-sm">Create a new voice profile by reading a few simple phrases.</p>
          </div>
          <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
            <h3 className="text-lg font-bold text-amber-800 mb-2">Manage Profiles</h3>
            <p className="text-stone-600 text-sm">View and manage your existing voice clones and their applications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
