import React from 'react';

const SUGGESTIONS = [
  "Explain this error",
  "Optimize my code",
  "Dry run this logic",
  "Give me a hint"
];

interface QuickActionChipsProps {
  onSelect: (prompt: string) => void;
}

export const QuickActionChips: React.FC<QuickActionChipsProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {SUGGESTIONS.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-2 text-sm font-medium transition-colors border rounded-full text-muted-foreground border-border hover:bg-primary/10 hover:text-primary hover:border-primary/50"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};