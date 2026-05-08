import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TemporalNexus = ({ 
  sessions, 
  activeIndex, 
  onSelectSession: _onSelectSession,
  renderContent,
  isZenMode: _isZenMode
}) => {
  
  const layers = useMemo(() => {
    return sessions.map((session, index) => {
      const depth = index - activeIndex;
      const isForeground = depth === 0;
      const _isBackground = depth > 0; // eslint-disable-line no-unused-vars
      const _isPassed = depth < 0; // eslint-disable-line no-unused-vars

      // Z-Axis Logic: Aggressive depth for God-Mode
      const z = depth * -800;
      const opacity = isForeground ? 1 : Math.max(0, 0.9 - Math.abs(depth) * 0.4);
      const blur = isForeground ? 0 : Math.min(32, Math.abs(depth) * 8);
      const scale = isForeground ? 1 : 1 - (Math.abs(depth) * 0.15);

      return {
        id: session.id || index,
        z,
        opacity,
        blur,
        scale,
        isForeground,
        session
      };
    });
  }, [sessions, activeIndex]);

  return (
    <div className="flex-1 relative overflow-hidden nexus-perspective bg-black">
      <AnimatePresence mode="popLayout">
        {layers.map((layer, idx) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, z: -1000 }}
            animate={{ 
              z: layer.z, 
              opacity: layer.opacity,
              scale: layer.scale,
              filter: `blur(${layer.blur}px)`,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            className={`layer-card glass-lamination ${layer.isForeground ? 'z-50 pointer-events-auto' : 'z-0 pointer-events-none'}`}
            style={{ 
              transformStyle: 'preserve-3d',
            }}
          >
            <div className={`h-full w-full overflow-hidden flex flex-col relative ${!layer.isForeground ? 'nexus-pulse' : ''}`}
                 style={{ 
                   background: layer.isForeground ? 'rgba(0,0,0,0.85)' : 'rgba(10,10,10,0.4)',
                   backdropFilter: `blur(${layer.blur}px)`,
                   boxShadow: layer.isForeground ? '0 0 100px rgba(0,255,255,0.05)' : 'none',
                   border: `1px solid ${layer.isForeground ? 'rgba(0,255,255,0.3)' : 'rgba(0,255,255,0.1)'}`
                 }}>
               {/* Metadata Header for background layers */}
               {!layer.isForeground && (
                 <div className="absolute top-8 left-8 z-10 flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                       <div className={`w-3 h-3 rounded-full ${layer.session.isActive ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-blue-500'} animate-pulse`} />
                       <span className="text-[12px] font-black text-white uppercase tracking-[0.2em] bg-blue-900/40 px-3 py-1 rounded-sm border border-blue-500/50 backdrop-blur-md">
                          Stack_{idx} // {layer.session.label}
                       </span>
                    </div>
                    <div className="text-[8px] font-bold text-blue-400/60 ml-6 uppercase">Latency: {layer.session.metrics?.latency || '0'}ms</div>
                 </div>
               )}
               <div className={`flex-1 transition-all duration-700 ${!layer.isForeground ? 'grayscale brightness-50 contrast-125' : ''}`}>
                  {renderContent(layer.session, layer.isForeground)}
               </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TemporalNexus;
