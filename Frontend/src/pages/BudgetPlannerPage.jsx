import React, { useState } from 'react';
import {
  Wallet, DollarSign, PieChart as PieIcon, Plus, Download,
  Bed, Utensils, Bus, ShoppingBag, ArrowUpRight
} from 'lucide-react';

export default function BudgetPlannerPage() {
  const [totalAllocation, setTotalAllocation] = useState(4500);

  const accommodationItems = [
    { name: 'Grand Hotel Excelsior (3 Nights)', cost: 1200 },
    { name: 'Villa Positano Airbnb (2 Nights)', cost: 650 },
    { name: 'City Tax / Resort Fees', cost: 45 },
  ];

  const foodItems = [
    { name: 'Ristorante La Sponda (Dinner)', cost: 320 },
    { name: 'Daily Gelato Allowance', cost: 50 },
    { name: 'Market Provisions (Wine, Cheese)', cost: 115 },
  ];

  const transitItems = [
    { name: 'Ferry: Naples to Sorrento', cost: 85 },
    { name: 'Private Boat Charter (Capri)', cost: 350 },
    { name: 'SITA Bus Tickets', cost: 25 },
  ];

  const subtotalAcc = accommodationItems.reduce((a, b) => a + b.cost, 0);
  const subtotalFood = foodItems.reduce((a, b) => a + b.cost, 0);
  const subtotalTransit = transitItems.reduce((a, b) => a + b.cost, 0);
  const totalExpenditure = subtotalAcc + subtotalFood + subtotalTransit;
  const remainingBalance = totalAllocation - totalExpenditure;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header & Ledger Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Title Description */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#c85a44] uppercase tracking-widest bg-[#fff0ed] px-2.5 py-0.5 rounded-full border border-[#f5c6bc]">
              FISCAL OVERVIEW
            </span>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
              VOL. IV — NEWTOWN, KOLKATA
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heritage font-extrabold text-stone-900 leading-tight">
            Travel Ledger & Expenditures
          </h1>
          <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
            A meticulous accounting of anticipated costs and realized outlays for the upcoming Kolkata excursion. All figures cataloged in INR (₹).
          </p>
        </div>

        {/* Approved Ledger Summary Card */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white border border-[#e2dad0] shadow-sm space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">STATUS</span>
            <span className="text-[10px] font-bold text-[#2b4c30] bg-[#c3dec9] px-2.5 py-0.5 rounded-full border border-[#a8caa7]">
              Approved
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600 font-medium">
              <span>Total Allocation</span>
              <strong className="text-stone-900 font-bold">${totalAllocation.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-stone-600 font-medium">
              <span>Expenditure</span>
              <strong className="text-[#c85a44] font-bold">${totalExpenditure.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between border-t border-[#e2dad0] pt-1.5 font-bold">
              <span className="text-[#c85a44]">Remaining Balance</span>
              <span className="text-[#2b4c30]">${remainingBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ledger List */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Cat 01: Accommodation */}
          <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-4 shadow-sm relative overflow-hidden">
            <div className="w-full h-1 airmail-border absolute top-0 left-0 right-0" />
            <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3 pt-1">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-[#c85a44]" />
                <h3 className="text-lg font-heritage font-extrabold text-stone-900">Accommodation</h3>
              </div>
              <span className="text-[10px] font-bold text-stone-400 uppercase">Cat. 01</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                <span>UTILIZATION</span>
                <span>75%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#f2eee5] overflow-hidden">
                <div className="h-full bg-[#c85a44] w-[75%]" />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {accommodationItems.map((item, i) => (
                <div key={i} className="flex justify-between text-stone-700 font-medium">
                  <span>{item.name}</span>
                  <strong className="text-stone-900 font-bold">${item.cost}</strong>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-[#e2dad0] pt-3 text-xs font-heritage font-extrabold text-[#c85a44]">
              <span>SUBTOTAL</span>
              <span>${subtotalAcc}</span>
            </div>
          </div>

          {/* Cat 02: Food & Provisions */}
          <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-4 shadow-sm relative overflow-hidden">
            <div className="w-full h-1 airmail-border absolute top-0 left-0 right-0" />
            <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3 pt-1">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#c85a44]" />
                <h3 className="text-lg font-heritage font-extrabold text-stone-900">Food & Provisions</h3>
              </div>
              <span className="text-[10px] font-bold text-stone-400 uppercase">Cat. 02</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                <span>UTILIZATION</span>
                <span>42%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#f2eee5] overflow-hidden">
                <div className="h-full bg-[#c85a44] w-[42%]" />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {foodItems.map((item, i) => (
                <div key={i} className="flex justify-between text-stone-700 font-medium">
                  <span>{item.name}</span>
                  <strong className="text-stone-900 font-bold">${item.cost}</strong>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-[#e2dad0] pt-3 text-xs font-heritage font-extrabold text-[#c85a44]">
              <span>SUBTOTAL</span>
              <span>${subtotalFood}</span>
            </div>
          </div>

          {/* Cat 03: Transit */}
          <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-4 shadow-sm relative overflow-hidden">
            <div className="w-full h-1 airmail-border absolute top-0 left-0 right-0" />
            <div className="flex items-center justify-between border-b border-[#e2dad0] pb-3 pt-1">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-[#c85a44]" />
                <h3 className="text-lg font-heritage font-extrabold text-stone-900">Transit & Conveyance</h3>
              </div>
              <span className="text-[10px] font-bold text-stone-400 uppercase">Cat. 03</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                <span>UTILIZATION</span>
                <span>60%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#f2eee5] overflow-hidden">
                <div className="h-full bg-[#c85a44] w-[60%]" />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {transitItems.map((item, i) => (
                <div key={i} className="flex justify-between text-stone-700 font-medium">
                  <span>{item.name}</span>
                  <strong className="text-stone-900 font-bold">${item.cost}</strong>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-t border-[#e2dad0] pt-3 text-xs font-heritage font-extrabold text-[#c85a44]">
              <span>SUBTOTAL</span>
              <span>${subtotalTransit}</span>
            </div>
          </div>

        </div>

        {/* Distribution Donut Chart Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white border border-[#e2dad0] space-y-5 shadow-sm text-center">
            <h3 className="text-xl font-heritage font-extrabold text-stone-900 text-left">Distribution</h3>

            {/* Circular Donut Diagram matching Google Stitch */}
            <div className="w-36 h-36 rounded-full border-8 border-[#c85a44] border-t-amber-400 border-r-emerald-500 flex flex-col items-center justify-center mx-auto my-2 shadow-sm bg-[#faf8f5]">
              <span className="text-[10px] font-bold text-stone-400 uppercase">TOTAL</span>
              <span className="text-xl font-heritage font-extrabold text-stone-900">${(totalExpenditure/1000).toFixed(1)}k</span>
            </div>

            {/* Breakdown Legend */}
            <div className="space-y-2 text-left text-xs font-medium text-stone-700 pt-2 border-t border-[#e2dad0]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#c85a44]" /> Accommodation
                </span>
                <strong className="text-stone-900 font-bold">66%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Food & Provisions
                </span>
                <strong className="text-stone-900 font-bold">17%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Transit
                </span>
                <strong className="text-stone-900 font-bold">16%</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button className="w-full py-2.5 rounded-xl bg-[#c85a44] text-white font-bold text-xs hover:bg-[#a54431] transition-colors shadow-sm flex items-center justify-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>RECORD EXPENSE</span>
              </button>

              <button className="w-full py-2.5 rounded-xl bg-[#f2eee5] border border-[#e2dad0] text-stone-800 font-bold text-xs hover:bg-[#e6e0d4] transition-colors flex items-center justify-center gap-1.5">
                <Download className="w-4 h-4 text-stone-600" />
                <span>EXPORT LEDGER</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
