import React, {useEffect, useRef} from 'react'
import {createRoot} from 'react-dom/client'
import {createRootRoute, createRoute, createRouter, RouterProvider, Outlet, Link} from '@tanstack/react-router'
const h=React.createElement
const config=JSON.parse(document.querySelector('#presentation').textContent)
const base='/'+config.slug
function Presentation(){
  return h(React.Fragment,null,
    h('iframe',{className:'deck',title:config.title,src:base+'/content'+location.hash,allowFullScreen:true}),
    h('footer',null,h('address',null,'Crème de Papier · 10 route de Galice, 13100 Aix-en-Provence'),
      h('a',{href:'tel:+33618017247'},'+33 6 18 01 72 47'),
      h('a',{href:'mailto:contact@cremedepapier.fr'},'contact@cremedepapier.fr'),
      h('a',{href:'https://www.instagram.com/cremedepapier/',target:'_blank',rel:'noreferrer'},'Instagram ↗'),
      ...config.documents.map(d=>h(Link,{key:d.id,to:'/$slug/document/$id',params:{slug:config.slug,id:d.id}},d.label))),
    h(Outlet))
}
function DocumentView(){
  const {id}=documentRoute.useParams()
  const doc=config.documents.find(d=>d.id===id)
  const ref=useRef(null)
  useEffect(()=>{if(doc)ref.current.showModal()},[doc])
  const close=()=>router.navigate({to:'/$slug',params:{slug:config.slug}})
  if(!doc)return null
  return h('dialog',{ref,onCancel:close},h('header',null,h('strong',null,doc.label),h('button',{onClick:close,'aria-label':config.lang==='en'?'Close':'Fermer'},'×')),
    h('iframe',{title:doc.label,src:base+'/pdf/'+id}),h('a',{href:base+'/pdf/'+id,target:'_blank',rel:'noreferrer'},config.lang==='en'?'Open PDF ↗':'Ouvrir le PDF ↗'))
}
const root=createRootRoute({component:Outlet})
const presentation=createRoute({getParentRoute:()=>root,path:'/$slug',component:Presentation})
const documentRoute=createRoute({getParentRoute:()=>presentation,path:'document/$id',component:DocumentView})
const router=createRouter({routeTree:root.addChildren([presentation.addChildren([documentRoute])])})
createRoot(document.querySelector('#app')).render(h(RouterProvider,{router}))
