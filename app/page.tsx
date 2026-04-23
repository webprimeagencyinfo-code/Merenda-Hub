"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingBag, History, Info, Lock, Home, Plus, Trash2, LogOut } from "lucide-react";
import { supabase } from "../supabase";
// Types
type Product = { id: string; name: string; price: number; stock: number; image?: string };
type Order = { id: string; items: { product_id: string; quantity: number }[]; total: number; date: string; status: string };

export default function App() {
  const [activeTab, setActiveTab] = useState<"landing" | "ordina" | "chi-siamo" | "storico" | "admin">("landing");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [history, setHistory] = useState<Order[]>([]);
  
  // Admin auth
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Prodotti Esempio
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Panino al Salame", price: 3.5, stock: 10 },
    { id: "2", name: "Trancio di Pizza", price: 2.5, stock: 15 },
    { id: "3", name: "Acqua Naturale", price: 1.0, stock: 50 },
    { id: "4", name: "Coca Cola", price: 2.0, stock: 20 },
  ]);

  // Caricamento storico locale persistente
  useEffect(() => {
    const localHistory = localStorage.getItem("merenda_hub_history");
    if (localHistory) {
      try {
        setHistory(JSON.parse(localHistory));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const saveHistory = (newHistory: Order[]) => {
    setHistory(newHistory);
    localStorage.setItem("merenda_hub_history", JSON.stringify(newHistory));
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      items: cart.map(c => ({ product_id: c.product.id, quantity: c.quantity })),
      total,
      date: new Date().toISOString(),
      status: "In elaborazione"
    };
    saveHistory([newOrder, ...history]);
    setCart([]);
    setActiveTab("storico");
  };

  const verifyAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    // Password di default: admin123
    if (adminPassword === "admin123") {
      setIsAdmin(true);
      setAdminPassword("");
    } else {
      alert("Password errata");
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 md:pt-20 bg-black text-gray-200">
      
      {/* Navbar (Sticky bottom on mobile, Top on desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-yellow-600/30 md:top-0 md:bottom-auto md:border-t-0 md:border-b md:border-neutral-800">
        <ul className="flex justify-around items-center p-3 max-w-4xl mx-auto">
          <NavItem active={activeTab === "landing"} onClick={() => setActiveTab("landing")} icon={<Home size={24} />} label="Home" />
          <NavItem active={activeTab === "ordina"} onClick={() => setActiveTab("ordina")} icon={<Search size={24} />} label="Ordina" />
          <NavItem active={activeTab === "storico"} onClick={() => setActiveTab("storico")} icon={<History size={24} />} label="Storico" />
          <NavItem active={activeTab === "chi-siamo"} onClick={() => setActiveTab("chi-siamo")} icon={<Info size={24} />} label="Idea" />
          <NavItem active={activeTab === "admin"} onClick={() => setActiveTab("admin")} icon={<Lock size={24} />} label="Admin" />
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full p-4 md:p-8 animate-in fade-in duration-500">
        
        {/* LANDING TAB: The Hero Page */}
        {activeTab === "landing" && (
          <div className="flex flex-col items-center justify-center text-center space-y-8 py-12 md:py-24">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(202,138,4,0.4)] mb-4 animate-pulse">
              <ShoppingBag size={64} className="text-black" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">
              Merenda Hub
            </h1>
            <p className="text-xl text-gray-400 max-w-lg">
              L'esperienza premium per ordinare la tua merenda a scuola, senza attese.
            </p>
            <button 
              onClick={() => setActiveTab("ordina")}
              className="px-8 py-4 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-400 transition transform hover:scale-105 shadow-[0_0_20px_rgba(202,138,4,0.3)]">
              Inizia l'Ordine
            </button>
          </div>
        )}

        {/* ORDINA TAB: Real-time search and Cart */}
        {activeTab === "ordina" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-yellow-500">Menù</h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-500" />
              <input 
                type="text" 
                placeholder="Cerca il tuo prodotto..." 
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-500 transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-neutral-900 flex justify-between flex-col p-5 rounded-2xl border border-neutral-800 hover:border-yellow-500/50 transition">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">Disponibili: {product.stock}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-yellow-500 text-xl font-bold">€{product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="p-3 bg-neutral-800 hover:bg-yellow-500 hover:text-black rounded-xl transition shadow-lg"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="fixed bottom-20 md:bottom-6 left-0 right-0 max-w-4xl mx-auto px-4 z-40">
                <div className="bg-neutral-800 border border-yellow-500/30 p-4 rounded-2xl shadow-2xl flex justify-between items-center animate-in content-show">
                  <div className="text-yellow-500 font-bold">
                    {cart.reduce((sym, item) => sym + item.quantity, 0)} articoli selezionati
                  </div>
                  <button onClick={handleCheckout} className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 shadow-[0_0_15px_rgba(202,138,4,0.3)]">
                    Checkout (€{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)})
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STORICO TAB: Device-specific order history */}
        {activeTab === "storico" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-yellow-500">I Miei Ordini</h2>
            {history.length === 0 ? (
              <p className="text-gray-500 italic p-6 bg-neutral-900 border border-neutral-800 rounded-xl text-center">Nessun ordine effettuato finora su questo dispositivo.</p>
            ) : (
              <div className="space-y-4">
                {history.map(order => (
                  <div key={order.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-3">
                      <span className="text-sm font-mono bg-black px-2 py-1 rounded text-gray-400">ID: #{order.id}</span>
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${order.status === 'Completato' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-gray-400">
                        <div className="mb-1">{new Date(order.date).toLocaleDateString()} - {new Date(order.date).toLocaleTimeString()}</div>
                        <div>Quantità: {order.items.reduce((s, i) => s + i.quantity, 0)} prodotti</div>
                      </div>
                      <div className="text-2xl font-bold text-yellow-500">€{order.total.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHI SIAMO TAB */}
        {activeTab === "chi-siamo" && (
          <div className="space-y-8 text-center py-12 md:py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-900 rounded-full mb-4">
              <Info size={40} className="text-yellow-500" />
            </div>
            <h2 className="text-4xl font-bold text-white">L'Idea</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
              Merenda Hub rivoluziona la pausa scolastica. Non più code interminabili ai distributori o alla mensa. 
              Scegli dal tuo telefono, prenota in pochi secondi, e goditi il tuo break. Un'esperienza total black, elegante e senza compromessi.
            </p>
          </div>
        )}

        {/* ADMIN TAB: Secure Area */}
        {activeTab === "admin" && (
          <div className="space-y-6">
            {!isAdmin ? (
              <div className="max-w-md mx-auto mt-12 bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-yellow-500/10 rounded-full">
                    <Lock size={32} className="text-yellow-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-8">Accesso Riservato</h2>
                <form onSubmit={verifyAdmin} className="space-y-4">
                  <input 
                    type="password" 
                    placeholder="Inserisci password admin" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-black border border-neutral-700 rounded-xl p-4 text-white focus:border-yellow-500 transition focus:ring-1 focus:ring-yellow-500"
                  />
                  <button type="submit" className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-yellow-500 transition">
                    Verifica Identità
                  </button>
                  <p className="text-xs text-center text-neutral-600 mt-4">Hint: admin123</p>
                </form>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                  <h2 className="text-2xl font-bold text-yellow-500">Dashboard Inventario</h2>
                  <button onClick={() => setIsAdmin(false)} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-lg text-gray-300 hover:text-white hover:bg-neutral-700 transition">
                    <LogOut size={18} /> Esci
                  </button>
                </div>
                
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/50 text-gray-400 text-sm">
                          <th className="p-4 font-semibold">Prodotto</th>
                          <th className="p-4 font-semibold">Prezzo</th>
                          <th className="p-4 font-semibold">Giacenza</th>
                          <th className="p-4 font-semibold text-right">Azioni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product.id} className="border-t border-neutral-800/50 hover:bg-neutral-800/20">
                            <td className="p-4 font-medium text-white">{product.name}</td>
                            <td className="p-4 text-yellow-500">€{product.price.toFixed(2)}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs ${product.stock > 10 ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}`}>
                                {product.stock} pz
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button className="text-neutral-500 hover:text-red-500 p-2 transition"><Trash2 size={18} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-neutral-900 border-t border-neutral-800">
                     <button className="w-full p-4 border-2 border-dashed border-neutral-700 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:bg-neutral-800 hover:text-yellow-500 hover:border-yellow-500 transition cursor-pointer">
                      <Plus size={20} /> Aggiungi Nuovo Prodotto
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

// Custom Nav Component
function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <li 
      onClick={onClick}
      className={`flex flex-col items-center p-2 cursor-pointer transition-all duration-300 ${active ? "text-yellow-500 transform -translate-y-1" : "text-gray-500 hover:text-gray-300"}`}
    >
      <div className={`mb-1 transition-transform duration-300 ${active ? "scale-110 drop-shadow-[0_0_8px_rgba(202,138,4,0.8)]" : "scale-100"}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-semibold tracking-wide uppercase ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
    </li>
  );
}
