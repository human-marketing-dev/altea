const { NavBar, Footer, SectionHeading, StatBlock, ProjectCard, Tag, Button } = window.AlteaDesignSystem_4e7511;

const UNITS = {
  comercial: {
    name:'Comercial', tagline:'Activar la energía de la ciudad en un solo lugar.',
    logo:'assets/business-units/altea-comercial-color.svg',
    body:'Paseos, puntos y locales comerciales en operación que representan una parte central de la reserva territorial de Altea, integrando hoteles, hospitales y espacios educativos en un mismo entorno urbano.',
    stats:[['34','Inmuebles comerciales'],['94%','Tasa de ocupación'],['+3,000,000','Visitantes al mes']],
    verticals:['Paseos y centros comerciales','Hoteles','Hospital','Educación'],
    projects:[{image:'com-1',title:'Paseo Altea',stat:'34 locales · 94% ocupación'},{image:'com-2',title:'Hotel Altea',stat:'Hospitalidad'},{image:'com-3',title:'Centro Educativo Altea',stat:'Educación'}]
  },
  industrial: {
    name:'Industrial', tagline:'Desarrollar infraestructura con visión de futuro.',
    logo:'assets/business-units/altea-industrial-color.svg',
    body:'Infraestructura de gran escala pensada para décadas, incluyendo el desarrollo del Aeropuerto Internacional de Saltillo como pieza clave de conectividad regional.',
    stats:[['1','Aeropuerto internacional'],['Saltillo','Coahuila, México']],
    verticals:['Parques industriales','Naves industriales','Aeropuerto Internacional de Saltillo'],
    projects:[{image:'ind-1',title:'Aeropuerto Internacional de Saltillo',stat:'Infraestructura aeroportuaria'},{image:'ind-2',title:'Parque Industrial Altea',stat:'Naves industriales'}]
  },
  vivienda: {
    name:'Vivienda', tagline:'Crear hogares donde comienza tu historia.',
    logo:'assets/business-units/altea-vivienda-color.svg',
    body:'Desarrollos residenciales construidos sobre una amplia reserva territorial, con un fuerte compromiso de reforestación y sostenibilidad a largo plazo.',
    stats:[['+1,181','Hectáreas de terreno'],['+18,000','Árboles plantados al año'],['840','Hectáreas de plantación']],
    verticals:['Residencial horizontal','Residencial vertical','Reforestación y sostenibilidad'],
    projects:[{image:'viv-1',title:'Residencial Altea Norte',stat:'Fase 1 en venta'},{image:'viv-2',title:'Residencial Altea Sur',stat:'Próxima entrega'}]
  }
};

function BusinessUnit({unit='comercial'}) {
  const u = UNITS[unit] || UNITS.comercial;
  return React.createElement('div',{style:{fontFamily:'var(--font-body)',background:'#fff'}},
    React.createElement(NavBar,{tone:'light'}),
    React.createElement('section',{style:{padding:'var(--space-9) clamp(20px,5vw,80px) var(--space-8)',background:'var(--altea-cream)',display:'flex',flexDirection:'column',gap:'var(--space-5)'}},
      React.createElement('img',{src:u.logo,style:{height:30,alignSelf:'flex-start'}}),
      React.createElement('h1',{style:{margin:0,fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--text-display-2)',letterSpacing:'var(--tracking-tight)',color:'var(--altea-ink)',maxWidth:760}},u.tagline),
      React.createElement('p',{style:{margin:0,fontSize:'var(--text-body-lg)',lineHeight:'var(--leading-body)',color:'var(--text-secondary)',maxWidth:640}},u.body)
    ),
    React.createElement('section',{style:{display:'flex',gap:'var(--space-7)',padding:'var(--space-7) clamp(20px,5vw,80px)',flexWrap:'wrap',borderBottom:'1px solid var(--border-subtle)'}},
      u.stats.map((s,i)=>React.createElement(StatBlock,{key:i,value:s[0],label:s[1]}))
    ),
    React.createElement('section',{style:{padding:'var(--space-8) clamp(20px,5vw,80px)',display:'flex',flexDirection:'column',gap:'var(--space-5)'}},
      React.createElement(SectionHeading,{eyebrow:'Verticales',title:'Dentro de ' + u.name}),
      React.createElement('div',{style:{display:'flex',gap:12,flexWrap:'wrap'}},u.verticals.map((v,i)=>React.createElement(Tag,{key:i,tone:i===0?'coral':'outline'},v)))
    ),
    React.createElement('section',{style:{padding:'0 clamp(20px,5vw,80px) var(--space-9)',display:'flex',flexDirection:'column',gap:'var(--space-6)'}},
      React.createElement(SectionHeading,{eyebrow:'Portafolio',title:'Proyectos de ' + u.name}),
      React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'var(--space-6)'}},
        u.projects.map((p,i)=>React.createElement(ProjectCard,{key:i,image:p.image,unit:u.name,title:p.title,location:'Saltillo, Coahuila',stat:p.stat}))
      )
    ),
    React.createElement('section',{style:{background:'var(--altea-ink)',padding:'var(--space-8) clamp(20px,5vw,80px)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:24}},
      React.createElement(SectionHeading,{tone:'light',eyebrow:'¿Te interesa ' + u.name + '?',title:'Hablemos de tu próximo proyecto'}),
      React.createElement(Button,{variant:'primary',size:'lg'},'Contáctanos')
    ),
    React.createElement(Footer)
  );
}

window.BusinessUnit = BusinessUnit;
