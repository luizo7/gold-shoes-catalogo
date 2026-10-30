// =============================================================
//  COMO COMPRAR / COTIZAR
// =============================================================
// Editable sin tocar el HTML. "FORMAS_DE_COTIZAR" son las 3 maneras en
// que un cliente puede pedir algo. "PASOS_DE_COMPRA" es el proceso paso
// a paso una vez que ya eligio que quiere.
// =============================================================
const FORMAS_DE_COTIZAR = [
  {
    icono: "catalogo",
    titulo: "Por el catalogo",
    descripcion: "Navega este catalogo online, eleg\u00ed la marca, el modelo y el color que mas te guste.",
  },
  {
    icono: "whatsapp",
    titulo: "Foto por WhatsApp",
    descripcion: "Mandanos una foto del tenis que quer\u00e9s (de internet, de un amigo, de donde sea) y te decimos si lo conseguimos y a cu\u00e1nto sale.",
  },
  {
    icono: "descripcion",
    titulo: "Describilo vos",
    descripcion: "Contanos la marca, el estilo y el color que busc\u00e1s por WhatsApp, y te armamos opciones a tu medida.",
  },
];

const PASOS_DE_COMPRA = [
  {
    icono: "elegir",
    titulo: "Eleg\u00eds el modelo",
    descripcion: "Por cat\u00e1logo, foto o descripci\u00f3n -- la forma que prefieras.",
  },
  {
    icono: "cotizar",
    titulo: "Te armamos la cotizaci\u00f3n",
    descripcion: "Precio final en colones, tallas disponibles y tiempo estimado de entrega.",
  },
  {
    icono: "pagar",
    titulo: "Adelant\u00e1s el 50%",
    descripcion: "Coordinamos la forma de pago (SINPE, transferencia, etc) y adelant\u00e1s el 50% para iniciar tu pedido.",
  },
  {
    icono: "entrega",
    titulo: "Entrega en tu casa",
    descripcion: "Te llevamos el pedido hasta la puerta. Pag\u00e1s el 50% restante contra entrega.",
  },
];

// =============================================================
//  DATA DEL CATALOGO - GOLD SHOES
// =============================================================
// Como agregar una foto real a un modelo:
//   1. Poné la imagen dentro de la carpeta /images
//      (nombre sugerido: marca-modelo.jpg, ej: adidas-stan-smith.jpg)
//   2. Cambiá el campo "img" de ese modelo por la ruta,
//      ej: img: "images/adidas-stan-smith.jpg"
//   3. Guardá y recargá la pagina (F5). Listo, no hay que tocar nada mas.
//
// Como agregar precio y tallas:
//   Llená los campos "precio" (numero, en colones o la moneda que uses)
//   y "tallas" (texto libre, ej: "25-30" o "US 7-11").
//
// Los modelos con  sugerido: true  son propuestas de Ziggy (no estaban
// en tu lista original). Si no te sirven, borrá el objeto completo o
// poné sugerido: false para que dejen de verse marcados.
// =============================================================

// =============================================================
//  CONFIG DEL NEGOCIO
// =============================================================
// Cambia "numero" por tu numero real de WhatsApp Business,
// con codigo de pais, SIN simbolos ni espacios.
// Ejemplo Costa Rica: 50688887777  (506 + tu numero de 8 digitos)
// =============================================================
const CONFIG = {
  whatsappNumero: "50683133132",
  mensajeBase: "Hola! Vi el catalogo de Gold Shoes y quiero consultar por:",

  // --- CALCULADORA DE PRECIOS ---
  // tipoCambio: cuantos colones vale 1 dolar. Cambialo cuando quieras.
  tipoCambio: 500,
  // margenPorcentaje: cuanto queres ganar sobre (costo + envio). 30 = 30%.
  margenPorcentaje: 30,
  // envioColones: costo fijo de envio en colones, SE SUMA POR CADA PAR.
  // Si tu envio es por pedido completo y no por par, avisale a Ziggy para
  // cambiar la formula.
  envioColones: 10000,
  // precioMinimo: ningun tenis se vende por debajo de este precio en colones,
  // sin importar que tan barato salga el calculo (piso de precio).
  precioMinimo: 60000,
  // ajusteTallaEstandar: muchos precios de referencia que conseguimos son de
  // tallas sueltas/raras (que salen mas baratas en reventa). Las tallas que
  // de verdad se piden mas -- 8.5 y 9 US hombre -- cuestan mas. No pudimos
  // verificar precios en vivo por talla (StockX/GOAT bloquean el acceso
  // automatizado), asi que aplicamos este colchon razonable. Ajustalo si
  // conseguis datos reales de tu proveedor.
  ajusteTallaEstandar: 1.15,
  // topeSobreElMasBarato: cuando un modelo tiene colores/colorways con
  // costos muy distintos entre si, en vez de mostrar el promedio "pelado"
  // (que puede salir carisimo si hay una edicion de lujo rara) se usa el
  // promedio PERO nunca mas de este % por encima del colorway mas barato.
  // 0.3 = 30%.
  topeSobreElMasBarato: 0.3,
};

// =============================================================
//  CALCULADORA DE PRECIO FINAL
// =============================================================
// Como usarla: a cada modelo en CATALOGO agregale el campo "costoUSD"
// con lo que te cuesta el par en dolares, ej:
//   { nombre: "Stan Smith", costoUSD: 45, img: null, precio: null, tallas: "" }
// El precio final en colones se calcula solo con esta formula:
//   (costoUSD * tipoCambio + envioColones) * (1 + margenPorcentaje / 100)
//
// Si en vez de costoUSD preferis fijar el precio final a mano, llena el
// campo "precio" directamente y ese valor manda (ignora el calculo).
// =============================================================
function calcularPrecioFinal(modelo) {
  if (modelo.precio) return modelo.precio; // precio fijado a mano gana siempre

  const costoUSD = obtenerCostoBaseUSD(modelo);
  if (!costoUSD) return null; // no hay info suficiente todavia

  const costoAjustado = costoUSD * CONFIG.ajusteTallaEstandar;
  const costoColones = costoAjustado * CONFIG.tipoCambio;
  const conEnvio = costoColones + CONFIG.envioColones;
  const conMargen = conEnvio * (1 + CONFIG.margenPorcentaje / 100);
  const redondeado = Math.round(conMargen / 100) * 100; // a la centena mas cercana
  return Math.max(redondeado, CONFIG.precioMinimo); // nunca por debajo del piso
}

// Si el modelo tiene varios colorways, el costo "representativo" no es ni
// el minimo (subestima, un colorway barato no es LA norma) ni el promedio
// pelado (un colorway de lujo rarisimo puede inflar todo) -- es el
// promedio, pero topado a un maximo de +30% sobre el mas barato.
// Las tallas de nino (esNino: true) NUNCA entran en este promedio --
// no son representativas de lo que paga un cliente adulto.
function obtenerCostoBaseUSD(modelo) {
  if (Array.isArray(modelo.colorways) && modelo.colorways.length > 0) {
    const costos = modelo.colorways
      .filter((c) => !c.esNino)
      .map((c) => c.costoUSD)
      .filter(Boolean);
    if (!costos.length) return modelo.costoUSD;

    const masBarato = Math.min(...costos);
    const promedio = costos.reduce((suma, c) => suma + c, 0) / costos.length;
    const tope = masBarato * (1 + CONFIG.topeSobreElMasBarato);
    return Math.min(promedio, tope);
  }
  return modelo.costoUSD;
}

function linkWhatsapp(modelo, marca) {
  const texto = encodeURIComponent(`${CONFIG.mensajeBase} ${marca} ${modelo}`);
  return `https://wa.me/${CONFIG.whatsappNumero}?text=${texto}`;
}

// =============================================================
//  LINEAS DE NEGOCIO
// =============================================================
// Cada marca en CATALOGO lleva  linea: "premium"  o  linea: "clasica".
// Si queres mover una marca de linea, solo cambia ese valor abajo.
// =============================================================
const LINEAS = {
  premium: {
    nombre: "Linea Premium",
    descripcion: "Marcas status / aspiracionales: Jordan, Nike, Adidas, New Balance, Hoka, On, Puma, Asics.",
  },
  clasica: {
    nombre: "Linea Clasica",
    descripcion: "Marcas accesibles, de alta rotacion: Vans, Converse, Skechers.",
  },
};

// =============================================================
//  COMPRAS REALIZADAS (fotos reales de lo que ya trajiste)
// =============================================================
// Esto le demuestra al cliente que tus productos son reales y que
// de verdad los traes/importas (respalda el "100% originales").
//
// COMO AGREGAR UNA FOTO (pasos exactos):
//   1. Copia el archivo de la foto dentro de la carpeta /images
//      (click derecho en la foto -> Copiar, andate a la carpeta
//      images, click derecho -> Pegar). Nombrala simple, ej:
//      compra-01.jpg
//   2. Copia uno de los renglones de ejemplo de abajo, pegalo
//      dentro de los corchetes [ ] de COMPRAS_REALIZADAS, y
//      cambia el texto por los datos reales de esa foto.
//   3. Guarda el archivo y recarga la pagina (F5).
//
// Si la lista queda vacia [], esa seccion simplemente no aparece
// en la pagina (no rompe nada).
// =============================================================
const COMPRAS_REALIZADAS = [
  // Copia este renglon y pegalo abajo para cada foto nueva:
  // { modelo: "Stan Smith", marca: "Adidas", img: "images/compra-01.jpg", comentario: "Traido directo de fabrica, 100% original", fecha: "2026-10-28" },
  { modelo: "Samba OG", marca: "Adidas", img: "images/compras/1.jpg", comentario: "Entregado con caja y etiqueta FIFA original" },
  { modelo: "Slide (confirmar modelo exacto)", marca: "Adidas", img: "images/compras/2.jpg", comentario: "Entregado con caja original" },
  { modelo: "Gazelle Bold", marca: "Adidas", img: "images/compras/5.jpg", comentario: "Colorway Cream/Tan -- entregado con caja" },
  { modelo: "Gazelle Bold", marca: "Adidas", img: "images/compras/8.jpg", comentario: "Colorway Blanco/Negro -- entregado 100% original" },
];

const CATALOGO = [
  {
    marca: "Adidas",
    linea: "premium",
    modelos: [
      {
        nombre: "Stan Smith", img: "images/adidas-stan-smith.png", precio: null, tallas: "",
        costoUSD: 50, precioVaria: true,
        colorways: [
          { nombre: "Dime White Green", img: "images/colorways/stan-smith-dime-white-green.png", costoUSD: 50 },
          { nombre: "Ash Silver", img: "images/colorways/stan-smith-ash-silver.png", costoUSD: 50 },
          { nombre: "CLOT x Edison Chen Night Navy", img: "images/colorways/stan-smith-clot-edison-chen.png", costoUSD: 50 },
          { nombre: "White Blue Bird (W)", img: "images/colorways/stan-smith-white-blue-bird.png", costoUSD: 50 },
          { nombre: "White Red (W)", img: "images/colorways/stan-smith-white-red.png", costoUSD: 65 },
          { nombre: "Cloud White Almost Yellow", img: "images/colorways/stan-smith-cloud-white-yellow.png", costoUSD: 66 },
          { nombre: "White Green (OG)", img: "images/colorways/stan-smith-white-green-og.png", costoUSD: 65 },
        ],
      },
      {
        nombre: "Superstar", img: "images/adidas-superstar.png", precio: null, tallas: "",
        costoUSD: 50, precioVaria: true,
        colorways: [
          { nombre: "Off White Core Black (W)", img: "images/colorways/superstar-off-white-core-black.png", costoUSD: 50 },
          { nombre: "Bold Wonder White (W)", img: "images/colorways/superstar-bold-wonder-white.png", costoUSD: 50 },
          { nombre: "Superstar II Valentine's Day 2026", img: "images/colorways/superstar-valentines-2026.png", costoUSD: 50 },
          { nombre: "Vintage Croc Fox Brown", img: "images/colorways/superstar-vintage-croc-brown.png", costoUSD: 52 },
          { nombre: "Snakeskin Stripes White", img: "images/colorways/superstar-snakeskin-stripes-white.png", costoUSD: 54 },
          { nombre: "White Core Black", img: "images/colorways/superstar-white-core-black.png", costoUSD: 54 },
        ],
      },
      {
        nombre: "Campus", img: "images/adidas-campus.png", precio: null, tallas: "",
        costoUSD: 29, precioVaria: true,
        colorways: [
          { nombre: "Crystal White Core Black (W)", img: "images/colorways/campus-crystal-white-core-black.png", costoUSD: 29 },
          { nombre: "80s Norse Projects Layers", img: "images/colorways/campus-norse-projects-layers.png", costoUSD: 29 },
          { nombre: "Trefoil Pulse Yellow (W)", img: "images/colorways/campus-trefoil-pulse-yellow.png", costoUSD: 30 },
          { nombre: "Warm Clay (W)", img: "images/colorways/campus-warm-clay.png", costoUSD: 30 },
          { nombre: "Wonder Cargo Clay (W)", img: "images/colorways/campus-wonder-cargo-clay.png", costoUSD: 49 },
          { nombre: "Pink Spark Core Black (W)", img: "images/colorways/campus-pink-spark-core-black.png", costoUSD: 50 },
          { nombre: "Camp Grey One Green Off White", img: "images/colorways/campus-camp-grey-green-off-white.png", costoUSD: 50 },
          { nombre: "Alumina Off White Collegiate Green", img: "images/colorways/campus-alumina-collegiate-green.png", costoUSD: 50 },
        ],
      },
      {
        nombre: "Gazelle", img: "images/adidas-gazelle.png", precio: null, tallas: "",
        costoUSD: 110, precioVaria: true,
        colorways: [
          { nombre: "Terrace Arsenal F.C.", img: "images/colorways/gazelle-terrace-arsenal.png", costoUSD: 110 },
          { nombre: "85 Supplier Colour", img: "images/colorways/gazelle-85-supplier-colour.png", costoUSD: 110 },
          { nombre: "size? Exclusive Navy Blue", img: "images/colorways/gazelle-exclusive-navy-blue.png", costoUSD: 110 },
          { nombre: "Peru", img: "images/colorways/gazelle-peru.png", costoUSD: 110 },
        ],
      },
      {
        nombre: "Gazelle Bold", img: "images/adidas-gazelle-bold.png", precio: null, tallas: "",
        costoUSD: 37, precioVaria: true,
        colorways: [
          { nombre: "Bold Ash Green (W)", img: "images/colorways/gazelle-bold-ash-green.png", costoUSD: 38 },
          { nombre: "Bold Magic Beige Collegiate Green", img: "images/colorways/gazelle-bold-magic-beige-green.png", costoUSD: 37 },
          { nombre: "Indoor Bright Yellow Collegiate Burgundy", img: "images/colorways/gazelle-bold-indoor-yellow-burgundy.png", costoUSD: 37 },
          { nombre: "Bold Grey White (W)", img: "images/colorways/gazelle-bold-grey-white.png", costoUSD: 37 },
        ],
      },
      {
        nombre: "Spezial", img: "images/adidas-spezial.png", precio: null, tallas: "",
        costoUSD: 35, precioVaria: true,
        colorways: [
          { nombre: "Olive Strata Cream White", img: "images/colorways/spezial-olive-strata-cream-white.png", costoUSD: 121 },
          { nombre: "Scarlet Gum", img: "images/colorways/spezial-scarlet-gum.png", costoUSD: 68 },
          { nombre: "Light Blue", img: "images/colorways/spezial-light-blue.png", costoUSD: 38 },
          { nombre: "Wonder White Black", img: "images/colorways/spezial-wonder-white-black.png", costoUSD: 75 },
          { nombre: "Preloved Green", img: "images/colorways/spezial-preloved-green.png", costoUSD: 41 },
          { nombre: "FIFA World Cup 2026 Mexico", img: "images/colorways/spezial-fifa-world-cup-mexico.png", costoUSD: 35 },
          { nombre: "FIFA World Cup 2026 Germany", img: "images/colorways/spezial-fifa-world-cup-germany.png", costoUSD: 36 },
          { nombre: "Maroon Cream White", img: "images/colorways/spezial-maroon-cream-white.png", costoUSD: 69 },
        ],
      },
      {
        nombre: "Samba", img: "images/adidas-samba.png", precio: null, tallas: "",
        costoUSD: 37, precioVaria: true,
        colorways: [
          { nombre: "OG Cloud White Core Black", img: "images/colorways/samba-og-cloud-white-core-black.png", costoUSD: 45 },
          { nombre: "OG Black White Gum", img: "images/colorways/samba-og-black-white-gum.png", costoUSD: 37 },
          { nombre: "OG Molly-Mae Matcha (W)", img: "images/colorways/samba-og-molly-mae-matcha.png", costoUSD: 133 },
          { nombre: "OG Rhinestone Black Silver", img: "images/colorways/samba-og-rhinestone-black-silver.png", costoUSD: 68 },
          { nombre: "Samba Jane Black Off White (W)", img: "images/colorways/samba-jane-black-off-white.png", costoUSD: 110 },
          { nombre: "OG Aurora Coffee Cream White", img: "images/colorways/samba-og-aurora-coffee-cream.png", costoUSD: 110 },
          { nombre: "OG Cloud White Collegiate Green Gum", img: "images/colorways/samba-og-cloud-white-green-gum.png", costoUSD: 110 },
          { nombre: "OG White Sky Blue", img: "images/colorways/samba-og-white-sky-blue.png", costoUSD: 110 },
        ],
      },
      { nombre: "PureChill", img: null, precio: null, tallas: "" },
      { nombre: "Adizero", img: null, precio: null, tallas: "" },
    ],
  },
  {
    marca: "Air Jordan",
    linea: "premium",
    modelos: [
      {
        nombre: "Jordan 1", img: "images/jordan-1.png", precio: null, tallas: "",
        costoUSD: 30, precioVaria: true,
        colorways: [
          { nombre: "Access Black Gym Red White", img: "images/colorways/jordan1-access-black-gym-red-white.png", costoUSD: 30 },
          { nombre: "Mid White University Gold (W)", img: "images/colorways/jordan1-mid-white-university-gold.png", costoUSD: 30 },
          { nombre: "Mid Reverse Bred (2021) (GS - talla nino)", img: "images/colorways/jordan1-mid-reverse-bred.png", costoUSD: 30, esNino: true },
          { nombre: "Mid SE Orange Suede (GS - talla nino)", img: "images/colorways/jordan1-mid-se-orange-suede.png", costoUSD: 32, esNino: true },
          { nombre: "Low White Cannon (W)", img: "images/colorways/jordan1-low-white-cannon.png", costoUSD: 100 },
          { nombre: "Low Concord", img: "images/colorways/jordan1-low-concord.png", costoUSD: 120 },
          { nombre: "Retro Low OG Medium Olive (PS - talla nino)", img: "images/colorways/jordan1-retro-low-og-medium-olive.png", costoUSD: 58, esNino: true },
        ],
      },
      { nombre: "Jordan 2", img: "images/jordan-2.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Retro OG Chicago (2022)", img: "images/colorways/jordan2-og-chicago.png", costoUSD: 75 },
        { nombre: "Retro J Balvin", img: "images/colorways/jordan2-j-balvin.png", costoUSD: 60 },
        { nombre: "Retro Black Cement", img: "images/colorways/jordan2-black-cement.png", costoUSD: 113 },
        { nombre: "Retro A Ma Maniere Airness", img: "images/colorways/jordan2-a-ma-maniere.png", costoUSD: 67 },
      ] },
      { nombre: "Jordan 3", img: "images/jordan-3.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Retro True Blue (2026)", img: "images/colorways/jordan3-true-blue.png", costoUSD: 149 },
        { nombre: "Retro OG Black Cement (2024)", img: "images/colorways/jordan3-og-black-cement.png", costoUSD: 184 },
        { nombre: "Retro White Cement Reimagined", img: "images/colorways/jordan3-white-cement-reimagined.png", costoUSD: 116 },
        { nombre: "Retro World's Best Dad", img: "images/colorways/jordan3-worlds-best-dad.png", costoUSD: 108 },
      ] },
      { nombre: "Jordan 4", img: "images/jordan-4.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Retro Toro Bravo (2026)", img: "images/colorways/jordan4-toro-bravo.png", costoUSD: 161 },
        { nombre: "Retro Black Cat (2025)", img: "images/colorways/jordan4-black-cat.png", costoUSD: 309 },
        { nombre: "Retro Rare Air Tour Yellow (2026)", img: "images/colorways/jordan4-rare-air-tour-yellow.png", costoUSD: 144 },
        { nombre: "Retro White Cement (2025)", img: "images/colorways/jordan4-white-cement.png", costoUSD: 200 },
      ] },
      { nombre: "Jordan 5", img: "images/jordan-5.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Retro Halloween", img: "images/colorways/jordan5-halloween.png", costoUSD: 173 },
        { nombre: "Retro Black University Blue (2026)", img: "images/colorways/jordan5-black-university-blue.png", costoUSD: 203 },
        { nombre: "Retro Wolf Grey (2026)", img: "images/colorways/jordan5-wolf-grey.png", costoUSD: 245 },
        { nombre: "Retro OG Black Metallic Reimagined", img: "images/colorways/jordan5-og-black-metallic.png", costoUSD: 327 },
      ] },
      { nombre: "Jordan 6", img: "images/jordan-6.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Retro Infrared White (2026)", img: "images/colorways/jordan6-infrared-white.png", costoUSD: 178 },
        { nombre: "Retro Infrared Salesman", img: "images/colorways/jordan6-infrared-salesman.png", costoUSD: 145 },
        { nombre: "Retro Awake NY Midnight Navy", img: "images/colorways/jordan6-awake-ny-midnight-navy.png", costoUSD: 200 },
        { nombre: "Retro Oreo (2026)", img: "images/colorways/jordan6-oreo.png", costoUSD: 120 },
      ] },
      { nombre: "Jordan 7", img: "images/jordan-7.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Retro Miro (2026)", img: "images/colorways/jordan7-miro.png", costoUSD: 147 },
        { nombre: "Retro Cardinal (2022)", img: "images/colorways/jordan7-cardinal.png", costoUSD: 110 },
        { nombre: "Retro Tennis Day", img: "images/colorways/jordan7-tennis-day.png", costoUSD: 89 },
        { nombre: "Retro Citrus (2022)", img: "images/colorways/jordan7-citrus.png", costoUSD: 115 },
      ] },
      { nombre: "Jordan 8", img: "images/jordan-8.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Retro Chrome (2026)", img: "images/colorways/jordan8-chrome.png", costoUSD: 177 },
        { nombre: "Retro White True Red (2025)", img: "images/colorways/jordan8-white-true-red.png", costoUSD: 149 },
        { nombre: "Retro Aqua (2025)", img: "images/colorways/jordan8-aqua.png", costoUSD: 228 },
        { nombre: "Retro Chrome (2026) (GS - talla nino)", img: "images/colorways/jordan8-chrome-gs.png", costoUSD: 116, esNino: true },
      ] },
      { nombre: "Jordan 9", img: "images/jordan-9.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Retro OG Space Jam (2026)", img: "images/colorways/jordan9-og-space-jam.png", costoUSD: 191 },
        { nombre: "Retro Flint Grey French Blue (2026)", img: "images/colorways/jordan9-flint-grey-french-blue.png", costoUSD: 102 },
        { nombre: "Retro OG Space Jam (2026) (GS - talla nino)", img: "images/colorways/jordan9-og-space-jam-gs.png", costoUSD: 129, esNino: true },
        { nombre: "Retro Low What The Kilroy", img: "images/colorways/jordan9-low-what-the-kilroy.png", costoUSD: 107 },
      ] },
      { nombre: "Jordan 12", img: "images/jordan-12.png", precio: null, tallas: "", costoUSD: 152 },
      { nombre: "Jordan 13", img: "images/jordan-13.png", precio: null, tallas: "", costoUSD: 133 },
    ],
  },
  {
    marca: "New Balance",
    linea: "premium",
    modelos: [
      {
        nombre: "9060", img: "images/nb-9060.png", precio: null, tallas: "",
        costoUSD: 92, precioVaria: true,
        colorways: [
          { nombre: "Bisque Sea Salt", img: "images/colorways/nb9060-bisque-sea-salt.png", costoUSD: 122 },
          { nombre: "Mushroom Timberwolf", img: "images/colorways/nb9060-mushroom-timberwolf.png", costoUSD: 120 },
          { nombre: "Black Cement", img: "images/colorways/nb9060-black-cement.png", costoUSD: 105 },
          { nombre: "Sea Salt White", img: "images/colorways/nb9060-sea-salt-white.png", costoUSD: 92 },
        ],
      },
      {
        nombre: "1000", img: "images/nb-1000.png", precio: null, tallas: "",
        costoUSD: 53, precioVaria: true,
        colorways: [
          { nombre: "Arid Stone", img: "images/colorways/nb1000-arid-stone.png", costoUSD: 53 },
          { nombre: "Black Cement", img: "images/colorways/nb1000-black-cement.png", costoUSD: 92 },
        ],
      },
      {
        nombre: "2002R", img: "images/nb-2002r.png", precio: null, tallas: "",
        costoUSD: 92, precioVaria: true,
        colorways: [
          { nombre: "Protection Pack Phantom", img: "images/colorways/nb2002r-protection-pack-phantom.png", costoUSD: 106 },
          { nombre: "Protection Pack Sea Salt", img: "images/colorways/nb2002r-protection-pack-sea-salt.png", costoUSD: 92 },
        ],
      },
      { nombre: "574", img: null, precio: null, tallas: "" },
      {
        nombre: "990", img: "images/nb-990.png", precio: null, tallas: "",
        costoUSD: 105, precioVaria: true,
        colorways: [
          { nombre: "990v6 MiUSA Teddy Santis Reflection", img: "images/colorways/nb990-teddy-santis-reflection.png", costoUSD: 107 },
          { nombre: "990v6 MiUSA Community Navy", img: "images/colorways/nb990-community-navy.png", costoUSD: 105 },
        ],
      },
      { nombre: "327", img: null, precio: null, tallas: "" },
      { nombre: "530", img: null, precio: null, tallas: "", sugerido: true },
      {
        nombre: "550", img: "images/nb-550.png", precio: null, tallas: "",
        costoUSD: 52, precioVaria: true, sugerido: true,
        colorways: [
          { nombre: "White Grey", img: "images/colorways/nb550-white-grey.png", costoUSD: 52 },
          { nombre: "Sea Salt Quartz Pink Astro Dust", img: "images/colorways/nb550-sea-salt-quartz-pink.png", costoUSD: 59 },
        ],
      },
      {
        nombre: "204L", img: "images/nb-204l.png", precio: null, tallas: "",
        costoUSD: 53, precioVaria: true, sugerido: true,
        colorways: [
          { nombre: "Pastel Pink", img: "images/colorways/nb204l-pastel-pink.png", costoUSD: 53 },
          { nombre: "Year of the Horse White", img: "images/colorways/nb204l-year-of-horse-white.png", costoUSD: 59 },
        ],
      },
      { nombre: "237", img: "images/nb-237.png", precio: null, tallas: "", costoUSD: 54, sugerido: true },
      { nombre: "57/40", img: "images/nb-5740.png", precio: null, tallas: "", costoUSD: 59, sugerido: true },
      { nombre: "1906A", img: "images/nb-1906a.png", precio: null, tallas: "", costoUSD: 119, sugerido: true },
      { nombre: "1906R", img: "images/nb-1906r.png", precio: null, tallas: "", costoUSD: 92, sugerido: true },
      { nombre: "993", img: "images/nb-993.png", precio: null, tallas: "", costoUSD: 117, sugerido: true },
    ],
  },
  {
    marca: "Nike",
    linea: "premium",
    modelos: [
      { nombre: "Air Force", img: "images/nike-air-force.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Low '07 White", img: "images/colorways/nikeaf-low07-white.png", costoUSD: 72 },
        { nombre: "Low Supreme White", img: "images/colorways/nikeaf-low-supreme-white.png", costoUSD: 105 },
        { nombre: "Low '01 NIGO x J-Hope", img: "images/colorways/nikeaf-low01-nigo-jhope.png", costoUSD: 138 },
        { nombre: "Low '07 Black", img: "images/colorways/nikeaf-low07-black.png", costoUSD: 71 },
      ] },
      { nombre: "Air Max", img: "images/nike-air-max.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Air Max 95 Premium Houseflies", img: "images/colorways/nikeam-95-premium-houseflies.png", costoUSD: 134 },
        { nombre: "Air Max Plus Drift All Day", img: "images/colorways/nikeam-plus-drift-all-day.png", costoUSD: 120 },
        { nombre: "Air Max 1 SC Dark Stucco", img: "images/colorways/nikeam-1-sc-dark-stucco.png", costoUSD: 130 },
      ] },
      { nombre: "Blazer", img: "images/nike-blazer.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Low 77 Jumbo White Black Sail", img: "images/colorways/nikeblazer-low77-jumbo-white-black-sail.png", costoUSD: 80 },
        { nombre: "Mid 77 Vintage Summit White Pink", img: "images/colorways/nikeblazer-mid77-vintage-summit-white-pink.png", costoUSD: 70 },
        { nombre: "SB Blazer Mid QS Supreme Black", img: "images/colorways/nikeblazer-sb-mid-qs-supreme-black.png", costoUSD: 70 },
        { nombre: "Low sacai KAWS Purple Dusk", img: "images/colorways/nikeblazer-low-sacai-kaws-purple-dusk.png", costoUSD: 54 },
      ] },
      { nombre: "Dunk", img: "images/nike-dunk.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Low Retro QS Halloween Skull", img: "images/colorways/nikedunk-low-retro-qs-halloween-skull.png", costoUSD: 65 },
        { nombre: "SB Dunk Low Arts-Rec", img: "images/colorways/nikedunk-sb-low-arts-rec.png", costoUSD: 85 },
        { nombre: "Dunk High Wu-Tang (2024)", img: "images/colorways/nikedunk-high-wu-tang-2024.png", costoUSD: 93 },
        { nombre: "SB Dunk Low Court Purple", img: "images/colorways/nikedunk-sb-low-court-purple.png", costoUSD: 100 },
      ] },
      { nombre: "Cortez", img: "images/nike-cortez.png", precio: null, tallas: "", precioVaria: true, colorways: [
        { nombre: "Forrest Gump (2024)", img: "images/colorways/nikecortez-forrest-gump.png", costoUSD: 56 },
        { nombre: "Basic Black White (2023)", img: "images/colorways/nikecortez-basic-black-white.png", costoUSD: 53 },
        { nombre: "White Black", img: "images/colorways/nikecortez-white-black.png", costoUSD: 52 },
        { nombre: "Baroque Brown (W)", img: "images/colorways/nikecortez-baroque-brown.png", costoUSD: 73 },
      ] },
    ],
  },
  {
    marca: "Hoka",
    linea: "premium",
    modelos: [
      { nombre: "Bondi", img: null, precio: null, tallas: "" },
      { nombre: "Clifton", img: null, precio: null, tallas: "" },
      { nombre: "Primo", img: null, precio: null, tallas: "" },
      { nombre: "Tor Ultra", img: null, precio: null, tallas: "" },
    ],
  },
  {
    marca: "On",
    linea: "premium",
    modelos: [
      { nombre: "Cloud X3", img: null, precio: null, tallas: "" },
      { nombre: "Cloud 5", img: null, precio: null, tallas: "" },
      { nombre: "Cloudmonster", img: null, precio: null, tallas: "" },
      { nombre: "Cloudnova", img: null, precio: null, tallas: "" },
      { nombre: "Cloudtilt", img: null, precio: null, tallas: "" },
    ],
  },
  {
    marca: "Puma",
    linea: "premium",
    modelos: [
      { nombre: "Forum", img: null, precio: null, tallas: "" },
      { nombre: "Future", img: null, precio: null, tallas: "" },
      { nombre: "King", img: null, precio: null, tallas: "" },
      { nombre: "LaMelo Ball", img: null, precio: null, tallas: "" },
      { nombre: "Speedcat", img: null, precio: null, tallas: "" },
      { nombre: "Ultra", img: null, precio: null, tallas: "" },
      { nombre: "Suede", img: null, precio: null, tallas: "" },
    ],
  },

  // -------- SUGERENCIAS DE ZIGGY (marcas nuevas, no estaban en tu lista) --------
  {
    marca: "Asics",
    sugerido: true,
    linea: "premium",
    modelos: [
      { nombre: "Gel-1130", img: null, precio: null, tallas: "", sugerido: true },
      { nombre: "Gel-Kayano 14", img: null, precio: null, tallas: "", sugerido: true },
      { nombre: "Gel-NYC", img: null, precio: null, tallas: "", sugerido: true },
    ],
  },
  {
    marca: "Vans",
    sugerido: true,
    linea: "clasica",
    modelos: [
      { nombre: "Old Skool", img: null, precio: null, tallas: "", sugerido: true },
      { nombre: "Sk8-Hi", img: null, precio: null, tallas: "", sugerido: true },
      { nombre: "Authentic", img: null, precio: null, tallas: "", sugerido: true },
    ],
  },
  {
    marca: "Converse",
    sugerido: true,
    linea: "clasica",
    modelos: [
      { nombre: "Chuck Taylor All Star", img: null, precio: null, tallas: "", sugerido: true },
      { nombre: "Chuck 70", img: null, precio: null, tallas: "", sugerido: true },
    ],
  },
  {
    marca: "Skechers",
    sugerido: true,
    linea: "clasica",
    modelos: [
      { nombre: "Max Cushioning", img: null, precio: null, tallas: "", sugerido: true },
      { nombre: "D'Lites", img: null, precio: null, tallas: "", sugerido: true },
      { nombre: "Go Walk", img: null, precio: null, tallas: "", sugerido: true },
    ],
  },
];
