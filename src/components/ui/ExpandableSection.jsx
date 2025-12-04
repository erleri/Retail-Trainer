import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export default function ExpandableSection({ title, children, defaultOpen = false, icon = null }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full px-4 py-3 flex items-center justify-between font-semibold text-left transition-colors",
          isOpen ? "bg-primary/5 text-primary" : "bg-gray-50 text-gray-900 hover:bg-gray-100"
        )}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="text-sm md:text-base">{title}</span>
        </div>
        <ChevronDown
          size={18}
          className={clsx(
            "transition-transform flex-shrink-0",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>
      
      {isOpen && (
        <div className="px-4 py-4 border-t border-gray-200 bg-white text-sm md:text-base leading-relaxed space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}
