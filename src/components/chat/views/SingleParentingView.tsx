export default function SingleParentingView() {
  return (
    <div className="h-full flex flex-col p-6 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-black text-stone-800 tracking-tight mb-2">Single Parenting</h1>
        <p className="text-stone-500 mb-8">Dedicated resources, guides, and support for single parents.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-100">
            <h3 className="text-lg font-bold text-orange-800 mb-2">Support Network</h3>
            <p className="text-stone-600 text-sm">Connect with other single parents and find local support groups.</p>
          </div>
          <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100">
            <h3 className="text-lg font-bold text-rose-800 mb-2">Resource Guides</h3>
            <p className="text-stone-600 text-sm">Access curated articles and guides tailored for single parenting challenges.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
