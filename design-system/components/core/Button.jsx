import React from 'react';
const base = {fontFamily:'var(--font-display)',fontWeight:600,border:'none',cursor:'pointer',borderRadius:'var(--radius-pill)',display:'inline-flex',alignItems:'center',gap:8,transition:'background var(--duration-fast) var(--ease-standard),color var(--duration-fast) var(--ease-standard),opacity var(--duration-fast) var(--ease-standard)'};
const sizes = {sm:{fontSize:13,padding:'8px 18px'},md:{fontSize:15,padding:'12px 26px'},lg:{fontSize:16,padding:'16px 34px'}};
const variants = {
  primary:{background:'var(--altea-coral)',color:'#fff'},
  dark:{background:'var(--altea-ink)',color:'var(--altea-cream)'},
  outline:{background:'transparent',color:'var(--altea-ink)',border:'1px solid var(--border-subtle)'},
  ghost:{background:'transparent',color:'var(--altea-ink)',padding:'0',borderRadius:0}
};
const hovers = {
  primary:'var(--altea-coral-dark)',
  dark:'#000',
  outline:'var(--altea-cream)',
  ghost:'transparent'
};
export function Button({children,variant='primary',size='md',disabled,onClick,style}) {
  const [hover,setHover] = React.useState(false);
  const v = variants[variant]||variants.primary;
  const s = variant==='ghost' ? {fontSize:15} : (sizes[size]||sizes.md);
  return React.createElement('button',{
    onClick,disabled,
    onMouseEnter:()=>setHover(true),
    onMouseLeave:()=>setHover(false),
    style:{...base,...s,...v,
      background: hover && !disabled ? hovers[variant] : v.background,
      textDecoration: variant==='ghost' && hover ? 'none':'none',
      color: variant==='ghost' ? (hover?'var(--altea-coral)':v.color) : v.color,
      opacity: disabled?0.4:1,
      cursor: disabled?'not-allowed':'pointer',
      ...style}
  },children, variant==='ghost' && React.createElement('span',{style:{transform:hover?'translateX(3px)':'translateX(0)',transition:'transform var(--duration-fast) var(--ease-standard)'}},'→'));
}
