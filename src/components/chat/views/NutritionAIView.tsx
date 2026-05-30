export default function NutritionAIView() {
  return (
    <div className="h-full flex flex-col p-6 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-black text-stone-800 tracking-tight mb-2">Nutrition AI</h1>
        <p className="text-stone-500 mb-8">AI-powered nutrition advisor for personalized meal plans and health insights.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
            <h3 className="text-lg font-bold text-emerald-800 mb-2">Meal Planner</h3>
            <p className="text-stone-600 text-sm">Generate healthy, balanced meal plans tailored to your needs.</p>
          </div>
          <div className="p-6 bg-sky-50 rounded-[2rem] border border-sky-100">
            <h3 className="text-lg font-bold text-sky-800 mb-2">Dietary Insights</h3>
            <p className="text-stone-600 text-sm">Analyze your nutrition intake and discover areas for improvement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
