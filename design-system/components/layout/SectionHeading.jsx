import React from 'react';
export function SectionHeading({eyebrow,title,description,align='left',tone='ink'}) {
  const color = tone==='light'?'var(--altea-cream)':'var(--altea-ink)';
  const sub = tone==='light'?'var(--text-on-dark-secondary)':'var(--text-secondary)';
  return React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:12,textAlign:align,alignItems:align==='center'?'center':'flex-start',maxWidth:640}},
    eyebrow && React.createElement('span',{style:{fontFamily:'var(--font-body)',fontSize:'var(--text-eyebrow)',fontWeight:600,letterSpacing:'var(--tracking-wide)',textTransform:'uppercase',color:'var(--text-accent)'}},eyebrow),
    React.createElement('h2',{style:{margin:0,fontFamily:'var(--font-display)',fontSize:'var(--text-h1)',fontWeight:600,lineHeight:'var(--leading-heading)',color}},title),
    description && React.createElement('p',{style:{margin:0,fontFamily:'var(--font-body)',fontSize:'var(--text-body-lg)',lineHeight:'var(--leading-body)',color:sub}},description)
  );
}
