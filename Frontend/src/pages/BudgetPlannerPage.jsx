import React, { useState, useEffect } from 'react';
import {
  Wallet, IndianRupee, PieChart as PieIcon, Plus, Download,
  Bed, Utensils, Bus, ShoppingBag, ShieldCheck, Sparkles, Trash2, ArrowUpRight, CheckCircle2
} from 'lucide-react';
import { budgetService } from '../services/api';

const DEFAULT_BUDGET_TIERS = {
  Budget:   { accommodation: 0.30, food: 0.25, transit: 0.20, activities: 0.15, shopping: 0.05, emergency: 0.05 },
  Moderate: { accommodation: 0.35, food: 0.25, transit: 0.15, activities: 0.15, shopping: 0.06, emergency: 0.04 },
  Luxury:   { accommodation: 0.45, food: 0.25, transit: 0.10, activities: 0.12, shopping: 0.05, emergency: 0.03 },
};

export default function BudgetPlannerPage() {
  // Configurable Parameters
  const [totalAllocation, setTotalAllocation] = useState(35000);
  const [travelers, setTravelers] = useState(2);
  const [duration, setDuration] = useState(4);
  const [budgetTier, setBudgetTier] = useState('Moderate');
  const [loading, setLoading] = useState(false);

  // Dynamic Custom Line Items
  const [customItems, setCustomItems] = useState([
    { id: 1, category: 'Accommodation', name: 'Heritage Boutique Stay (3 Nights)', cost: 12250 },
    { id: 2, category: 'Accommodation', name: 'Eco-Resort Excursion (1 Night)', cost: 3500 },
    { id: 3, category: 'Food', name: 'Iconic Heritage Dining & Cafes', cost: 4800 },
    { id: 4, category: 'Food', name: 'Street Food & Tea/Sweets Allowance', cost: 1800 },
    { id: 5, category: 'Transit', name: 'Metro Tourist Pass & City Ferry', cost: 1200 },
    { id: 6, category: 'Transit', name: 'AC Taxi & Airport Transfers', cost: 3200 },
    { id: 7, category: 'Activities', name: 'Museum Entry & Heritage Monument Pass', cost: 2400 },
    { id: 8, category: 'Shopping', name: 'Artisan Handicrafts & Souvenirs', cost: 1800 },
  ]);

  // Modal / Input State for Adding New Line Item
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Accommodation');
  const [showAddForm, setShowAddForm] = useState(false);

  // AI Savings Tips
  const [aiTips, setAiTips] = useState([
    "Book Metro Tourist Smart Passes to save up to 40% on local city transit.",
    "Opt for certified local heritage eateries over luxury hotel dining for 50% savings on meals.",
    "Visit museums and architectural monuments during early morning hours for combo entry passes.",
    "Stay in boutique heritage stays within 500m of metro stations to eliminate costly cab rides."
  ]);

  // Fetch updated AI budget calculations from backend
  const handleRecalculate = async (budgetVal, travelersVal, durationVal, tierVal) => {
    setLoading(true);
    try {
      const res = await budgetService.calculate({
        totalBudget: budgetVal || totalAllocation,
        travelers: travelersVal || travelers,
        duration: durationVal || duration,
        budgetType: tierVal || budgetTier,
      });
      if (res.data.success && res.data.optimizationTips) {
        setAiTips(res.data.optimizationTips);
      }
    } catch (e) {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  const handleAllocationChange = (val) => {
    const num = Number(val) || 0;
    setTotalAllocation(num);
    handleRecalculate(num, travelers, duration, budgetTier);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemCost) return;

    const item = {
      id: Date.now(),
      category: newItemCategory,
      name: newItemName.trim(),
      cost: Number(newItemCost) || 0
    };

    setCustomItems(prev => [item, ...prev]);
    setNewItemName('');
    setNewItemCost('');
    setShowAddForm(false);
  };

  const handleDeleteItem = (id) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
  };

  // Grouped Costs
  const getSubtotal = (cat) => customItems.filter(i => i.category === cat).reduce((acc, curr) => acc + curr.cost, 0);

  const subtotalAcc = getSubtotal('Accommodation');
  const subtotalFood = getSubtotal('Food');
  const subtotalTransit = getSubtotal('Transit');
  const subtotalActivities = getSubtotal('Activities');
  const subtotalShopping = getSubtotal('Shopping');

  const totalExpenditure = subtotalAcc + subtotalFood + subtotalTransit + subtotalActivities + subtotalShopping;
  const remainingBalance = totalAllocation - totalExpenditure;
  const utilizationPercent = Math.min(100, Math.round((totalExpenditure / (totalAllocation || 1)) * 100));

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header & Ledger Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Title Description */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest bg-[#fff0ed] px-2.5 py-0.5 rounded-full border border-[#f5c6bc]">
              SMART FISCAL ENGINE
            </span>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
              EXPEDITION BUDGET & EXPENSE LOG
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heritage font-extrabold text-stone-900 leading-tight">
            Smart Budget Planner
          </h1>
          <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
            Real-time expense estimator and itemized financial ledger. Dynamically optimizes travel budgets across lodging, dining, transit, and cultural activities in INR (₹).
          </p>
        </div>

        {/* Financial Overview Card */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-[#e2dad0] space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e2dad0] pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
              <IndianRupee className="w-4 h-4 text-[#c85a44]" />
              <span>Financial Ledger</span>
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              {utilizationPercent}% Allocated
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-stone-600 font-medium">
              <span>Total Allocation</span>
              <strong className="text-stone-900 font-bold">₹{totalAllocation.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-stone-600 font-medium">
              <span>Realized Outlay</span>
              <strong className="text-[#c85a44] font-bold">₹{totalExpenditure.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between border-t border-[#e2dad0] pt-2 font-bold">
              <span className={remainingBalance < 0 ? 'text-rose-600' : 'text-[#c85a44]'}>
                {remainingBalance < 0 ? 'Budget Overrun' : 'Remaining Balance'}
              </span>
              <span className={remainingBalance < 0 ? 'text-rose-600 font-extrabold' : 'text-[#2b4c30] font-extrabold'}>
                ₹{remainingBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Control Panel */}
      <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2dad0] pb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#c85a44]" />
            <h2 className="text-lg font-heritage font-extrabold text-stone-900">Budget Parameters</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(p => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#e8a048] to-[#c85a44] text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Close Form' : 'Log Expense'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-stone-700 hover:bg-[#e6e0d4] text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Ledger</span>
            </button>
          </div>
        </div>

        {/* Input Parameters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Budget */}
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Total Budget (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-stone-400 font-bold text-xs">₹</span>
              <input
                type="number"
                min="1000"
                step="500"
                value={totalAllocation}
                onChange={(e) => handleAllocationChange(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e2dad0] text-xs font-bold text-stone-900 focus:outline-none focus:border-[#c85a44]"
              />
            </div>
          </div>

          {/* Travelers */}
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Travelers</label>
            <select
              value={travelers}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTravelers(val);
                handleRecalculate(totalAllocation, val, duration, budgetTier);
              }}
              className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e2dad0] text-xs font-bold text-stone-900 focus:outline-none focus:border-[#c85a44]"
            >
              <option value="1">1 Solo Voyager</option>
              <option value="2">2 Travelers (Duo)</option>
              <option value="4">4 Family / Group</option>
              <option value="6">6 Expedition Crew</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Duration</label>
            <select
              value={duration}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDuration(val);
                handleRecalculate(totalAllocation, travelers, val, budgetTier);
              }}
              className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e2dad0] text-xs font-bold text-stone-900 focus:outline-none focus:border-[#c85a44]"
            >
              <option value="2">2 Days (Weekend Getaway)</option>
              <option value="3">3 Days (Long Weekend)</option>
              <option value="4">4 Days (Standard Tour)</option>
              <option value="7">7 Days (Full Week)</option>
              <option value="10">10 Days (Deep Cultural Exploration)</option>
            </select>
          </div>

          {/* Style / Tier */}
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Tier / Style</label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Budget', 'Moderate', 'Luxury'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setBudgetTier(t);
                    handleRecalculate(totalAllocation, travelers, duration, t);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    budgetTier === t
                      ? 'bg-[#c85a44] text-white border-transparent shadow-sm'
                      : 'bg-[#faf8f5] text-stone-600 border-[#e2dad0] hover:bg-[#f2eee5]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Add Expense Form (Collapsible) */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e2dad0] space-y-3">
            <h4 className="text-xs font-bold text-stone-900">Log New Outlay / Expenditure</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Description (e.g. Amber Fort Entry Ticket)"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#c85a44]"
              />
              <div className="relative">
                <span className="absolute left-3 top-2 text-stone-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Amount (e.g. 550)"
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-[#e2dad0] text-xs text-stone-900 focus:outline-none focus:border-[#c85a44]"
                />
              </div>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-[#e2dad0] text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#c85a44]"
              >
                <option value="Accommodation">Accommodation</option>
                <option value="Food">Food & Provisions</option>
                <option value="Transit">Transit & Conveyance</option>
                <option value="Activities">Activities & Sightseeing</option>
                <option value="Shopping">Shopping & Souvenirs</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-[#e2dad0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#c85a44] text-white text-xs font-bold hover:bg-[#b04b36]"
              >
                Add to Ledger
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Itemized Categories List */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Category Helper Renderer */}
          {[
            { cat: 'Accommodation', icon: Bed, subtotal: subtotalAcc, desc: 'Hotels, Eco-Resorts & Homestays' },
            { cat: 'Food', icon: Utensils, subtotal: subtotalFood, desc: 'Heritage Dining, Street Food, Teas' },
            { cat: 'Transit', icon: Bus, subtotal: subtotalTransit, desc: 'Metro Passes, Cabs, Ferries' },
            { cat: 'Activities', icon: Sparkles, subtotal: subtotalActivities, desc: 'Monument Pass, Guided Walks' },
            { cat: 'Shopping', icon: ShoppingBag, subtotal: subtotalShopping, desc: 'Handicrafts, Sweets, Spices' },
          ].map(({ cat, icon: Icon, subtotal, desc }) => {
            const items = customItems.filter(i => i.category === cat);
            const categoryPercent = totalExpenditure > 0 ? Math.round((subtotal / totalExpenditure) * 100) : 0;

            return (
              <div key={cat} className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-4 shadow-sm relative overflow-hidden">
                <div className="w-full h-1 airmail-border absolute top-0 left-0 right-0" />
                
                <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3 pt-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#c85a44]" />
                    <div>
                      <h3 className="text-lg font-heritage font-extrabold text-stone-900">{cat}</h3>
                      <p className="text-[10px] text-stone-400">{desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-stone-500 bg-[#f2eee5] px-2.5 py-1 rounded-full">
                    {categoryPercent}% of Outlay
                  </span>
                </div>

                {/* Line Items */}
                <div className="space-y-2 text-xs">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-stone-700 font-medium group hover:bg-[#faf8f5] p-1.5 rounded-lg transition-colors">
                        <span className="truncate pr-2">{item.name}</span>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <strong className="text-stone-900 font-bold">₹{item.cost.toLocaleString()}</strong>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-600 transition-all"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-stone-400 italic py-1">No custom outlays recorded in this category.</p>
                  )}
                </div>

                {/* Subtotal */}
                <div className="flex justify-between border-t border-[#e2dad0] pt-3 text-xs font-heritage font-extrabold text-[#c85a44]">
                  <span>SUBTOTAL</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
              </div>
            );
          })}

        </div>

        {/* Distribution Donut Chart & AI Recommendations Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Distribution Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-5 shadow-sm text-center">
            <h3 className="text-xl font-heritage font-extrabold text-stone-900 text-left">Allocation Breakdown</h3>

            {/* Circular Donut Diagram */}
            <div className="w-36 h-36 rounded-full border-8 border-[#c85a44] border-t-amber-400 border-r-emerald-500 border-b-blue-400 flex flex-col items-center justify-center mx-auto my-2 shadow-sm bg-[#faf8f5]">
              <span className="text-[10px] font-bold text-stone-400 uppercase">OUTLAY</span>
              <span className="text-lg font-heritage font-extrabold text-stone-900">₹{totalExpenditure.toLocaleString()}</span>
            </div>

            <div className="space-y-2 text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c85a44]" /> Lodging
                </span>
                <strong className="text-stone-900 font-bold">₹{subtotalAcc.toLocaleString()}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Dining & Teas
                </span>
                <strong className="text-stone-900 font-bold">₹{subtotalFood.toLocaleString()}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Transit & Ferry
                </span>
                <strong className="text-stone-900 font-bold">₹{subtotalTransit.toLocaleString()}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Sightseeing Pass
                </span>
                <strong className="text-stone-900 font-bold">₹{subtotalActivities.toLocaleString()}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Souvenirs
                </span>
                <strong className="text-stone-900 font-bold">₹{subtotalShopping.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* AI Optimization Tips Card */}
          <div className="p-6 rounded-3xl bg-[#faf8f5] border border-[#e2dad0] space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#e8a048]" />
              <span className="font-heritage text-sm font-extrabold">Smart Fiscal Hacks</span>
            </div>
            
            <div className="space-y-2.5">
              {aiTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-600 leading-relaxed bg-white p-2.5 rounded-xl border border-[#e2dad0]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2b4c30] flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
