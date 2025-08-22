import React from 'react';
import { Badge } from '@/components/ui/badge';

interface FilterTab {
  id: string;
  label: string;
  count?: number;
  color?: string;
}

interface ExpenseFilterTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: FilterTab[];
}

const ExpenseFilterTabs: React.FC<ExpenseFilterTabsProps> = ({
  activeTab,
  onTabChange,
  tabs
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
            ${activeTab === tab.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }
          `}
        >
          {tab.label}
          {tab.count !== undefined && (
            <Badge 
              variant={activeTab === tab.id ? 'default' : 'secondary'}
              className="text-xs"
            >
              {tab.count}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
};

export default ExpenseFilterTabs;
