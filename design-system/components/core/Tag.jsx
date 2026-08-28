import React from 'react';
export function Tag({children,tone='ink'}) {
  const tones = {
    ink:{background:'var(--altea-ink)',color:'var(--altea-cream)'},
    cream:{background:'var(--altea-cream)',color:'var(--altea-ink)'},
    coral:{background:'var(--altea-coral)',color:'#fff'},
    outline:{background:'transparent',color:'var(--altea-ink)',border:'1px solid var(--border-subtle)'}
  };
  return React.createElement('span',{style:{
    ...tones[tone],display:'inline-flex',alignItems:'center',
    fontFamily:'var(--font-body)',fontSize:'var(--text-eyebrow)',fontWeight:600,
    letterSpacing:'var(--tracking-wide)',textTransform:'uppercase',
    padding:'6px 14px',borderRadius:'var(--radius-pill)'
  }},children);
}
