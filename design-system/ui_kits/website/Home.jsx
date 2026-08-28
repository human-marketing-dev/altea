const { NavBar, Footer, SectionHeading, StatBlock, ProjectCard, Tag, Button, Input } = window.AlteaDesignSystem_4e7511;

function Hero() {
  return React.createElement('section',{style:{position:'relative',minHeight:'88vh',display:'flex',flexDirection:'column'}},
    React.createElement(NavBar,{tone:'dark'}),
    React.createElement('div',{style:{position:'absolute',inset:0,zIndex:0}},
      React.createElement('image-slot',{id:'hero-skyline',placeholder:'Foto de desarrollo Altea',style:{position:'absolute',inset:0}}),
      React.createElement('div',{style:{position:'absolute',inset:0,background:'linear-gradient(180deg,#21222266,#212222cc)'}})
    ),
    React.createElement('div',{style:{position:'relative',zIndex:1,flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 clamp(20px,5vw,80px)',gap:28,maxWidth:900}},
      React.createElement('span',{style:{fontFamily:'var(--font-body)',fontSize:'var(--text-eyebrow)',fontWeight:600,letterSpacing:'var(--tracking-wide)',textTransform:'uppercase',color:'var(--altea-coral)'}},'Inmobiliaria con visión de largo plazo'),
      React.createElement('h1',{style:{margin:0,fontFamily:'var(--font-display)',fontWeight:700,fontSize:'var(--text-display-1)',lineHeight:'var(--leading-display)',letterSpacing:'var(--tracking-tight)',color:'var(--altea-cream)'}},'Proyectos que materializan'),
      React.createElement('p',{style:{margin:0,fontFamily:'var(--font-body)',fontSize:'var(--text-body-lg)',lineHeight:'var(--leading-body)',color:'var(--text-on-dark-secondary)',maxWidth:520}},'Sólida experiencia y una vasta reserva territorial para diseñar y ejecutar proyectos comerciales, industriales y de vivienda a la medida de cualquier necesidad.'),
      React.createElement('div',{style:{display:'flex',gap:16}},
        React.createElement(Button,{variant:'primary',size:'lg'},'Conocer proyectos'),
        React.createElement(Button,{variant:'outline',size:'lg',style:{color:'var(--altea-cream)',borderColor:'var(--border-subtle-on-dark)'}},'Contacto')
      )
    )
  );
}

function UnitsOverview() {
  const units = [
    {key:'comercial',name:'Comercial',logo:'assets/business-units/altea-comercial-color.svg',copy:'Activar la energía de la ciudad en un solo lugar.',stats:[['34','Inmuebles comerciales'],['94%','Tasa de ocupación'],['+3,000,000','Visitantes al mes']]},
    {key:'industrial',name:'Industrial',logo:'assets/business-units/altea-industrial-color.svg',copy:'Desarrollar infraestructura con visión de futuro.',stats:[['1','Aeropuerto internacional'],['Saltillo','Coahuila']]},
    {key:'vivienda',name:'Vivienda',logo:'assets/business-units/altea-vivienda-color.svg',copy:'Crear hogares donde comienza tu historia.',stats:[['+1,181','Hectáreas de terreno'],['+18,000','Árboles plantados al año']]},
  ];
  return React.createElement('section',{style:{padding:'var(--space-9) clamp(20px,5vw,80px)',display:'flex',flexDirection:'column',gap:'var(--space-8)',background:'var(--altea-cream)'}},
    React.createElement(SectionHeading,{eyebrow:'Unidades de negocio',title:'Tres formas de construir ciudad',description:'Cada unidad opera con su propia visión, sobre una misma reserva territorial.'}),
    React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'var(--space-6)'}},
      units.map(u=>React.createElement('a',{key:u.key,href:'#'+u.key,style:{textDecoration:'none',background:'#fff',borderRadius:'var(--radius-lg)',padding:'var(--space-6)',display:'flex',flexDirection:'column',gap:'var(--space-5)',boxShadow:'var(--shadow-card)'}},
        React.createElement('img',{src:u.logo,style:{height:22,alignSelf:'flex-start'}}),
        React.createElement('p',{style:{margin:0,fontFamily:'var(--font-display)',fontSize:'var(--text-h3)',fontWeight:600,color:'var(--altea-ink)'}},u.copy),
        React.createElement('div',{style:{display:'flex',gap:'var(--space-5)',flexWrap:'wrap',marginTop:'auto',paddingTop:'var(--space-4)',borderTop:'1px solid var(--border-subtle)'}},
          u.stats.map((s,i)=>React.createElement(StatBlock,{key:i,value:s[0],label:s[1]}))
        )
      ))
    )
  );
}

function FeaturedProjects() {
  const projects = [
    {image:'proj-paseo-altea',unit:'Comercial',title:'Paseo Altea',location:'Saltillo, Coahuila',stat:'34 locales · 94% ocupación'},
    {image:'proj-parque-industrial',unit:'Industrial',title:'Parque Industrial Altea',location:'Saltillo, Coahuila',stat:'Aeropuerto Internacional de Saltillo'},
    {image:'proj-residencial-altea',unit:'Vivienda',title:'Residencial Altea',location:'Saltillo, Coahuila',stat:'+1,181 hectáreas de reserva'},
  ];
  return React.createElement('section',{style:{padding:'var(--space-9) clamp(20px,5vw,80px)',display:'flex',flexDirection:'column',gap:'var(--space-7)'}},
    React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:16}},
      React.createElement(SectionHeading,{eyebrow:'Portafolio',title:'Proyectos destacados'}),
      React.createElement(Button,{variant:'ghost'},'Ver todos los proyectos')
    ),
    React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'var(--space-6)'}},
      projects.map((p,i)=>React.createElement(ProjectCard,{key:i,...p}))
    )
  );
}

function ImpactBand() {
  return React.createElement('section',{style:{background:'var(--altea-ink)',padding:'var(--space-8) clamp(20px,5vw,80px)',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:'var(--space-7)'}},
    [['+18,000','Árboles sembrados al año'],['+1,181','Hectáreas de terreno'],['840','Hectáreas de superficie de plantación'],['+3,000,000','Visitantes al mes']].map((s,i)=>React.createElement(StatBlock,{key:i,tone:'light',value:s[0],label:s[1]}))
  );
}

function ContactCTA() {
  return React.createElement('section',{style:{padding:'var(--space-9) clamp(20px,5vw,80px)',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'var(--space-6)',flexWrap:'wrap'}},
    React.createElement(SectionHeading,{eyebrow:'Trabajemos juntos',title:'¿Tienes un proyecto en mente?',description:'Cuéntanos sobre tu necesidad y te contactaremos para explorar cómo nuestra reserva territorial puede darle forma.'}),
    React.createElement('div',{style:{display:'flex',gap:16}},React.createElement(Button,{variant:'primary',size:'lg'},'Contáctanos'))
  );
}

function Home() {
  return React.createElement('div',{style:{fontFamily:'var(--font-body)',background:'#fff'}},
    React.createElement(Hero),React.createElement(UnitsOverview),React.createElement(FeaturedProjects),React.createElement(ImpactBand),React.createElement(ContactCTA),React.createElement(Footer)
  );
}

window.Home = Home;
