// =============================================================
//  COMO COMPRAR / COTIZAR
// =============================================================
// Editable sin tocar el HTML. "FORMAS_DE_COTIZAR" son las 3 maneras en
// que un cliente puede pedir algo. "PASOS_DE_COMPRA" es el proceso paso
// a paso una vez que ya eligio que quiere.
// =============================================================
// Cada forma ahora es CLICKEABLE de verdad (antes eran solo 3 tarjetas
// informativas con iconos que parecian botones pero no hacian nada --
// feedback real de usuarios: "dan ganas de tocarlos"). "accion" indica
// que pasa al tocar la tarjeta:
//   - "scroll"   -> baja suave hasta el catalogo (id del elemento en "destino")
//   - "whatsapp" -> abre WhatsApp con un mensaje PRE-ARMADO pero en blanco
//                   para que el cliente complete/adjunte la foto, no un
//                   mensaje generico que hay que borrar primero.
const FORMAS_DE_COTIZAR = [
  {
    icono: "catalogo",
    titulo: "Por el catalogo",
    descripcion: "Navega este catalogo online, eleg\u00ed la marca, el modelo y el color que mas te guste.",
    accion: "scroll",
    destino: "catalogo",
  },
  {
    icono: "foto",
    titulo: "Foto por WhatsApp",
    descripcion: "Mandanos una foto del tenis que quer\u00e9s (de internet, de un amigo, de donde sea) y te decimos si lo conseguimos y a cu\u00e1nto sale.",
    accion: "whatsapp",
    mensaje: "Hola! Te quiero mandar una foto de un tenis que busco \ud83d\udc5f",
  },
  {
    icono: "descripcion",
    titulo: "Describilo vos",
    descripcion: "Contanos la marca, el estilo y el color que busc\u00e1s por WhatsApp, y te armamos opciones a tu medida.",
    accion: "whatsapp",
    mensaje: "Hola! Quiero cotizar un tenis:\nMarca: \nEstilo/Modelo: \nColor: \nTalla: \n",
  },
];

const PASOS_DE_COMPRA = [
  {
    icono: "elegir",
    titulo: "C\u00f3mo ped\u00eds tus tenis",
    descripcion: "Por cat\u00e1logo, foto o descripci\u00f3n -- eleg\u00ed la forma que prefieras arriba.",
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

  // --- FILTRO DE TALLAS ---
  // Sistema US (confirmado por Luis: las fotos/datos de precio por talla
  // vienen de StockX en US). Rango 4-13 en medias tallas, que es el rango
  // adulto tipico. A cada modelo, en el campo "tallas", ponele el rango
  // que ofreces en US, ej: "tallas: \"7-11\"".
  tallasDisponibles: [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13],

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

// Regla de conversion dada por Luis: una talla de Dama (W) equivale a
// 1 numero MENOS en Caballero (M). Ej: 8.5 Dama = 7.5 Caballero.
// OJO: esta regla puede variar segun la marca real (algunos usan -1.5),
// pero se deja asi porque es la que Luis confirmo que usa.
function equivalenteOtroGenero(talla, genero) {
  return genero === 'W' ? talla - 1 : talla + 1;
}

// Para los botones que no tienen un modelo/marca especifico (ej. las 3
// formas de cotizar) -- deja el mensaje tal cual se le pase, en blanco
// para que el cliente lo complete o adjunte una foto, sin tener que
// borrar un mensaje generico primero.
function linkWhatsappTexto(mensaje) {
  return `https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(mensaje)}`;
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
//
// IMPORTANTE: cada objeto de aqui abajo es UNA VENTA/COMPRA REAL, con su
// propio array "fotos" (normalmente 2: una en la caja/etiqueta y otra
// puesta). No repitas la misma venta en 2 objetos separados -- eso hace
// que el catalogo muestre 2 ventas donde en realidad hubo 1 sola.
// =============================================================
const COMPRAS_REALIZADAS = [
  // Copia este renglon y pegalo abajo para cada venta nueva (fotos: 1 o mas):
  // { modelo: "Stan Smith", marca: "Adidas", fotos: ["images/compra-01.jpg"], comentario: "Traido directo de fabrica, 100% original", fecha: "2026-10-28" },
  { modelo: "Samba OG", marca: "Adidas", fotos: ["images/compras/1.jpg", "images/compras/4.jpg"], comentario: "Colorway Blanco/Rojo/Azul marino. Entregado con caja y etiqueta FIFA original, y puesto." },
  { modelo: "Pure Chill", marca: "Adidas", fotos: ["images/compras/2.jpg", "images/compras/3.jpg"], comentario: "Sandalias colorway verde neon. Entregadas con caja original, y puestas." },
  { modelo: "Gazelle Bold (Crema/Beige)", marca: "Adidas", fotos: ["images/compras/5.jpg", "images/compras/7.jpg"], comentario: "Colorway Crema/Beige con rayas azul marino y suela gum (confirmar nombre exacto del colorway). Entregado con caja original, y puesto." },
  { modelo: "Gazelle Bold (Blanco/Negro)", marca: "Adidas", fotos: ["images/compras/6.jpg", "images/compras/8.jpg"], comentario: "Colorway Blanco/Negro con suela gum (confirmar nombre exacto del colorway). Entregado 100% original, puesto y en detalle." },
  { modelo: "Adizero Prime SP", marca: "Adidas", fotos: ["images/compras/9.jpg", "images/compras/10.jpg"], comentario: "Colorway Blanco/Rojo/Amarillo, suela Lightstrike -- 2 angulos del mismo par." },
  { modelo: "Predator Elite FG", marca: "Adidas", fotos: ["images/compras/11.jpg", "images/compras/12.jpg"], comentario: "Entregado con etiqueta original -- incluye detalle de suela Hybridtouch 2.0." },
];

const CATALOGO = [
  {
    marca: "Adidas",
    linea: "premium",
    modelos: [
      {
        nombre: "Stan Smith", img: null, precio: null, tallas: "4-13",
        costoUSD: 50, precioVaria: true,
        colorways: [
          // --- De aqui para abajo: precio REAL por talla exacta, sacado de
          // capturas de StockX (carpeta "fotos Talla"). "g" = genero del
          // listado en StockX (M=Caballero, W=Dama), "t" = talla US,
          // "usd" = precio de referencia en dolares para ESA talla exacta.
          // costoUSD queda como el mas barato de la tabla, solo de respaldo
          // por si algun lugar del sitio todavia pide un precio plano.
          {
            nombre: "Core White New Navy", fotos: ["images/colorways/stan-smith-core-white-new-navy.png", "images/colorways/stan-smith-core-white-new-navy-2.png"], costoUSD: 43,
            tablaTallas: [
              { g: "M", t: 4, usd: 79 }, { g: "M", t: 4.5, usd: 85 }, { g: "M", t: 5, usd: 95 },
              { g: "M", t: 5.5, usd: 91 }, { g: "M", t: 6, usd: 104 }, { g: "M", t: 6.5, usd: 80 },
              { g: "M", t: 7, usd: 93 }, { g: "M", t: 7.5, usd: 50 }, { g: "M", t: 8, usd: 43 },
              { g: "M", t: 8.5, usd: 57 }, { g: "M", t: 9, usd: 68 }, { g: "M", t: 9.5, usd: 60 },
              { g: "M", t: 10, usd: 85 }, { g: "M", t: 10.5, usd: 93 }, { g: "M", t: 11, usd: 64 },
            ],
          },
          {
            nombre: "White Green (OG)", fotos: ["images/colorways/stan-smith-white-green-og.png", "images/colorways/stan-smith-white-green-og-2.png"], costoUSD: 62,
            tablaTallas: [
              { g: "W", t: 4.5, usd: 150 }, { g: "W", t: 5, usd: 70 }, { g: "W", t: 5.5, usd: 70 },
              { g: "W", t: 6, usd: 80 }, { g: "W", t: 6.5, usd: 91 }, { g: "W", t: 7, usd: 88 },
              { g: "W", t: 7.5, usd: 65 }, { g: "W", t: 8, usd: 62 }, { g: "W", t: 8.5, usd: 73 },
              { g: "W", t: 9, usd: 78 }, { g: "W", t: 9.5, usd: 62 }, { g: "W", t: 10, usd: 74 },
              { g: "W", t: 10.5, usd: 89 }, { g: "W", t: 11, usd: 90 }, { g: "W", t: 11.5, usd: 84 },
            ],
          },
          {
            nombre: "Triple White", fotos: ["images/colorways/stan-smith-triple-white.png", "images/colorways/stan-smith-triple-white-2.png"], costoUSD: 40,
            tablaTallas: [
              { g: "W", t: 5, usd: 103 }, { g: "W", t: 5.5, usd: 105 }, { g: "W", t: 6, usd: 153 },
              { g: "W", t: 6.5, usd: 105 }, { g: "W", t: 7, usd: 57 }, { g: "W", t: 7.5, usd: 95 },
              { g: "W", t: 8, usd: 40 }, { g: "W", t: 8.5, usd: 105 }, { g: "W", t: 9, usd: 93 },
              { g: "W", t: 9.5, usd: 84 }, { g: "W", t: 10, usd: 95 }, { g: "W", t: 10.5, usd: 75 },
              { g: "W", t: 11, usd: 76 }, { g: "W", t: 11.5, usd: 105 }, { g: "W", t: 12, usd: 75 },
            ],
          },
          {
            nombre: "Primegreen White Collegiate Navy", fotos: ["images/colorways/stan-smith-primegreen-white-collegiate-navy.png", "images/colorways/stan-smith-primegreen-white-collegiate-navy-2.png"], costoUSD: 57,
            tablaTallas: [
              { g: "M", t: 5, usd: 221 }, { g: "M", t: 5.5, usd: 84 }, { g: "M", t: 6, usd: 140 },
              { g: "M", t: 6.5, usd: 146 }, { g: "M", t: 7, usd: 180 }, { g: "M", t: 7.5, usd: 93 },
              { g: "M", t: 8, usd: 57 }, { g: "M", t: 8.5, usd: 93 }, { g: "M", t: 9, usd: 149 },
              { g: "M", t: 9.5, usd: 168 }, { g: "M", t: 10, usd: 121 }, { g: "M", t: 10.5, usd: 113 },
              { g: "M", t: 11, usd: 184 }, { g: "M", t: 11.5, usd: 209 }, { g: "M", t: 12, usd: 100 },
            ],
          },
          {
            nombre: "Cloud White Gold Metallic Brown (W)", fotos: ["images/colorways/stan-smith-cloud-white-gold-metallic-brown-w.png", "images/colorways/stan-smith-cloud-white-gold-metallic-brown-w-2.png"], costoUSD: 39,
            tablaTallas: [
              // W5 y W10.5 no tenian precio fijo en StockX ("BID"), se omiten.
              { g: "W", t: 5.5, usd: 173 }, { g: "W", t: 6, usd: 172 }, { g: "W", t: 6.5, usd: 82 },
              { g: "W", t: 7, usd: 59 }, { g: "W", t: 7.5, usd: 55 }, { g: "W", t: 8, usd: 82 },
              { g: "W", t: 8.5, usd: 80 }, { g: "W", t: 9, usd: 68 }, { g: "W", t: 9.5, usd: 39 },
              { g: "W", t: 10, usd: 56 },
            ],
          },
          {
            nombre: "Cloud White Off White Wonder White (W)", fotos: ["images/colorways/stan-smith-cloud-white-off-white-wonder-white-w.png"], costoUSD: 85,
            tablaTallas: [
              // Tabla incompleta: la captura solo alcanzo a mostrar hasta W8.5
              // (W9 en adelante quedo sin capturar). Completar si Luis manda
              // una captura con el resto de tallas.
              { g: "W", t: 5, usd: 85 }, { g: "W", t: 5.5, usd: 90 }, { g: "W", t: 6, usd: 90 },
              { g: "W", t: 6.5, usd: 104 }, { g: "W", t: 7, usd: 90 }, { g: "W", t: 7.5, usd: 85 },
              { g: "W", t: 8, usd: 85 }, { g: "W", t: 8.5, usd: 85 },
            ],
          },
        ],
      },
      {
        nombre: "Superstar", img: null, precio: null, tallas: "4-13",
        costoUSD: 50, precioVaria: true,
        colorways: [
          // --- Precio REAL por talla exacta (capturas StockX, carpeta "fotos Talla").
          {
            nombre: "Superstar II White Black", fotos: ["images/colorways/superstar2-white-black.png", "images/colorways/superstar2-white-black-2.png"], costoUSD: 60,
            tablaTallas: [
              { g: "M", t: 4, usd: 147 }, { g: "M", t: 4.5, usd: 147 }, { g: "M", t: 5, usd: 176 },
              { g: "M", t: 5.5, usd: 193 }, { g: "M", t: 6, usd: 68 }, { g: "M", t: 6.5, usd: 68 },
              { g: "M", t: 7, usd: 178 }, { g: "M", t: 7.5, usd: 109 }, { g: "M", t: 8, usd: 60 },
              { g: "M", t: 8.5, usd: 68 }, { g: "M", t: 9, usd: 154 }, { g: "M", t: 9.5, usd: 67 },
              { g: "M", t: 10, usd: 68 }, { g: "M", t: 10.5, usd: 68 }, { g: "M", t: 11, usd: 98 },
            ],
          },
          {
            nombre: "Superstar II Triple Black", fotos: ["images/colorways/superstar2-triple-black.png", "images/colorways/superstar2-triple-black-2.png"], costoUSD: 75,
            tablaTallas: [
              { g: "M", t: 4, usd: 96 }, { g: "M", t: 4.5, usd: 105 }, { g: "M", t: 5, usd: 106 },
              { g: "M", t: 5.5, usd: 95 }, { g: "M", t: 6, usd: 93 }, { g: "M", t: 6.5, usd: 119 },
              { g: "M", t: 7, usd: 105 }, { g: "M", t: 7.5, usd: 80 }, { g: "M", t: 8, usd: 111 },
              { g: "M", t: 8.5, usd: 104 }, { g: "M", t: 9, usd: 79 }, { g: "M", t: 9.5, usd: 96 },
              { g: "M", t: 10, usd: 94 }, { g: "M", t: 10.5, usd: 97 }, { g: "M", t: 11, usd: 80 },
              { g: "M", t: 11.5, usd: 75 }, { g: "M", t: 12, usd: 97 }, { g: "M", t: 12.5, usd: 112 },
            ],
          },
          {
            nombre: "Superstar ADV White Black (W)", fotos: ["images/colorways/superstar-adv-white-black-w.png"], costoUSD: 43,
            tablaTallas: [
              { g: "W", t: 6.5, usd: 114 }, { g: "W", t: 7, usd: 89 }, { g: "W", t: 7.5, usd: 83 },
              { g: "W", t: 8, usd: 82 }, { g: "W", t: 8.5, usd: 94 }, { g: "W", t: 9, usd: 43 },
              { g: "W", t: 9.5, usd: 43 }, { g: "W", t: 10, usd: 70 }, { g: "W", t: 10.5, usd: 43 },
            ],
          },
          {
            nombre: "Superstar 82 White Core Black", fotos: ["images/colorways/superstar82-white-core-black.png", "images/colorways/superstar82-white-core-black-2.png"], costoUSD: 45,
            tablaTallas: [
              { g: "M", t: 4, usd: 89 }, { g: "M", t: 4.5, usd: 86 }, { g: "M", t: 5, usd: 45 },
              { g: "M", t: 5.5, usd: 102 }, { g: "M", t: 6, usd: 85 }, { g: "M", t: 6.5, usd: 86 },
              { g: "M", t: 7, usd: 97 }, { g: "M", t: 7.5, usd: 84 }, { g: "M", t: 8, usd: 100 },
              { g: "M", t: 8.5, usd: 78 }, { g: "M", t: 9, usd: 84 }, { g: "M", t: 9.5, usd: 120 },
              { g: "M", t: 10, usd: 100 }, { g: "M", t: 10.5, usd: 109 }, { g: "M", t: 11, usd: 95 },
              { g: "M", t: 11.5, usd: 132 }, { g: "M", t: 12, usd: 84 }, { g: "M", t: 12.5, usd: 230 },
            ],
          },
          {
            // OJO: M9=$296 es un salto raro vs el resto de la tabla (posible error
            // de StockX o talla muy escasa) -- revisar antes de confiar en ese precio.
            nombre: "Superstar Cloud White Vivid Red", fotos: ["images/colorways/superstar-cloud-white-vivid-red.png", "images/colorways/superstar-cloud-white-vivid-red-2.png"], costoUSD: 76,
            tablaTallas: [
              // M5 a M7 estaban en BID (sin precio fijo), se omiten.
              { g: "M", t: 7.5, usd: 105 }, { g: "M", t: 8, usd: 135 }, { g: "M", t: 8.5, usd: 80 },
              { g: "M", t: 9, usd: 79 }, { g: "M", t: 9.5, usd: 76 }, { g: "M", t: 10, usd: 79 },
              { g: "M", t: 10.5, usd: 108 }, { g: "M", t: 11, usd: 79 }, { g: "M", t: 11.5, usd: 155 },
              { g: "M", t: 12, usd: 99 },
            ],
          },
        ],
      },
      {
        nombre: "Gazelle", img: null, precio: null, tallas: "4-13",
        costoUSD: 110, precioVaria: true,
        colorways: [
          {
            nombre: "Core Black Cloud White Gold", fotos: ["images/colorways/gazelle-core-black-cloud-white-gold.png", "images/colorways/gazelle-core-black-cloud-white-gold-2.png"], costoUSD: 37,
            tablaTallas: [
              { g: "M", t: 5.5, usd: 87 }, { g: "M", t: 6, usd: 83 }, { g: "M", t: 6.5, usd: 90 },
              { g: "M", t: 7, usd: 76 }, { g: "M", t: 7.5, usd: 75 }, { g: "M", t: 8, usd: 60 },
              { g: "M", t: 8.5, usd: 69 }, { g: "M", t: 9, usd: 60 }, { g: "M", t: 9.5, usd: 37 },
              { g: "M", t: 10, usd: 73 }, { g: "M", t: 10.5, usd: 59 }, { g: "M", t: 11, usd: 74 },
            ],
          },
        ],
      },
      {
        nombre: "Gazelle Bold", img: null, precio: null, tallas: "4-13",
        costoUSD: 37, precioVaria: true,
        colorways: [
          {
            nombre: "Bold Magic Beige Collegiate Green (2)", fotos: ["images/colorways/gazelle-bold-magic-beige-collegiate-green-w.png", "images/colorways/gazelle-bold-magic-beige-collegiate-green-w-2.png"], costoUSD: 30,
            tablaTallas: [
              { g: "M", t: 4, usd: 79 }, { g: "M", t: 4.5, usd: 62 }, { g: "M", t: 5, usd: 63 },
              { g: "M", t: 5.5, usd: 76 }, { g: "M", t: 6, usd: 68 }, { g: "M", t: 6.5, usd: 47 },
              { g: "M", t: 7, usd: 62 }, { g: "M", t: 7.5, usd: 58 }, { g: "M", t: 8, usd: 60 },
              { g: "M", t: 8.5, usd: 30 }, { g: "M", t: 9, usd: 40 }, { g: "M", t: 9.5, usd: 57 },
            ],
          },
          {
            nombre: "Bold Black White Gum (W)", fotos: ["images/colorways/gazelle-bold-black-white-gum-w.png", "images/colorways/gazelle-bold-black-white-gum-w-2.png"], costoUSD: 31,
            tablaTallas: [
              { g: "W", t: 5, usd: 94 }, { g: "W", t: 5.5, usd: 79 }, { g: "W", t: 6, usd: 65 },
              { g: "W", t: 6.5, usd: 68 }, { g: "W", t: 7, usd: 50 }, { g: "W", t: 7.5, usd: 47 },
              { g: "W", t: 8, usd: 49 }, { g: "W", t: 8.5, usd: 31 }, { g: "W", t: 9, usd: 41 },
              { g: "W", t: 9.5, usd: 49 }, { g: "W", t: 10, usd: 53 }, { g: "W", t: 10.5, usd: 95 },
            ],
          },
          {
            nombre: "Earth Strata Powder Yellow (W)", fotos: ["images/colorways/gazelle-bold-earth-strata-powder-yellow-w.png", "images/colorways/gazelle-bold-earth-strata-powder-yellow-w-2.png"], costoUSD: 65,
            tablaTallas: [
              { g: "W", t: 5, usd: 159 }, { g: "W", t: 5.5, usd: 125 }, { g: "W", t: 6, usd: 77 },
              { g: "W", t: 6.5, usd: 78 }, { g: "W", t: 7, usd: 65 }, { g: "W", t: 7.5, usd: 77 },
              { g: "W", t: 8, usd: 81 }, { g: "W", t: 8.5, usd: 79 }, { g: "W", t: 9, usd: 81 },
              { g: "W", t: 9.5, usd: 223 }, { g: "W", t: 10, usd: 125 }, { g: "W", t: 10.5, usd: 78 },
            ],
          },
        ],
      },
      {
        // Modelo nuevo -- las capturas de StockX traian un sub-linea "Gazelle
        // Indoor" que no tenia modelo propio todavia (es distinto de Gazelle
        // y Gazelle Bold: plantilla mas baja y forro de pana en el talon).
        nombre: "Gazelle Indoor", img: null, precio: null, tallas: "4-13",
        costoUSD: 39, precioVaria: true,
        colorways: [
          {
            nombre: "Sandy Pink (W)", fotos: ["images/colorways/gazelle-indoor-sandy-pink-w.png", "images/colorways/gazelle-indoor-sandy-pink-w-2.png"], costoUSD: 52,
            tablaTallas: [
              // W4 estaba en BID, se omite.
              { g: "W", t: 4.5, usd: 133 }, { g: "W", t: 5, usd: 166 }, { g: "W", t: 5.5, usd: 87 },
              { g: "W", t: 6, usd: 138 }, { g: "W", t: 6.5, usd: 56 }, { g: "W", t: 7, usd: 64 },
              { g: "W", t: 7.5, usd: 71 }, { g: "W", t: 8, usd: 92 }, { g: "W", t: 8.5, usd: 67 },
              { g: "W", t: 9, usd: 104 }, { g: "W", t: 9.5, usd: 86 }, { g: "W", t: 10, usd: 52 },
              { g: "W", t: 10.5, usd: 150 }, { g: "W", t: 11, usd: 128 },
            ],
          },
          {
            // OJO: M5.5=$329 es un salto raro vs el resto de la tabla -- revisar
            // antes de confiar en ese precio puntual.
            nombre: "Earth Strata Magic Beige", fotos: ["images/colorways/gazelle-indoor-earth-strata-magic-beige.png", "images/colorways/gazelle-indoor-earth-strata-magic-beige-2.png"], costoUSD: 39,
            tablaTallas: [
              { g: "M", t: 5.5, usd: 329 }, { g: "M", t: 6, usd: 205 }, { g: "M", t: 6.5, usd: 132 },
              { g: "M", t: 7, usd: 60 }, { g: "M", t: 7.5, usd: 60 }, { g: "M", t: 8, usd: 60 },
              { g: "M", t: 8.5, usd: 60 }, { g: "M", t: 9, usd: 39 }, { g: "M", t: 9.5, usd: 60 },
              { g: "M", t: 10, usd: 60 }, { g: "M", t: 10.5, usd: 60 }, { g: "M", t: 11, usd: 60 },
              { g: "M", t: 11.5, usd: 60 }, { g: "M", t: 12, usd: 60 }, { g: "M", t: 12.5, usd: 104 },
            ],
          },
        ],
      },
      {
        nombre: "Spezial", img: null, precio: null, tallas: "4-13",
        costoUSD: 35, precioVaria: true,
        colorways: [
          {
            nombre: "Handball Spezial FIFA World Cup 2026 Mexico", fotos: ["images/colorways/handball-spezial-fifa-world-cup-2026-mexico.png", "images/colorways/handball-spezial-fifa-world-cup-2026-mexico-2.png"], costoUSD: 26,
            tablaTallas: [
              { g: "M", t: 4, usd: 230 }, { g: "M", t: 4.5, usd: 140 }, { g: "M", t: 5, usd: 150 },
              { g: "M", t: 5.5, usd: 140 }, { g: "M", t: 6, usd: 113 }, { g: "M", t: 6.5, usd: 45 },
              { g: "M", t: 7, usd: 46 }, { g: "M", t: 7.5, usd: 43 }, { g: "M", t: 8, usd: 44 },
              { g: "M", t: 8.5, usd: 35 }, { g: "M", t: 9, usd: 46 }, { g: "M", t: 9.5, usd: 42 },
              { g: "M", t: 10, usd: 42 }, { g: "M", t: 10.5, usd: 26 }, { g: "M", t: 11, usd: 48 },
              { g: "M", t: 11.5, usd: 81 }, { g: "M", t: 12, usd: 71 }, { g: "M", t: 12.5, usd: 147 },
            ],
          },
          {
            nombre: "Handball Spezial Sporty & Rich Pink (W)", fotos: ["images/colorways/handball-spezial-sporty-rich-pink-w.png", "images/colorways/handball-spezial-sporty-rich-pink-w-2.png"], costoUSD: 30,
            tablaTallas: [
              { g: "W", t: 4.5, usd: 152 }, { g: "W", t: 5, usd: 30 }, { g: "W", t: 5.5, usd: 65 },
              { g: "W", t: 6, usd: 140 }, { g: "W", t: 6.5, usd: 96 }, { g: "W", t: 7, usd: 90 },
              { g: "W", t: 7.5, usd: 77 }, { g: "W", t: 8, usd: 84 }, { g: "W", t: 8.5, usd: 81 },
              { g: "W", t: 9, usd: 84 }, { g: "W", t: 9.5, usd: 89 }, { g: "W", t: 10, usd: 104 },
              { g: "W", t: 10.5, usd: 179 }, { g: "W", t: 11, usd: 185 }, { g: "W", t: 11.5, usd: 146 },
            ],
          },
          {
            nombre: "Handball Spezial Navy Gum", fotos: ["images/colorways/handball-spezial-navy-gum.png", "images/colorways/handball-spezial-navy-gum-2.png"], costoUSD: 26,
            tablaTallas: [
              { g: "M", t: 3.5, usd: 89 }, { g: "M", t: 4, usd: 86 }, { g: "M", t: 4.5, usd: 31 },
              { g: "M", t: 5, usd: 36 }, { g: "M", t: 5.5, usd: 46 }, { g: "M", t: 6, usd: 63 },
              { g: "M", t: 6.5, usd: 62 }, { g: "M", t: 7, usd: 40 }, { g: "M", t: 7.5, usd: 43 },
              { g: "M", t: 8, usd: 50 }, { g: "M", t: 8.5, usd: 53 }, { g: "M", t: 9, usd: 51 },
              { g: "M", t: 9.5, usd: 63 }, { g: "M", t: 10, usd: 52 }, { g: "M", t: 10.5, usd: 51 },
              { g: "M", t: 11, usd: 49 }, { g: "M", t: 11.5, usd: 66 }, { g: "M", t: 12, usd: 56 },
            ],
          },
          {
            nombre: "Handball Spezial Black Gum (2)", fotos: ["images/colorways/handball-spezial-black-gum.png", "images/colorways/handball-spezial-black-gum-2.png"], costoUSD: 55,
            tablaTallas: [
              { g: "M", t: 5, usd: 58 }, { g: "M", t: 5.5, usd: 55 }, { g: "M", t: 6, usd: 74 },
              { g: "M", t: 6.5, usd: 84 }, { g: "M", t: 7, usd: 74 }, { g: "M", t: 7.5, usd: 62 },
              { g: "M", t: 8, usd: 57 }, { g: "M", t: 8.5, usd: 61 }, { g: "M", t: 9, usd: 61 },
              { g: "M", t: 9.5, usd: 66 }, { g: "M", t: 10, usd: 72 }, { g: "M", t: 10.5, usd: 65 },
            ],
          },
          {
            nombre: "Handball Spezial Scarlet Gum (2)", fotos: ["images/colorways/handball-spezial-scarlet-gum.png", "images/colorways/handball-spezial-scarlet-gum-2.png"], costoUSD: 68,
            tablaTallas: [
              { g: "M", t: 5, usd: 75 }, { g: "M", t: 5.5, usd: 102 }, { g: "M", t: 6, usd: 75 },
              { g: "M", t: 6.5, usd: 70 }, { g: "M", t: 7, usd: 76 }, { g: "M", t: 7.5, usd: 71 },
              { g: "M", t: 8, usd: 71 }, { g: "M", t: 8.5, usd: 77 }, { g: "M", t: 9, usd: 68 },
              { g: "M", t: 9.5, usd: 75 }, { g: "M", t: 10, usd: 74 }, { g: "M", t: 10.5, usd: 71 },
              { g: "M", t: 11, usd: 74 }, { g: "M", t: 11.5, usd: 88 }, { g: "M", t: 12, usd: 75 },
            ],
          },
          {
            nombre: "Handball Spezial FIFA World Cup 2026 Germany (2)", fotos: ["images/colorways/handball-spezial-fifa-world-cup-2026-germany.png", "images/colorways/handball-spezial-fifa-world-cup-2026-germany-2.png"], costoUSD: 35,
            tablaTallas: [
              { g: "M", t: 4, usd: 107 }, { g: "M", t: 4.5, usd: 136 }, { g: "M", t: 5, usd: 93 },
              { g: "M", t: 5.5, usd: 88 }, { g: "M", t: 6, usd: 92 }, { g: "M", t: 6.5, usd: 64 },
              { g: "M", t: 7, usd: 95 }, { g: "M", t: 7.5, usd: 35 }, { g: "M", t: 8, usd: 35 },
              { g: "M", t: 8.5, usd: 35 }, { g: "M", t: 9, usd: 79 }, { g: "M", t: 9.5, usd: 124 },
              { g: "M", t: 10, usd: 107 }, { g: "M", t: 10.5, usd: 79 }, { g: "M", t: 11, usd: 66 },
            ],
          },
          {
            nombre: "Handball Spezial Clear Pink Arctic Night (W)", fotos: ["images/colorways/handball-spezial-clear-pink-arctic-night-w.png", "images/colorways/handball-spezial-clear-pink-arctic-night-w-2.png"], costoUSD: 40,
            tablaTallas: [
              { g: "W", t: 5, usd: 90 }, { g: "W", t: 5.5, usd: 86 }, { g: "W", t: 6, usd: 44 },
              { g: "W", t: 6.5, usd: 54 }, { g: "W", t: 7, usd: 42 }, { g: "W", t: 7.5, usd: 43 },
              { g: "W", t: 8, usd: 40 }, { g: "W", t: 8.5, usd: 45 }, { g: "W", t: 9, usd: 48 },
              { g: "W", t: 9.5, usd: 47 }, { g: "W", t: 10, usd: 50 }, { g: "W", t: 10.5, usd: 71 },
              { g: "W", t: 11, usd: 87 }, { g: "W", t: 11.5, usd: 124 }, { g: "W", t: 12, usd: 119 },
            ],
          },
          {
            nombre: "Handball Spezial Aluminum Core Black", fotos: ["images/colorways/handball-spezial-aluminum-core-black.png", "images/colorways/handball-spezial-aluminum-core-black-2.png"], costoUSD: 83,
            tablaTallas: [
              { g: "M", t: 4, usd: 111 }, { g: "M", t: 4.5, usd: 83 }, { g: "M", t: 5, usd: 102 },
              { g: "M", t: 5.5, usd: 104 }, { g: "M", t: 6, usd: 142 }, { g: "M", t: 6.5, usd: 100 },
              { g: "M", t: 7, usd: 97 }, { g: "M", t: 7.5, usd: 104 }, { g: "M", t: 8, usd: 92 },
              { g: "M", t: 8.5, usd: 90 }, { g: "M", t: 9, usd: 92 }, { g: "M", t: 9.5, usd: 97 },
              { g: "M", t: 10, usd: 99 }, { g: "M", t: 10.5, usd: 116 }, { g: "M", t: 11, usd: 196 },
            ],
          },
          {
            nombre: "Handball Spezial Off White Dusky Bronze (W)", fotos: ["images/colorways/handball-spezial-off-white-dusky-bronze-w.png", "images/colorways/handball-spezial-off-white-dusky-bronze-w-2.png"], costoUSD: 54,
            tablaTallas: [
              { g: "W", t: 5, usd: 75 }, { g: "W", t: 5.5, usd: 75 }, { g: "W", t: 6, usd: 69 },
              { g: "W", t: 6.5, usd: 69 }, { g: "W", t: 7, usd: 61 }, { g: "W", t: 7.5, usd: 65 },
              { g: "W", t: 8, usd: 65 }, { g: "W", t: 8.5, usd: 66 }, { g: "W", t: 9, usd: 64 },
              { g: "W", t: 9.5, usd: 66 }, { g: "W", t: 10, usd: 54 }, { g: "W", t: 10.5, usd: 71 },
              { g: "W", t: 11, usd: 78 }, { g: "W", t: 11.5, usd: 155 }, { g: "W", t: 12, usd: 147 },
            ],
          },
          {
            nombre: "Handball Spezial Alumina Grey (W)", fotos: ["images/colorways/handball-spezial-alumina-grey-w.png", "images/colorways/handball-spezial-alumina-grey-w-2.png"], costoUSD: 70,
            tablaTallas: [
              // W11.5 estaba en BID, se omite.
              { g: "W", t: 5, usd: 101 }, { g: "W", t: 5.5, usd: 119 }, { g: "W", t: 6, usd: 119 },
              { g: "W", t: 6.5, usd: 119 }, { g: "W", t: 7, usd: 119 }, { g: "W", t: 7.5, usd: 98 },
              { g: "W", t: 8, usd: 119 }, { g: "W", t: 8.5, usd: 109 }, { g: "W", t: 9, usd: 75 },
              { g: "W", t: 9.5, usd: 119 }, { g: "W", t: 10, usd: 70 }, { g: "W", t: 10.5, usd: 119 },
              { g: "W", t: 11, usd: 139 }, { g: "W", t: 12, usd: 192 },
            ],
          },
        ],
      },
      {
        nombre: "Samba", img: null, precio: null, tallas: "4-13",
        costoUSD: 37, precioVaria: true,
        colorways: [
          {
            nombre: "Samba LT Semi Blue Burst (W)", fotos: ["images/colorways/samba-lt-semi-blue-burst-w.png", "images/colorways/samba-lt-semi-blue-burst-w-2.png"], costoUSD: 57,
            tablaTallas: [
              // W10.5, W11 y W12 estaban en BID, se omiten.
              { g: "W", t: 5, usd: 235 }, { g: "W", t: 5.5, usd: 157 }, { g: "W", t: 6, usd: 105 },
              { g: "W", t: 6.5, usd: 72 }, { g: "W", t: 7, usd: 57 }, { g: "W", t: 7.5, usd: 156 },
              { g: "W", t: 8, usd: 139 }, { g: "W", t: 8.5, usd: 157 }, { g: "W", t: 9, usd: 151 },
              { g: "W", t: 9.5, usd: 90 }, { g: "W", t: 10, usd: 289 }, { g: "W", t: 11.5, usd: 170 },
            ],
          },
          {
            nombre: "Samba OG Off White Core Black (W)", fotos: ["images/colorways/samba-og-off-white-core-black-w.png", "images/colorways/samba-og-off-white-core-black-w-2.png"], costoUSD: 58,
            tablaTallas: [
              // W7 estaba en BID, se omite.
              { g: "W", t: 5, usd: 116 }, { g: "W", t: 5.5, usd: 58 }, { g: "W", t: 6, usd: 119 },
              { g: "W", t: 6.5, usd: 150 }, { g: "W", t: 7.5, usd: 129 }, { g: "W", t: 8, usd: 227 },
              { g: "W", t: 8.5, usd: 60 }, { g: "W", t: 9, usd: 103 }, { g: "W", t: 9.5, usd: 58 },
              { g: "W", t: 10, usd: 60 }, { g: "W", t: 10.5, usd: 96 }, { g: "W", t: 11, usd: 60 },
              { g: "W", t: 11.5, usd: 60 }, { g: "W", t: 12, usd: 148 }, { g: "W", t: 12.5, usd: 60 },
              { g: "W", t: 13, usd: 60 }, { g: "W", t: 13.5, usd: 60 },
            ],
          },
          {
            nombre: "Samba ADV Cloud White Core Black (W)", fotos: ["images/colorways/samba-adv-cloud-white-core-black-w.png", "images/colorways/samba-adv-cloud-white-core-black-w-2.png"], costoUSD: 50,
            tablaTallas: [
              { g: "W", t: 5, usd: 89 }, { g: "W", t: 5.5, usd: 84 }, { g: "W", t: 6, usd: 80 },
              { g: "W", t: 6.5, usd: 70 }, { g: "W", t: 7, usd: 50 }, { g: "W", t: 7.5, usd: 83 },
              { g: "W", t: 8, usd: 135 }, { g: "W", t: 8.5, usd: 59 }, { g: "W", t: 9, usd: 50 },
              { g: "W", t: 9.5, usd: 59 }, { g: "W", t: 10, usd: 89 }, { g: "W", t: 10.5, usd: 59 },
              { g: "W", t: 11, usd: 73 }, { g: "W", t: 11.5, usd: 57 }, { g: "W", t: 12, usd: 89 },
              { g: "W", t: 12.5, usd: 71 }, { g: "W", t: 13, usd: 104 }, { g: "W", t: 13.5, usd: 69 },
            ],
          },
          {
            nombre: "Samba Messi Black Gold Metallic (W)", fotos: ["images/colorways/samba-messi-black-gold-metallic-w.png", "images/colorways/samba-messi-black-gold-metallic-w-2.png"], costoUSD: 32,
            tablaTallas: [
              { g: "W", t: 5, usd: 58 }, { g: "W", t: 5.5, usd: 80 }, { g: "W", t: 6, usd: 54 },
              { g: "W", t: 6.5, usd: 52 }, { g: "W", t: 7, usd: 44 }, { g: "W", t: 7.5, usd: 55 },
              { g: "W", t: 8, usd: 48 }, { g: "W", t: 8.5, usd: 52 }, { g: "W", t: 9, usd: 43 },
              { g: "W", t: 9.5, usd: 44 }, { g: "W", t: 10, usd: 49 }, { g: "W", t: 10.5, usd: 43 },
              { g: "W", t: 11, usd: 49 }, { g: "W", t: 11.5, usd: 32 }, { g: "W", t: 12, usd: 47 },
            ],
          },
          {
            nombre: "Samba OG White Better Scarlet (W)", fotos: ["images/colorways/samba-og-white-better-scarlet-w.png", "images/colorways/samba-og-white-better-scarlet-w-2.png"], costoUSD: 59,
            tablaTallas: [
              { g: "W", t: 5, usd: 126 }, { g: "W", t: 5.5, usd: 111 }, { g: "W", t: 6, usd: 115 },
              { g: "W", t: 6.5, usd: 140 }, { g: "W", t: 7, usd: 131 }, { g: "W", t: 7.5, usd: 107 },
              { g: "W", t: 8, usd: 106 }, { g: "W", t: 8.5, usd: 98 }, { g: "W", t: 9, usd: 99 },
              { g: "W", t: 9.5, usd: 109 }, { g: "W", t: 10, usd: 105 }, { g: "W", t: 10.5, usd: 105 },
              { g: "W", t: 11, usd: 109 }, { g: "W", t: 11.5, usd: 72 }, { g: "W", t: 12, usd: 110 },
              { g: "W", t: 12.5, usd: 90 }, { g: "W", t: 13, usd: 109 }, { g: "W", t: 13.5, usd: 60 },
            ],
          },
          {
            nombre: "Samba OG Cream White Cardboard (W)", fotos: ["images/colorways/samba-og-cream-white-cardboard-w.png", "images/colorways/samba-og-cream-white-cardboard-w-2.png"], costoUSD: 70,
            tablaTallas: [
              { g: "W", t: 5, usd: 70 }, { g: "W", t: 5.5, usd: 73 }, { g: "W", t: 6, usd: 71 },
              { g: "W", t: 6.5, usd: 82 }, { g: "W", t: 7, usd: 83 }, { g: "W", t: 7.5, usd: 109 },
              { g: "W", t: 8, usd: 93 }, { g: "W", t: 8.5, usd: 76 }, { g: "W", t: 9, usd: 84 },
              { g: "W", t: 9.5, usd: 93 }, { g: "W", t: 10, usd: 96 }, { g: "W", t: 10.5, usd: 95 },
              { g: "W", t: 11, usd: 115 }, { g: "W", t: 11.5, usd: 115 }, { g: "W", t: 12, usd: 131 },
              { g: "W", t: 12.5, usd: 94 }, { g: "W", t: 13, usd: 111 }, { g: "W", t: 13.5, usd: 191 },
            ],
          },
          {
            nombre: "Samba OG Basketweave Tongue Off White Green (W)", fotos: ["images/colorways/samba-og-basketweave-tongue-off-white-green-w.png", "images/colorways/samba-og-basketweave-tongue-off-white-green-w-2.png"], costoUSD: 60,
            tablaTallas: [
              { g: "W", t: 5, usd: 100 }, { g: "W", t: 5.5, usd: 84 }, { g: "W", t: 6, usd: 62 },
              { g: "W", t: 6.5, usd: 84 }, { g: "W", t: 7, usd: 60 }, { g: "W", t: 7.5, usd: 118 },
              { g: "W", t: 8, usd: 100 }, { g: "W", t: 8.5, usd: 89 }, { g: "W", t: 9, usd: 62 },
              { g: "W", t: 9.5, usd: 84 }, { g: "W", t: 10, usd: 100 }, { g: "W", t: 10.5, usd: 109 },
              { g: "W", t: 11, usd: 153 }, { g: "W", t: 11.5, usd: 153 },
            ],
          },
        ],
      },
    ],
  },
  {
    marca: "Air Jordan",
    linea: "premium",
    modelos: [
      {
        nombre: "Jordan 1", img: null, precio: null, tallas: "4-13",
        costoUSD: 30, precioVaria: true,
        colorways: [
          {
            nombre: "Retro High OG Black Toe Reimagined", fotos: ["images/colorways/jordan1-black-toe-reimagined.png", "images/colorways/jordan1-black-toe-reimagined-2.png"], costoUSD: 48,
            tablaTallas: [
              // Faltan M6.5, M7 y M7.5 -- hubo un salto entre capturas (zona no
              // fotografiada). M13.5 estaba en BID, se omite.
              { g: "M", t: 3.5, usd: 70 }, { g: "M", t: 4, usd: 64 }, { g: "M", t: 4.5, usd: 190 },
              { g: "M", t: 5, usd: 74 }, { g: "M", t: 5.5, usd: 79 }, { g: "M", t: 6, usd: 151 },
              { g: "M", t: 8, usd: 92 }, { g: "M", t: 8.5, usd: 98 }, { g: "M", t: 9, usd: 111 },
              { g: "M", t: 9.5, usd: 116 }, { g: "M", t: 10, usd: 92 }, { g: "M", t: 10.5, usd: 123 },
              { g: "M", t: 11, usd: 119 }, { g: "M", t: 11.5, usd: 105 }, { g: "M", t: 12, usd: 109 },
              { g: "M", t: 12.5, usd: 110 }, { g: "M", t: 13, usd: 105 },
            ],
          },
          {
            // OJO: M9=$296 es un salto raro vs el resto de la tabla -- revisar
            // antes de confiar en ese precio puntual.
            nombre: "Retro High OG Midnight Navy", fotos: ["images/colorways/jordan1-midnight-navy.png", "images/colorways/jordan1-midnight-navy-2.png"], costoUSD: 47,
            tablaTallas: [
              { g: "M", t: 5, usd: 59 }, { g: "M", t: 5.5, usd: 48 }, { g: "M", t: 6, usd: 47 },
              { g: "M", t: 6.5, usd: 96 }, { g: "M", t: 7, usd: 154 }, { g: "M", t: 7.5, usd: 65 },
              { g: "M", t: 8, usd: 84 }, { g: "M", t: 8.5, usd: 85 }, { g: "M", t: 9, usd: 296 },
              { g: "M", t: 9.5, usd: 97 }, { g: "M", t: 10, usd: 113 }, { g: "M", t: 10.5, usd: 97 },
              { g: "M", t: 11, usd: 118 }, { g: "M", t: 11.5, usd: 120 }, { g: "M", t: 12, usd: 100 },
            ],
          },
        ],
      },
      { nombre: "Jordan 2", img: null, precio: null, tallas: "4-13", precioVaria: true, colorways: [
        {
          nombre: "Retro A Ma Maniere Airness", fotos: ["images/colorways/jordan2-a-ma-maniere-airness.png", "images/colorways/jordan2-a-ma-maniere-airness-2.png"], costoUSD: 67,
          tablaTallas: [
            { g: "M", t: 5, usd: 67 }, { g: "M", t: 5.5, usd: 70 }, { g: "M", t: 6, usd: 109 },
            { g: "M", t: 6.5, usd: 68 }, { g: "M", t: 7, usd: 106 }, { g: "M", t: 7.5, usd: 120 },
            { g: "M", t: 8, usd: 127 }, { g: "M", t: 8.5, usd: 100 }, { g: "M", t: 9, usd: 88 },
            { g: "M", t: 9.5, usd: 117 }, { g: "M", t: 10, usd: 131 }, { g: "M", t: 10.5, usd: 99 },
            { g: "M", t: 11, usd: 154 }, { g: "M", t: 11.5, usd: 195 }, { g: "M", t: 12, usd: 112 },
          ],
        },
      ] },
      { nombre: "Jordan 4", img: null, precio: null, tallas: "4-13", precioVaria: true, colorways: [
        {
          nombre: "Retro SB Navy", fotos: ["images/colorways/jordan4-navy.png", "images/colorways/jordan4-navy-2.png"], costoUSD: 140,
          tablaTallas: [
            { g: "M", t: 5, usd: 140 }, { g: "M", t: 5.5, usd: 139 }, { g: "M", t: 6, usd: 191 },
            { g: "M", t: 6.5, usd: 236 }, { g: "M", t: 7, usd: 199 }, { g: "M", t: 7.5, usd: 207 },
            { g: "M", t: 8, usd: 180 }, { g: "M", t: 8.5, usd: 176 }, { g: "M", t: 9, usd: 185 },
            { g: "M", t: 9.5, usd: 202 }, { g: "M", t: 10, usd: 219 }, { g: "M", t: 10.5, usd: 239 },
            { g: "M", t: 11, usd: 252 }, { g: "M", t: 11.5, usd: 248 }, { g: "M", t: 12, usd: 210 },
          ],
        },
      ] },
      { nombre: "Jordan 7", img: null, precio: null, tallas: "4-13", precioVaria: true, colorways: [
        {
          nombre: "Retro Miro (2026)", fotos: ["images/colorways/jordan7-miro-2026.png", "images/colorways/jordan7-miro-2026-2.png"], costoUSD: 147,
          tablaTallas: [
            { g: "M", t: 7.5, usd: 188 }, { g: "M", t: 8, usd: 158 }, { g: "M", t: 8.5, usd: 150 },
            { g: "M", t: 9, usd: 167 }, { g: "M", t: 9.5, usd: 147 }, { g: "M", t: 10, usd: 160 },
            { g: "M", t: 10.5, usd: 171 }, { g: "M", t: 11, usd: 187 }, { g: "M", t: 11.5, usd: 211 },
            { g: "M", t: 12, usd: 214 }, { g: "M", t: 12.5, usd: 224 }, { g: "M", t: 13, usd: 227 },
          ],
        },
      ] },
      { nombre: "Jordan 9", img: null, precio: null, tallas: "4-13", precioVaria: true, colorways: [
        {
          nombre: "Retro Flint Grey French Blue (2026)", fotos: ["images/colorways/jordan9-flint-grey-french-blue-2026.png", "images/colorways/jordan9-flint-grey-french-blue-2026-2.png"], costoUSD: 102,
          tablaTallas: [
            // M3.5 a M6.5 estaban en BID, se omiten.
            { g: "M", t: 7, usd: 115 }, { g: "M", t: 7.5, usd: 129 }, { g: "M", t: 8, usd: 108 },
            { g: "M", t: 8.5, usd: 102 }, { g: "M", t: 9, usd: 104 }, { g: "M", t: 9.5, usd: 114 },
            { g: "M", t: 10, usd: 115 }, { g: "M", t: 10.5, usd: 110 }, { g: "M", t: 11, usd: 116 },
            { g: "M", t: 11.5, usd: 135 }, { g: "M", t: 12, usd: 150 }, { g: "M", t: 12.5, usd: 187 },
            { g: "M", t: 13, usd: 147 }, { g: "M", t: 14, usd: 172 },
          ],
        },
      ] },
      {
        nombre: "Jordan 12", img: null, precio: null, tallas: "4-13", costoUSD: 152, precioVaria: true,
        colorways: [
          {
            nombre: "Retro SP A Ma Maniere White (W)", fotos: ["images/colorways/jordan12-a-ma-maniere-white-w.png", "images/colorways/jordan12-a-ma-maniere-white-w-2.png"], costoUSD: 116,
            tablaTallas: [
              // Se quito M12=$425 a pedido de Luis (salto de precio anomalo
              // vs el resto de la tabla, no se confia en ese dato puntual).
              { g: "M", t: 6.5, usd: 176 }, { g: "M", t: 7, usd: 136 }, { g: "M", t: 7.5, usd: 138 },
              { g: "M", t: 8, usd: 117 }, { g: "M", t: 8.5, usd: 119 }, { g: "M", t: 9, usd: 118 },
              { g: "M", t: 9.5, usd: 116 }, { g: "M", t: 10, usd: 180 }, { g: "M", t: 10.5, usd: 137 },
              { g: "M", t: 11, usd: 161 }, { g: "M", t: 11.5, usd: 130 },
            ],
          },
        ],
      },
      {
        nombre: "Jordan 13", img: null, precio: null, tallas: "4-13", costoUSD: 133, precioVaria: true,
        colorways: [
          {
            nombre: "Retro OG Chicago (2026)", fotos: ["images/colorways/jordan13-og-chicago-2026.png"], costoUSD: 133,
            tablaTallas: [
              // M5.5, M6 y M6.5 estaban en BID, se omiten.
              { g: "M", t: 7, usd: 179 }, { g: "M", t: 7.5, usd: 152 }, { g: "M", t: 8, usd: 147 },
              { g: "M", t: 8.5, usd: 138 }, { g: "M", t: 9, usd: 133 }, { g: "M", t: 9.5, usd: 142 },
              { g: "M", t: 10, usd: 138 }, { g: "M", t: 10.5, usd: 144 }, { g: "M", t: 11, usd: 145 },
            ],
          },
          {
            nombre: "Retro Gym Red Flint Grey", fotos: ["images/colorways/jordan13-gym-red-flint-grey.png", "images/colorways/jordan13-gym-red-flint-grey-2.png"], costoUSD: 130,
            tablaTallas: [
              { g: "M", t: 7, usd: 200 }, { g: "M", t: 7.5, usd: 187 }, { g: "M", t: 8, usd: 130 },
              { g: "M", t: 8.5, usd: 150 }, { g: "M", t: 9, usd: 190 }, { g: "M", t: 9.5, usd: 163 },
              { g: "M", t: 10, usd: 162 }, { g: "M", t: 10.5, usd: 175 }, { g: "M", t: 11, usd: 169 },
              { g: "M", t: 11.5, usd: 175 }, { g: "M", t: 12, usd: 198 }, { g: "M", t: 12.5, usd: 250 },
            ],
          },
        ],
      },
    ],
  },
  {
    marca: "New Balance",
    linea: "premium",
    modelos: [
      {
        nombre: "9060", img: null, precio: null, tallas: "",
        costoUSD: 92, precioVaria: true,
        colorways: [
        ],
      },
      {
        nombre: "1000", img: null, precio: null, tallas: "",
        costoUSD: 53, precioVaria: true,
        colorways: [
        ],
      },
      {
        nombre: "2002R", img: null, precio: null, tallas: "",
        costoUSD: 92, precioVaria: true,
        colorways: [
        ],
      },
      { nombre: "574", img: null, precio: null, tallas: "" },
      {
        nombre: "990", img: null, precio: null, tallas: "",
        costoUSD: 105, precioVaria: true,
        colorways: [
        ],
      },
      { nombre: "327", img: null, precio: null, tallas: "" },
      { nombre: "530", img: null, precio: null, tallas: "", sugerido: true },
      {
        nombre: "550", img: null, precio: null, tallas: "",
        costoUSD: 52, precioVaria: true, sugerido: true,
        colorways: [
        ],
      },
      {
        nombre: "204L", img: null, precio: null, tallas: "",
        costoUSD: 53, precioVaria: true, sugerido: true,
        colorways: [
        ],
      },
      { nombre: "237", img: null, precio: null, tallas: "", costoUSD: 54, sugerido: true },
      { nombre: "57/40", img: null, precio: null, tallas: "", costoUSD: 59, sugerido: true },
      { nombre: "1906A", img: null, precio: null, tallas: "", costoUSD: 119, sugerido: true },
      { nombre: "1906R", img: null, precio: null, tallas: "", costoUSD: 92, sugerido: true },
      { nombre: "993", img: null, precio: null, tallas: "", costoUSD: 117, sugerido: true },
    ],
  },
  {
    marca: "Nike",
    linea: "premium",
    modelos: [
      { nombre: "Air Force", img: null, precio: null, tallas: "", precioVaria: true, colorways: [
      ] },
      { nombre: "Air Max", img: null, precio: null, tallas: "", precioVaria: true, colorways: [
      ] },
      { nombre: "Blazer", img: null, precio: null, tallas: "", precioVaria: true, colorways: [
      ] },
      { nombre: "Dunk", img: null, precio: null, tallas: "", precioVaria: true, colorways: [
      ] },
      { nombre: "Cortez", img: null, precio: null, tallas: "", precioVaria: true, colorways: [
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
