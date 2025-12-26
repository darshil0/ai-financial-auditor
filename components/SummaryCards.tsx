
import React from 'react';
import { FinancialReport } from '../types';
import { ArrowUpRight, ArrowDownRight, DollarSign, PieChart, TrendingUp, UserCheck } from 'lucide-react';
import { formatCurrency, calculateGrowth } from '../utils';

interface SummaryCardsProps {
  report: FinancialReport;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ report }) => {
  const revGrowth = calculateGrowth(report.revenue, report.revenuePrior);
  const niGrowth = calculateGrowth(report.netIncome, report.netIncomePrior);
  const epsGrowth = calculateGrowth(report.eps, report.epsPrior);

  const cards = [
    {
      label: 'Gross Revenue',
      value: formatCurrency(report.revenue),
      change: revGrowth,
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: 'Net Earnings',
      value: formatCurrency(report.netIncome),
      change: niGrowth,
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      label: 'Diluted EPS',
      value: `$${report.eps.toFixed(2)}`,
      change: epsGrowth,
      icon: UserCheck,
      color: 'violet'
    },
    {
      label: 'Operating Margin',
      value: `${report.operatingMargin.toFixed(1)}%`,
      change: null,
      icon: PieChart,
      color: 'amber'
    }
  ];

  const getColorClasses = (color: string) => {
    const map: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-blue-500/10',
      emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 shadow-emerald-500/10',
      violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 shadow-violet-500/10',
      amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 shadow-amber-500/10'
    };
    return map[color] || map.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 dark:bg-slate-900/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 -z-0"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className={`p-3.5 rounded-2xl shadow-lg ${getColorClasses(card.color)}`}>
              <card.icon size={22} />
            </div>
            {card.change !== null && (
              <div className={`flex items-center gap-0.5 text-xs font-black px-3 py-1.5 rounded-full shadow-sm ${
                card.change >= 0 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
              }`}>
                {card.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(card.change).toFixed(1)}%
              </div>
            )}
          </div>
          
          <div className="relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{card.label}</p>
            <h4 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">{card.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
