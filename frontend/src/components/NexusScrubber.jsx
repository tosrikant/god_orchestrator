// NexusScrubber - Z-Axis Navigation HUD
import { motion } from 'framer-motion';
import { Layers, ChevronUp, ChevronDown } from 'lucide-react';

const NexusScrubber = ({ 
  total, 
  active, 
  onChange,
  sessions
}) => {
  return (
    <div className="fixed right-0 top-14 bottom-0 w-16 bg-black/40 border-l border-cyan-500/30 flex flex-col items-center py-6 gap-8 shrink-0 z-[200] backdrop-blur-xl">
      <div className="text-blue-500 opacity-50">
        <Layers className="w-5 h-5" />
      </div>
      
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-1 relative group">
        {/* Scrubber Line */}
        <div className="absolute h-[80%] w-[1px] bg-slate-800 left-1/2 -translate-x-1/2" />
        
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className="relative z-10 w-8 h-8 flex items-center justify-center group/btn"
          >
            <motion.div 
              animate={{ 
                scale: active === i ? 1.8 : 1,
                backgroundColor: active === i ? '#3b82f6' : '#1e293b',
                boxShadow: active === i ? '0 0 15px #3b82f6' : '0 0 0px transparent'
              }}
              whileHover={{ scale: 2.2, backgroundColor: '#60a5fa' }}
              className={`w-2.5 h-2.5 rounded-full border border-slate-700 transition-shadow`}
            />
            
            {/* Tooltip on hover */}
            <div className="absolute right-full mr-4 px-2 py-1 bg-blue-600 text-[9px] font-bold text-white rounded opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity whitespace-nowrap uppercase tracking-widest border border-blue-400 shadow-lg z-[200]">
               {sessions[i]?.label || `Stack_${i}`}
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
         <button 
           disabled={active === 0}
           onClick={() => onChange(active - 1)}
           className="p-2 text-slate-500 hover:text-blue-400 disabled:opacity-20 transition-colors"
         >
            <ChevronUp className="w-4 h-4" />
         </button>
         <button 
           disabled={active === total - 1}
           onClick={() => onChange(active + 1)}
           className="p-2 text-slate-500 hover:text-blue-400 disabled:opacity-20 transition-colors"
         >
            <ChevronDown className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};

export default NexusScrubber;
