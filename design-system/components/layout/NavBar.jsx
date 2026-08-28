import React from 'react';
export function NavBar({links=['Comercial','Industrial','Vivienda','Nosotros','Contacto'],tone='light'}) {
  const isLight = tone==='light';
  return React.createElement('nav',{style:{
    display:'flex',alignItems:'center',justifyContent:'space-between',
    padding:'20px clamp(20px,5vw,80px)',background:isLight?'var(--altea-cream)':'var(--altea-ink)',
    fontFamily:'var(--font-body)'
  }},
    React.createElement('img',{src:'assets/logos/altea-logo-' + (isLight?'dark':'light') + '.svg',style:{height:22}}),
    React.createElement('div',{style:{display:'flex',gap:32}},
      links.map((l,i)=>React.createElement('a',{key:i,href:'#',style:{
        color:isLight?'var(--altea-ink)':'var(--altea-cream)',textDecoration:'none',
        fontSize:'var(--text-small)',fontWeight:600,letterSpacing:'var(--tracking-wide)',textTransform:'uppercase'
      }},l))
    )
  );
}
