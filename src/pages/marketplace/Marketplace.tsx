import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Star, ShoppingBag, ArrowLeft, Search,
  Sparkles, Heart, Check, Package, Baby, Shield, Utensils
} from 'lucide-react';
import { useCart, type Product } from '../../context/CartContext';
import CartDrawer from '../../components/marketplace/CartDrawer';
import './Marketplace.css';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const PRODUCTS: Product[] = [
  {
    id: 'dm-001', name: 'Mimi — Story Companion', description: 'AI-powered plush that tells calming bedtime stories using your own voice.',
    category: 'toy', price: 2499, comparePrice: 3499, image: '/images/mimi.png',
    ageRange: '0-3 years', inStock: true, rating: 4.8, reviewCount: 234, tags: ['bestseller', 'ai'], color: 'pink'
  },
  {
    id: 'dm-002', name: 'Simba — Sleep Guardian', description: 'Brave lion protector that plays white noise and monitors sleep patterns.',
    category: 'toy', price: 2799, comparePrice: 3999, image: '/images/simba.png',
    ageRange: '0-4 years', inStock: true, rating: 4.9, reviewCount: 189, tags: ['popular', 'ai'], color: 'orange'
  },
  {
    id: 'dm-003', name: 'Prince — Crawl Motivator', description: 'Interactive pup that encourages crawling with playful sounds and movement.',
    category: 'toy', price: 1999, comparePrice: 2799, image: '/images/prince.png',
    ageRange: '6-18 months', inStock: true, rating: 4.7, reviewCount: 156, tags: ['motor-skills'], color: 'indigo'
  },
  {
    id: 'dm-004', name: 'Arnie — Glow Buddy', description: 'Soft huggable friend with gentle night glow and calming lullabies.',
    category: 'toy', price: 1899, comparePrice: 2499, image: '/images/arnie.png',
    ageRange: '0-2 years', inStock: true, rating: 4.6, reviewCount: 312, tags: ['sleep', 'soothing'], color: 'amber'
  },
  {
    id: 'dm-005', name: 'Chichi — Musical Friend', description: 'Gentle party starter playing peaceful nursery rhymes and spinning softly.',
    category: 'toy', price: 2199, comparePrice: 2999, image: '/images/chichi.png',
    ageRange: '3-24 months', inStock: true, rating: 4.5, reviewCount: 98, tags: ['music'], color: 'sky'
  },
  {
    id: 'dm-006', name: 'Duke — Smart Guardian', description: 'Alerts when baby cries and plays soothing sounds remotely via app.',
    category: 'safety', price: 3299, comparePrice: 4499, image: '/images/duke.png',
    ageRange: '0-3 years', inStock: true, rating: 4.9, reviewCount: 421, tags: ['smart', 'ai', 'monitor'], color: 'emerald'
  }
];

const CATEGORIES = [
  { key: 'all', label: 'All Products', icon: Package },
  { key: 'toy', label: 'Smart Toys', icon: Baby },
  { key: 'care', label: 'Baby Care', icon: Heart },
  { key: 'feeding', label: 'Feeding', icon: Utensils },
  { key: 'safety', label: 'Safety', icon: Shield },
  { key: 'accessory', label: 'Accessories', icon: Sparkles },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string; dot: string; btn: string }> = {
  pink:    { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600', badge: 'bg-pink-50 text-pink-600 border-pink-100', dot: 'bg-pink-400', btn: 'hover:border-pink-200 hover:shadow-pink-100/50' },
  orange:  { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', badge: 'bg-orange-50 text-orange-600 border-orange-100', dot: 'bg-orange-400', btn: 'hover:border-orange-200 hover:shadow-orange-100/50' },
  indigo:  { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', badge: 'bg-indigo-50 text-indigo-600 border-indigo-100', dot: 'bg-indigo-400', btn: 'hover:border-indigo-200 hover:shadow-indigo-100/50' },
  amber:   { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-600 border-amber-100', dot: 'bg-amber-400', btn: 'hover:border-amber-200 hover:shadow-amber-100/50' },
  sky:     { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600', badge: 'bg-sky-50 text-sky-600 border-sky-100', dot: 'bg-sky-400', btn: 'hover:border-sky-200 hover:shadow-sky-100/50' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600 border-emerald-100', dot: 'bg-emerald-400', btn: 'hover:border-emerald-200 hover:shadow-emerald-100/50' },
  rose:    { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', badge: 'bg-rose-50 text-rose-600 border-rose-100', dot: 'bg-rose-400', btn: 'hover:border-rose-200 hover:shadow-rose-100/50' },
  violet:  { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600', badge: 'bg-violet-50 text-violet-600 border-violet-100', dot: 'bg-violet-400', btn: 'hover:border-violet-200 hover:shadow-violet-100/50' },
};

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addToCart, cartCount, setIsCartOpen } = useCart();

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedIds(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds(prev => { const n = new Set(prev); n.delete(product.id); return n; });
    }, 1500);
  };

  const pageContainer = "mx-auto w-full max-w-[1120px] px-4 sm:px-5 lg:px-6";

  return (
    <div className="marketplace-page min-h-screen font-sans selection:bg-orange-200 selection:text-orange-900">
      <div className="orb-1" />
      <div className="orb-2" />

      {/* Top Nav */}
      <nav className="fixed left-0 right-0 z-50 flex flex-col items-center pt-2.5 sm:pt-3">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-nav flex w-[calc(100vw_-_2.5rem)] max-w-[1120px] items-center justify-between rounded-2xl border border-stone-200 px-2.5 py-2.5 shadow-sm min-[360px]:w-[calc(100vw_-_2rem)] sm:px-3.5 md:rounded-full lg:px-4"
        >
          <Link to="/" className="group flex min-w-0 items-center gap-2.5 select-none sm:gap-3">
            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full shadow-sm min-[360px]:h-8 min-[360px]:w-8 sm:h-9 sm:w-9">
              <img src="/images/MumaaAIlogo.png" alt="Mumaa Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex min-w-0 flex-col leading-none">
              <div className="truncate text-[15px] font-black tracking-tight text-stone-800 min-[360px]:text-lg sm:text-xl">AI MUMAA</div>
              <span className="mt-0.5 hidden text-[8px] font-bold uppercase tracking-[0.1em] text-orange-500 min-[360px]:block sm:text-[9px]">Mumaa STORE</span>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link to="/" className="hidden items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-[13px] font-bold text-stone-600 transition-all hover:bg-stone-50 sm:flex">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative gradient-peach flex items-center gap-2 rounded-full border border-white px-3.5 py-2 text-[13px] font-bold text-orange-900 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-md"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </motion.div>
      </nav>

      <main className="flex-grow pt-20 lg:pt-24">
        {/* Hero Banner */}
        <section className={`${pageContainer} pb-6 pt-4`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[1.75rem] border border-white bg-gradient-to-br from-orange-50 via-rose-50/40 to-amber-50/60 p-6 shadow-lg sm:p-8 lg:p-10"
          >
            <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-orange-200/30 blur-[80px]" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-rose-200/30 blur-[60px]" />
            <div className="relative z-10">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-600 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Dumamu Collection
              </div>
              <h1 className="mb-3 max-w-lg text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-[1.08] tracking-tight text-stone-800">
                The <span className="text-orange-500">Dumamu</span> Store
              </h1>
              <p className="max-w-md text-[clamp(0.88rem,1.1vw,0.95rem)] font-medium leading-6 text-stone-500">
                Safe, AI-powered baby companions, organic care essentials, and everything your little one needs — curated by Mumaa.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Search + Filters */}
        <section className={`${pageContainer} mb-6`}>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm font-bold text-stone-800 shadow-sm transition-all hover:border-stone-300 focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-50"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-all ${
                      isActive
                        ? 'gradient-peach border border-white text-orange-900 shadow-md'
                        : 'border border-stone-200 bg-white text-stone-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {cat.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Product Grid */}
        <section className={`${pageContainer} pb-16`}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          >
            {filtered.map(product => {
              const colors = COLOR_MAP[product.color] || COLOR_MAP.orange;
              const isAdded = addedIds.has(product.id);
              const discount = product.comparePrice
                ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                : 0;

              return (
                <motion.div
                  key={product.id}
                  variants={fadeIn}
                  className={`group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-stone-100 bg-white/80 shadow-md backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${colors.btn}`}
                >
                  {/* Image */}
                  <div className="relative aspect-[1/0.85] cursor-pointer overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute ${colors.bg} right-2.5 top-2.5 z-10 flex items-center gap-1 rounded-lg border border-white/50 px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur ${colors.badge}`}>
                      <Sparkles className="h-3 w-3" /> {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </div>
                    {discount > 0 && (
                      <div className="absolute left-2.5 top-2.5 z-10 rounded-lg bg-rose-500 px-2 py-1 text-[10px] font-black text-white shadow-sm">
                        -{discount}%
                      </div>
                    )}
                    {product.tags.includes('bestseller') && (
                      <div className="absolute bottom-2.5 left-2.5 z-10 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700 shadow-sm">
                        ⭐ Bestseller
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col border-t border-stone-100 p-4 lg:p-5">
                    <div className="mb-1 flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-200'}`} />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-stone-400">{product.rating} ({product.reviewCount})</span>
                    </div>

                    <h3 className="mb-1.5 text-[clamp(1rem,1.5vw,1.15rem)] font-extrabold tracking-tight text-stone-800 transition-colors group-hover:text-orange-600">
                      {product.name}
                    </h3>
                    <p className="mb-3 flex-1 text-[13px] font-medium leading-5 text-stone-500">
                      {product.description}
                    </p>

                    <div className="mb-3 flex items-center gap-2">
                      <div className={`flex items-center gap-1 rounded-lg ${colors.bg} px-2 py-1 text-[11px] font-bold ${colors.text}`}>
                        <Baby className="h-3 w-3" /> {product.ageRange}
                      </div>
                      <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600">
                        <Check className="h-3 w-3" /> In Stock
                      </div>
                    </div>

                    {/* Price + Add to Cart */}
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-orange-600">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.comparePrice && (
                          <span className="text-sm font-bold text-stone-400 line-through">₹{product.comparePrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`add-to-cart-btn flex h-10 items-center gap-2 rounded-xl px-4 text-[13px] font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${
                          isAdded
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border border-stone-800 bg-stone-800 text-white hover:bg-stone-700'
                        }`}
                      >
                        {isAdded ? (
                          <><Check className="h-4 w-4" /> Added</>
                        ) : (
                          <><ShoppingBag className="h-4 w-4" /> Add</>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
              <Package className="mx-auto mb-4 h-16 w-16 text-stone-300" />
              <h3 className="mb-2 text-lg font-extrabold text-stone-700">No products found</h3>
              <p className="text-sm font-medium text-stone-400">Try a different category or search term</p>
            </motion.div>
          )}
        </section>
      </main>

      {/* Floating Cart Button (Mobile) */}
      {cartCount > 0 && (
        <motion.button
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-stone-800 px-5 py-3.5 text-sm font-bold text-white shadow-2xl transition-all hover:-translate-y-1 hover:bg-stone-700 hover:shadow-3xl sm:hidden"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{cartCount} items · ₹{useCart().cartTotal.toLocaleString('en-IN')}</span>
        </motion.button>
      )}

      <CartDrawer />
    </div>
  );
}
