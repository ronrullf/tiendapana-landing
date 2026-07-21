export type RealStore = {
  nombre: string
  categoria: string
  descripcion: string
  url: string
  tag: string
  gradient: string
}

export const realStores: RealStore[] = [
  {
    nombre: "Rinoplays",
    categoria: "Videojuegos digitales",
    descripcion: "Juegos digitales para PS4 y PS5, membresías, alquiler de títulos y gift cards. Todo por WhatsApp.",
    url: "https://rinoplays.com",
    tag: "Gaming",
    gradient: "linear-gradient(135deg, oklch(30% 0.08 280) 0%, oklch(20% 0.06 300) 100%)",
  },
  {
    nombre: "Kabumi",
    categoria: "Cosplay y accesorios femeninos",
    descripcion: "Pelucas, vestidos y joyería pop-culture cuidadosamente seleccionados para cosplayers en Caracas.",
    url: "https://kabumi-tienda.vercel.app",
    tag: "Cosplay",
    gradient: "linear-gradient(135deg, oklch(38% 0.12 340) 0%, oklch(25% 0.08 320) 100%)",
  },
  {
    nombre: "Maderera Amazonas",
    categoria: "Ferretería y aserradero",
    descripcion: "Madera, herramientas y materiales de construcción con su propio dominio .com.",
    url: "https://madereraamazonas.com/",
    tag: "Ferretería",
    gradient: "linear-gradient(135deg, oklch(35% 0.07 60) 0%, oklch(24% 0.05 50) 100%)",
  },
  {
    nombre: "Oh My Derma",
    categoria: "Dermatología",
    descripcion: "Dermatóloga venezolana con más de 20 años de experiencia. Tratamientos reales para acné y cicatrices.",
    url: "https://oh-my-derma-frontend.vercel.app/",
    tag: "Salud",
    gradient: "linear-gradient(135deg, oklch(40% 0.07 200) 0%, oklch(28% 0.05 220) 100%)",
  },
  {
    nombre: "Growth Partner Club",
    categoria: "Growth partner de Instagram",
    descripcion: "Funnel de captación con masterclass para aprender a escalar ventas de negocios online.",
    url: "https://growth-partner-club-funnel.vercel.app/",
    tag: "Educación",
    gradient: "linear-gradient(135deg, oklch(32% 0.06 160) 0%, oklch(22% 0.04 180) 100%)",
  },
  {
    nombre: "Defensa Penal Guirriman",
    categoria: "Abogado penalista · Chile",
    descripcion: "Defensa penal experta 24/7 en Santiago con más de 15 años de experiencia en litigación.",
    url: "https://defensa-penal-guirriman.vercel.app/",
    tag: "Legal",
    gradient: "linear-gradient(135deg, oklch(30% 0.05 250) 0%, oklch(20% 0.04 260) 100%)",
  },
]

export const testimonials = [
  {
    texto: "Pasé de mandar PDF a tener mi tienda con dominio propio. En el primer mes facturé 3x lo de antes.",
    autor: "Tienda de ropa",
    ciudad: "Caracas",
  },
  {
    texto: "Lo que más me gusta: el cliente ya no me pregunta por la tasa. Eso solo me ahorra horas al día.",
    autor: "Tienda de cosméticos",
    ciudad: "Valencia",
  },
  {
    texto: "Fernando me entregó la demo en 2 días. La aprobé y a las 72 horas ya tenía mi .com vendiendo.",
    autor: "Tienda de tecnología",
    ciudad: "Maracaibo",
  },
]
