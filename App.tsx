
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Armchair, 
  MapPin, 
  Menu, 
  X, 
  ArrowRight, 
  ChevronDown, 
  Sparkles, 
  Briefcase, 
  Calculator, 
  Globe,
  Phone,
  Mail,
  Loader2,
  Users,
  Search,
  ShoppingCart,
  CheckCircle2,
  Star,
  Zap
} from 'lucide-react';
import { ViewType, PlanningData, AIAdvice } from './types';
import { LOCATIONS, INVENTORY } from './constants';
import { getEventAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [view, setView] = useState<ViewType>(ViewType.HOME); 
  const [currentLocation, setCurrentLocation] = useState<string | null>(null); 
  const [activeTab, setActiveTab] = useState<ViewType>(ViewType.WEDDING);

  // Planning Tool State
  const [guestCount, setGuestCount] = useState(64);
  const [tableType, setTableType] = useState('round60');
  const [eventDesc, setEventDesc] = useState('');
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLocName = () => currentLocation || "North Carolina";
  const getSubText = () => currentLocation ? `in ${currentLocation}, NC` : "across the Raleigh-Durham Area";

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const navigateToLocation = (loc: string | null) => {
    setCurrentLocation(loc);
    setView(ViewType.HOME); 
    setLocationMenuOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAiConsultant = async () => {
    if (!eventDesc) return;
    setIsAiLoading(true);
    try {
      const advice = await getEventAdvice(eventDesc, guestCount, getLocName());
      setAiAdvice(advice);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const planningData = useMemo<PlanningData>(() => {
    const tableCapacities: Record<string, number> = { 'round60': 8, 'round72': 10, 'rect6': 6, 'rect8': 8 };
    const capacityPerTable = tableCapacities[tableType] || 8;
    const count = Math.ceil(guestCount / capacityPerTable);
    const visualCount = Math.min(count, 12); 
    return { 
      tablesNeeded: count, 
      chairsNeeded: guestCount,
      visualCount,
      capacityPerTable,
      isRound: tableType.startsWith('round')
    };
  }, [guestCount, tableType]);

  const Navigation = () => (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-[#0f172a]/95 backdrop-blur-md shadow-2xl py-3 border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer group" onClick={() => navigateToLocation(null)}>
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30 group-hover:rotate-12 transition-transform duration-300">
            <Armchair className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="text-lg md:text-2xl font-black tracking-tighter uppercase whitespace-nowrap">
            Chairs <span className="text-blue-500">R</span> Yours
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 mx-6">
           {[ViewType.WEDDING, ViewType.TRADESHOW, ViewType.PLAN].map((v) => (
             <button 
               key={v}
               onClick={() => { setView(v); window.scrollTo(0,0); }} 
               className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-white ${view === v ? 'text-blue-400' : 'text-zinc-500'}`}
             >
               {v === ViewType.PLAN ? 'AI Planner' : v + 's'}
             </button>
           ))}
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="relative">
            <button onClick={() => setLocationMenuOpen(!locationMenuOpen)} className="text-[11px] font-black uppercase tracking-widest text-zinc-300 hover:text-white flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-full border border-white/5 whitespace-nowrap transition-all hover:bg-white/10">
              <MapPin size={12} className="text-blue-500" />
              {currentLocation || "All NC Locations"} <ChevronDown size={14} className={`transition-transform duration-300 ${locationMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {locationMenuOpen && (
              <div className="absolute top-full right-0 mt-4 w-64 bg-[#1e293b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl p-2 grid grid-cols-1">
                <button onClick={() => navigateToLocation(null)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 text-[10px] font-black uppercase tracking-widest transition-colors">Main Hub (Triangle)</button>
                <div className="h-px bg-white/5 my-1"></div>
                {LOCATIONS.map((loc) => (
                  <button key={loc} onClick={() => navigateToLocation(loc)} className={`w-full text-left px-4 py-3 rounded-xl hover:bg-blue-600 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-between group ${currentLocation === loc ? 'bg-blue-600/20 text-blue-400' : ''}`}>
                    {loc} <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => scrollToSection('inventory')} className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-500 transition-all font-black text-[11px] uppercase tracking-widest whitespace-nowrap shadow-lg shadow-blue-600/20 active:scale-95">Rent Now</button>
        </div>
        
        <button className="lg:hidden p-2 bg-white/5 rounded-lg" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0f172a] z-[200] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <Armchair className="text-blue-600" />
              <span className="font-black uppercase tracking-tighter text-xl">Chairs R Yours</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-full"><X /></button>
          </div>
          <div className="space-y-6 flex-1">
            {[ViewType.HOME, ViewType.WEDDING, ViewType.TRADESHOW, ViewType.PLAN].map((v) => (
              <button key={v} onClick={() => { setView(v); setMobileMenuOpen(false); }} className="block w-full text-left text-3xl font-black uppercase tracking-tighter hover:text-blue-500 transition-colors">{v}</button>
            ))}
          </div>
          <div className="pt-8 border-t border-white/10">
            <p className="text-zinc-500 text-xs font-black uppercase mb-4">Support Line</p>
            <a href="tel:9195550123" className="text-xl font-bold">919-555-0123</a>
          </div>
        </div>
      )}
    </nav>
  );

  const InventoryGrid = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <section id="inventory" className="py-24 bg-[#0f172a] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">{title}</h2>
          <p className="text-zinc-400 font-medium max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {INVENTORY.map((item) => (
            <div key={item.id} className="group relative bg-slate-900/50 rounded-[2rem] border border-white/5 overflow-hidden transition-all hover:-translate-y-2 hover:border-blue-500/30">
              <div className="aspect-square overflow-hidden relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-[#0f172a]/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                  {item.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black uppercase tracking-tight text-xl">{item.name}</h3>
                  <span className="text-blue-400 font-black">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-zinc-500 text-sm mb-6">{item.description}</p>
                <button className="w-full bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2">
                  Add to Cart <ShoppingCart size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const AIPlanningTool = () => (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Seating Layout" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-8xl font-black mb-6 uppercase tracking-tighter">
            Smart Seating <br /><span className="text-blue-500">& AI Consultant</span>
          </h1>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs max-w-2xl mx-auto">
            Professional layout planning powered by Gemini AI for {getSubText()}.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pb-24 grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-slate-900/50 backdrop-blur-md rounded-[3rem] border border-white/5 p-8 md:p-12 shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
              <Users className="text-blue-500" /> Guest Configuration
            </h3>
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-4">Total Attendees</label>
                <div className="flex items-center bg-slate-800/50 rounded-2xl border border-white/5 p-4">
                  <input 
                    type="number" 
                    value={guestCount} 
                    onChange={(e) => setGuestCount(Math.min(1000, parseInt(e.target.value) || 0))}
                    className="bg-transparent text-4xl font-black w-full outline-none text-white"
                  />
                  <div className="h-8 w-px bg-white/10 mx-4" />
                  <span className="text-xs font-black text-blue-500 uppercase whitespace-nowrap">People</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-4">Preferred Seating Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'round60', label: '60" Round', sub: 'Seats 8' },
                    { id: 'round72', label: '72" Round', sub: 'Seats 10' },
                    { id: 'rect6', label: '6ft Utility', sub: 'Seats 6' },
                    { id: 'rect8', label: '8ft Banquet', sub: 'Seats 8' }
                  ].map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => setTableType(t.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${tableType === t.id ? 'bg-blue-600 border-blue-400' : 'bg-slate-800/50 border-white/5 text-zinc-500 hover:bg-slate-800'}`}
                    >
                      <div className="font-black text-xs uppercase text-white mb-1">{t.label}</div>
                      <div className="text-[9px] font-bold opacity-60 italic">{t.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 p-6 bg-slate-800/30 rounded-3xl border border-white/5">
                <div>
                  <p className="text-[9px] font-black uppercase text-blue-400 mb-1">Total Tables</p>
                  <p className="text-3xl font-black">{planningData.tablesNeeded}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-blue-400 mb-1">Total Chairs</p>
                  <p className="text-3xl font-black">{planningData.chairsNeeded}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 text-white relative overflow-hidden group">
            <Zap className="absolute top-10 right-10 w-24 h-24 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">AI Event Consultant</h3>
            <p className="text-white/70 text-sm font-medium mb-8">Describe your event vision below, and our Gemini-powered consultant will suggest a professional equipment strategy.</p>
            <textarea 
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              placeholder="e.g. A rustic summer wedding at a barn venue in Raleigh..."
              className="w-full h-32 bg-white/10 rounded-2xl p-4 placeholder:text-white/30 text-white border border-white/20 focus:outline-none focus:border-white/50 mb-6 font-medium"
            />
            <button 
              onClick={handleAiConsultant}
              disabled={isAiLoading || !eventDesc}
              className="w-full bg-white text-blue-600 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAiLoading ? <Loader2 className="animate-spin" /> : <><Star size={14} /> Generate Strategy</>}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900/50 rounded-[3rem] border border-white/5 p-10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight">Layout Visualization</h3>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live Preview</span>
            </div>
            
            <div className="flex-1 min-h-[400px] bg-[#0f172a] rounded-[2.5rem] border border-white/10 p-12 relative overflow-hidden shadow-inner">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
               <div className="grid grid-cols-2 md:grid-cols-3 gap-16 items-center justify-items-center relative z-10">
                  {Array.from({ length: planningData.visualCount }).map((_, i) => (
                    <div key={i} className="relative w-20 h-20 animate-in zoom-in duration-500">
                       {/* Chairs */}
                       {Array.from({ length: planningData.capacityPerTable }).map((_, j) => {
                          const angle = (j / planningData.capacityPerTable) * 360;
                          const dist = planningData.isRound ? 42 : 36;
                          return (
                            <div 
                              key={j} 
                              className="absolute w-3 h-3 bg-blue-500/30 border border-blue-400/50 rounded shadow-sm"
                              style={{ transform: `rotate(${angle}deg) translateY(-${dist}px)` }}
                            />
                          );
                       })}
                       {/* Table */}
                       <div className={`w-full h-full border-2 border-blue-500 bg-slate-900 shadow-xl flex items-center justify-center ${planningData.isRound ? 'rounded-full' : 'rounded-lg'}`}>
                          <span className="text-[8px] font-black text-blue-400">T{i+1}</span>
                       </div>
                    </div>
                  ))}
               </div>
               {planningData.tablesNeeded > planningData.visualCount && (
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur px-6 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase shadow-xl">
                   + {planningData.tablesNeeded - planningData.visualCount} More Tables Not Shown
                 </div>
               )}
            </div>

            {aiAdvice && (
              <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="p-6 bg-slate-800/40 rounded-3xl border-l-4 border-l-blue-500">
                  <h4 className="text-sm font-black uppercase text-blue-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Expert Recommendation
                  </h4>
                  <p className="text-zinc-400 text-sm italic">"{aiAdvice.layoutStrategy}"</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                    <h5 className="text-[10px] font-black uppercase text-zinc-500 mb-3">Add-on Suggestions</h5>
                    <ul className="space-y-1">
                      {aiAdvice.suggestedAddons.slice(0, 3).map((a, i) => <li key={i} className="text-[11px] font-bold">• {a}</li>)}
                    </ul>
                  </div>
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                    <h5 className="text-[10px] font-black uppercase text-zinc-500 mb-3">Professional Pro-Tip</h5>
                    <p className="text-[11px] font-medium text-blue-300">{aiAdvice.proTip}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const HomeView = () => (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover" alt="Event Rental" />
        </div>
        <div className="relative z-10 w-full text-center px-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Globe className="w-3 h-3" />
            {currentLocation ? `Professional Event Support in ${currentLocation}` : "North Carolina's Premier Rental Network"}
          </div>
          <h1 className="text-5xl md:text-[9rem] font-black mb-10 leading-[0.9] tracking-tighter uppercase animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-500 to-indigo-500">Venue Space.</span>
          </h1>
          <p className="max-w-xl mx-auto text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-16 animate-in fade-in duration-1000 delay-500">
            Premium chair hire, custom table layouts, and luxury event equipment {getSubText()}.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
            <button onClick={() => setView(ViewType.PLAN)} className="bg-white text-[#0f172a] px-10 py-5 rounded-full font-black uppercase tracking-widest text-[11px] flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all group">
              Start Planning <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => scrollToSection('inventory')} className="bg-white/5 border border-white/10 px-10 py-5 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all">
              View Catalog
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <ChevronDown size={32} />
        </div>
      </section>

      <InventoryGrid 
        title={currentLocation ? `${currentLocation} Favorites` : "Our Core Inventory"} 
        subtitle="Selection of our most popular pieces used by top event planners in North Carolina."
      />
    </>
  );

  const WeddingView = () => (
    <div className="animate-in fade-in duration-1000">
      <header className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Wedding Setup" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-10">
            <Sparkles size={14} /> Luxury Bridal Support
          </div>
          <h1 className="text-6xl md:text-9xl font-black mb-10 uppercase tracking-tighter italic">
            {getLocName()} <span className="text-blue-500">Weddings.</span>
          </h1>
          <p className="text-zinc-300 font-bold uppercase tracking-[0.4em] text-xs">Exquisite Furniture for Your Most Special Day {getSubText()}.</p>
        </div>
      </header>
      <InventoryGrid title="Bridal Collection" subtitle="Curated chairs and tables that turn ceremonies into unforgettable experiences." />
    </div>
  );

  const TradeShowView = () => (
    <div className="animate-in fade-in duration-1000">
      <header className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Trade Show" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-10">
            <Briefcase size={14} /> High-Traffic Solutions
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black mb-10 uppercase tracking-tighter leading-none">
            {getLocName()} <br /><span className="text-blue-500">& Corporate Expo.</span>
          </h1>
          <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px] max-w-2xl">
            Professional trade show booths, standard convention seating, and durable equipment for Large-Scale Gatherings {getSubText()}.
          </p>
        </div>
      </header>
      <InventoryGrid title="Corporate & Expo" subtitle="Efficient, modular, and professional-grade infrastructure for your business events." />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30">
      <Navigation />
      
      <main>
        {view === ViewType.HOME && <HomeView />}
        {view === ViewType.WEDDING && <WeddingView />}
        {view === ViewType.TRADESHOW && <TradeShowView />}
        {view === ViewType.PLAN && <AIPlanningTool />}
      </main>

      <footer className="bg-[#0b1120] pt-24 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 pb-20 border-b border-white/5">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigateToLocation(null)}>
                <div className="bg-blue-600 p-2 rounded-xl"><Armchair className="text-white w-6 h-6" /></div>
                <span className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">Chairs <span className="text-blue-500">R</span> Yours</span>
              </div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-sm mb-10 leading-relaxed">
                North Carolina's Premier Partner for Professional Quality Party Rentals, Chair Hire, and Event Decor. Serving the entire Triangle area with local pride.
              </p>
              <div className="flex gap-6">
                <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-blue-600 transition-colors"><Mail size={20} /></a>
                <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-blue-600 transition-colors"><Phone size={20} /></a>
                <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-blue-600 transition-colors"><Globe size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Service Areas</h4>
              <div className="grid grid-cols-1 gap-y-3">
                {LOCATIONS.slice(0, 6).map(l => (
                  <button key={l} onClick={() => navigateToLocation(l)} className="text-[10px] font-bold uppercase text-left text-zinc-500 hover:text-blue-400 transition-colors">{l}, NC</button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Quick Contact</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-blue-500 flex-shrink-0" />
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Triangle Hub<br />Wake Forest, NC 27587</p>
                </div>
                <div className="flex items-start gap-4">
                  <Phone size={18} className="text-blue-500 flex-shrink-0" />
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Support: 919-555-0123<br />24/7 Dispatch Availability</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-zinc-600 uppercase tracking-widest gap-6">
            <div>© {new Date().getFullYear()} Chairs R Yours | North Carolina Event Logistics Group</div>
            <div className="flex gap-10">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Rental Agreement</a>
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
