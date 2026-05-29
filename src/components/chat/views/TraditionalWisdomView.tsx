export default function TraditionalWisdomView() {
  return (
    <div className="h-full flex flex-col p-6 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-black text-stone-800 tracking-tight mb-2">Traditional Wisdom</h1>
        <p className="text-stone-500 mb-8">Discover traditional knowledge, practices, and cultural wisdom.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-stone-50 rounded-[2rem] border border-stone-200">
            <h3 className="text-lg font-bold text-stone-800 mb-2">Cultural Practices</h3>
            <p className="text-stone-600 text-sm">Explore time-honored parenting traditions and practices.</p>
          </div>
          <div className="p-6 bg-stone-50 rounded-[2rem] border border-stone-200">
            <h3 className="text-lg font-bold text-stone-800 mb-2">Home Remedies</h3>
            <p className="text-stone-600 text-sm">Learn about traditional remedies and natural approaches to wellness.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
