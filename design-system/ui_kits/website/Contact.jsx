const { NavBar, Footer, SectionHeading, Input, Button } = window.AlteaDesignSystem_4e7511;

function Contact() {
  const [sent,setSent] = React.useState(false);
  return React.createElement('div',{style:{fontFamily:'var(--font-body)',background:'#fff'}},
    React.createElement(NavBar,{tone:'light'}),
    React.createElement('section',{style:{padding:'var(--space-9) clamp(20px,5vw,80px)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-8)',background:'var(--altea-cream)',alignItems:'start'}},
      React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:'var(--space-5)'}},
        React.createElement(SectionHeading,{eyebrow:'Contacto',title:'Hablemos de tu proyecto',description:'Ya sea comercial, industrial o de vivienda, cuéntanos qué necesitas y te contactaremos a la brevedad.'}),
        React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:8,fontSize:'var(--text-body)',color:'var(--text-secondary)'}},
          React.createElement('span',{},'ventas@altea.mx'),
          React.createElement('span',{},'Saltillo, Coahuila, México')
        )
      ),
      React.createElement('form',{onSubmit:(e)=>{e.preventDefault();setSent(true);},style:{background:'#fff',borderRadius:'var(--radius-lg)',padding:'var(--space-6)',display:'flex',flexDirection:'column',gap:'var(--space-4)',boxShadow:'var(--shadow-card)'}},
        sent ? React.createElement('p',{style:{margin:0,fontFamily:'var(--font-display)',fontWeight:600,fontSize:'var(--text-h3)',color:'var(--altea-ink)'}},'Gracias — te contactaremos pronto.') :
        React.createElement(React.Fragment,{},
          React.createElement(Input,{label:'Nombre',placeholder:'Tu nombre'}),
          React.createElement(Input,{label:'Correo electrónico',type:'email',placeholder:'tu@correo.com'}),
          React.createElement(Input,{label:'Unidad de interés',placeholder:'Comercial, Industrial o Vivienda'}),
          React.createElement(Input,{label:'Mensaje',as:'textarea',placeholder:'Cuéntanos sobre tu proyecto'}),
          React.createElement(Button,{variant:'primary',size:'lg',style:{alignSelf:'flex-start'}},'Enviar mensaje')
        )
      )
    ),
    React.createElement(Footer)
  );
}

window.Contact = Contact;
