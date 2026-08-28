import React from 'react';
export function ProjectCard({image,unit,title,location,stat}) {
  const [hover,setHover] = React.useState(false);
  return React.createElement('div',{
    onMouseEnter:()=>setHover(true),onMouseLeave:()=>setHover(false),
    style:{background:'#fff',borderRadius:'var(--radius-md)',overflow:'hidden',
      boxShadow: hover?'var(--shadow-card-hover)':'var(--shadow-card)',
      transform: hover?'translateY(-2px)':'none',
      transition:'box-shadow var(--duration-base) var(--ease-standard),transform var(--duration-base) var(--ease-standard)',
      fontFamily:'var(--font-body)',cursor:'pointer'}
  },
    React.createElement('div',{style:{aspectRatio:'4/3',position:'relative',overflow:'hidden'}},
      React.createElement('image-slot',{id:image,placeholder:title,style:{position:'absolute',inset:0}}),
    ),
    React.createElement('div',{style:{padding:'20px'}},
      React.createElement('span',{style:{fontSize:'var(--text-eyebrow)',fontWeight:600,letterSpacing:'var(--tracking-wide)',textTransform:'uppercase',color:'var(--text-accent)'}},unit),
      React.createElement('div',{style:{fontFamily:'var(--font-display)',fontSize:'var(--text-h3)',fontWeight:600,margin:'6px 0 2px',color:'var(--altea-ink)'}},title),
      React.createElement('div',{style:{fontSize:'var(--text-small)',color:'var(--text-secondary)'}},location),
      stat && React.createElement('div',{style:{marginTop:12,paddingTop:12,borderTop:'1px solid var(--border-subtle)',fontSize:'var(--text-small)',color:'var(--text-secondary)'}},stat)
    )
  );
}
