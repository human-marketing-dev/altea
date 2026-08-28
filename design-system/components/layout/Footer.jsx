import React from 'react';
export function Footer() {
  return React.createElement('footer',{style:{
    background:'var(--altea-ink)',color:'var(--text-on-dark-secondary)',
    padding:'64px clamp(20px,5vw,80px) 32px',fontFamily:'var(--font-body)',
    display:'flex',flexDirection:'column',gap:40
  }},
    React.createElement('div',{style:{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:32}},
      React.createElement('img',{src:'assets/logos/altea-logo-light.svg',style:{height:26}}),
      React.createElement('div',{style:{display:'flex',gap:48,flexWrap:'wrap'}},
        ['Comercial','Industrial','Vivienda'].map((u,i)=>React.createElement('div',{key:i,style:{display:'flex',flexDirection:'column',gap:8}},
          React.createElement('span',{style:{fontSize:'var(--text-small)',fontWeight:600,color:'var(--altea-cream)',textTransform:'uppercase',letterSpacing:'var(--tracking-wide)'}},u),
          React.createElement('a',{href:'#',style:{color:'inherit',textDecoration:'none',fontSize:'var(--text-small)'}},'Proyectos'),
          React.createElement('a',{href:'#',style:{color:'inherit',textDecoration:'none',fontSize:'var(--text-small)'}},'Contacto')
        ))
      )
    ),
    React.createElement('div',{style:{borderTop:'1px solid var(--border-subtle-on-dark)',paddingTop:20,fontSize:'var(--text-small)',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12}},
      React.createElement('span',{},'© ' + new Date().getFullYear() + ' Altea. Todos los derechos reservados.'),
      React.createElement('div',{style:{display:'flex',gap:20}},
        React.createElement('a',{href:'#',style:{color:'inherit',textDecoration:'none'}},'Aviso de privacidad'),
        React.createElement('a',{href:'#',style:{color:'inherit',textDecoration:'none'}},'Términos')
      )
    )
  );
}
