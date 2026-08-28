import React from 'react';
export function Input({label,placeholder,type='text',as='input'}) {
  const [focused,setFocused] = React.useState(false);
  const Tag = as==='textarea' ? 'textarea' : 'input';
  return React.createElement('label',{style:{display:'flex',flexDirection:'column',gap:6,fontFamily:'var(--font-body)'}},
    label && React.createElement('span',{style:{fontSize:'var(--text-small)',fontWeight:600,color:'var(--text-secondary)'}},label),
    React.createElement(Tag,{
      type, placeholder,
      onFocus:()=>setFocused(true), onBlur:()=>setFocused(false),
      rows: as==='textarea'?4:undefined,
      style:{
        fontFamily:'var(--font-body)',fontSize:'var(--text-body)',color:'var(--altea-ink)',
        background:'#fff',border:`1px solid ${focused?'var(--altea-ink)':'var(--border-subtle)'}`,
        borderRadius:'var(--radius-sm)',padding:'12px 14px',outline:'none',
        transition:'border-color var(--duration-fast) var(--ease-standard)',resize:'vertical'
      }
    })
  );
}
