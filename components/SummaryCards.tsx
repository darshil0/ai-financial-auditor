
import React from 'react';
import { FinancialReport } from '../types';
import { ArrowUpRight, ArrowDownRight, DollarSign, PieChart, TrendingUp, UserCheck } from 'lucide-react';

interface SummaryCardsProps {
  report: FinancialReport;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ report }) => {
  const revGrowth = ((report.revenue - report.revenuePrior) / report.revenuePrior) * 100;
  const niGrowth = ((report.netIncome - report.netIncomePrior) / report.netIncomePrior) * 100;

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  const cards = [
    {
      label: 'Revenue',
      value: formatCurrency(report.revenue),
      change: revGrowth,
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: 'Net Income',
      value: formatCurrency(report.netIncome),
      change: niGrowth,
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'EPS (Diluted)',
      value: `$${report.eps.toFixed(2)}`,
      change: ((report.eps - report.epsPrior) / report.epsPrior) * 100,
      icon: UserCheck,
      color: 'purple'
    },
    {
      label: 'Operating Margin',
      value: `${report.operatingMargin.toFixed(1)}%`,
      change: null,
      icon: PieChart,
      color: 'amber'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 rounded-xl bg-${card.color}-50 dark:bg-${card.color}-900/20 text-${card.color}-600 dark:text-${card.color}-400`}>
              <card.icon size={20} />
            </div>
            {card.change !== null && (
              <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${
                card.change >= 0 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
              }`}>
                {card.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(card.change).toFixed(1)}%
              </div>
            )}
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
            <h4 className="text-2xl font-bold mt-1 tracking-tight">{card.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
