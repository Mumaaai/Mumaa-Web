import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, PackageOpen } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-stone-200 bg-[#FFF8F3] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-orange-500 shadow-inner">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight text-stone-800">Your Cart</h2>
                  <p className="text-xs font-bold text-stone-400">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 shadow-sm transition-all hover:border-stone-300 hover:text-stone-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-stone-100 bg-stone-50">
                    <PackageOpen className="h-10 w-10 text-stone-300" />
                  </div>
                  <h3 className="mb-2 text-lg font-extrabold text-stone-700">Cart is empty</h3>
                  <p className="max-w-[200px] text-sm font-medium text-stone-400">
                    Browse the Dumamu store and add your favorite items!
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="gradient-peach mt-6 flex items-center gap-2 rounded-full border border-white px-5 py-2.5 text-sm font-bold text-orange-900 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Continue Shopping <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-3.5 rounded-2xl border border-stone-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                      >
                        {/* Product Image */}
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <h4 className="truncate text-sm font-extrabold text-stone-800">{item.product.name}</h4>
                            <p className="text-xs font-bold text-stone-400">{item.product.ageRange}</p>
                          </div>

                          <div className="flex items-end justify-between">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-500 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-7 text-center text-sm font-extrabold text-stone-800">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-500 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-orange-600">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-2.5 text-xs font-bold text-stone-400 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear Cart
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-t border-stone-200 bg-white px-5 py-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-500">Subtotal</span>
                  <span className="text-lg font-black text-stone-800">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-500">Delivery</span>
                  <span className="text-sm font-bold text-emerald-500">FREE</span>
                </div>
                <div className="mb-4 flex items-center justify-between border-t border-dashed border-stone-200 pt-3">
                  <span className="text-base font-extrabold text-stone-800">Total</span>
                  <span className="text-xl font-black text-orange-600">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button className="gradient-peach flex w-full items-center justify-center gap-2 rounded-2xl border border-white py-3.5 text-[15px] font-bold text-orange-900 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]">
                  <ShoppingBag className="h-5 w-5" /> Proceed to Checkout
                </button>
                <p className="mt-2.5 text-center text-[11px] font-medium text-stone-400">
                  🔒 Secure checkout · Free returns within 7 days
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
