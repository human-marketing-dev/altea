import React from 'react';
export function StatBlock({value,label,tone='ink'}) {
  return React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:4,fontFamily:'var(--font-display)'}},
    React.createElement('div',{style:{fontSize:'clamp(2.25rem,4vw,3.5rem)',fontWeight:700,letterSpacing:'var(--tracking-tight)',color:tone==='light'?'var(--altea-cream)':'var(--altea-ink)',lineHeight:1}},value),
    React.createElement('div',{style:{fontFamily:'var(--font-body)',fontSize:'var(--text-small)',fontWeight:600,letterSpacing:'var(--tracking-wide)',textTransform:'uppercase',color:tone==='light'?'var(--text-on-dark-secondary)':'var(--text-secondary)'}},label)
  );
}
