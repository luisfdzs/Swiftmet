import type { Locale } from './config'

/**
 * Textos de interfaz (no de contenido). El diccionario `en` es la fuente de verdad de
 * la forma: `hi` y `es` deben encajar en el mismo tipo, así que si añades una clave y
 * no la traduces, falla el typecheck en lugar de aparecer vacía en la web.
 *
 * ⚠️ El hindi es un BORRADOR pendiente de revisión por un hablante nativo (ver README,
 * «Pendiente de confirmar con Swiftmet»). Está aquí para que la estructura de tres
 * idiomas sea real y comprobable, no para publicarse sin leer.
 */
const en = {
  nav: {
    home: 'Home',
    products: 'Products',
    spools: 'Spools',
    quality: 'Quality',
    company: 'Company',
    contact: 'Contact',
    menu: 'Menu',
    close: 'Close',
    skipToContent: 'Skip to content',
  },
  home: {
    heroLead: 'Aluminium wire for vacuum metallising',
    heroTitle: 'High-purity aluminium wire, wound jointless on fourteen spool sizes.',
    heroSubtitle: 'Palwal, Haryana — supplying converters and capacitor makers worldwide.',
    // Nombre accesible del montaje de portada. Dice «archive footage» a propósito: es
    // material de archivo de la industria del aluminio, no la planta de Swiftmet, y un
    // texto que describe una imagen no puede afirmar más de lo que la imagen es.
    heroMontageLabel: 'Archive footage of aluminium production, playing as a silent loop',
    figuresTitle: 'At a glance',
    // «Aluminium purity, up to» + «99.99 % min» se leía «up to … min», que es lo
    // contrario de lo que dice. La etiqueta nombra el grado; el valor trae su propio matiz.
    purityLabel: 'Highest purity grade',
    spoolTypesLabel: 'Plastic spool types',
    spoolRangeLabel: 'Net wire per spool',
    jointsLabel: 'Joints per spool',
    jointsValue: 'Zero',
    productsTitle: 'Products',
    viewAllProducts: 'View the full range',
    spoolsTitle: 'Spool programme',
    spoolsLead:
      'Fourteen plastic spool types, from 2.75 kg to 14.5 kg net, layer-wound to run on automatic metallisers without an operator re-threading the wire.',
    viewSpools: 'See every dimension',
    qualityTitle: 'Quality',
    viewQuality: 'How each batch is checked',
  },
  products: {
    title: 'Products',
    lead: 'High-purity aluminium wire and rod for metallising, plus the wire we draw for welding and spring applications.',
    empty: 'No products published yet.',
    specifications: 'Specifications',
  },
  product: {
    grade: 'Grade',
    purity: 'Aluminium purity',
    diameter: 'Diameter',
    tensile: 'Tensile strength',
    elongation: 'Elongation',
    applications: 'Applications',
    packing: 'Packing',
    spoolWound: 'Supplied on the Swiftmet spool programme',
    viewSpools: 'View spool dimensions',
    backToProducts: 'Back to products',
    next: 'Next product',
    previous: 'Previous product',
    enquire: 'Ask about this product',
  },
  spools: {
    title: 'Plastic spools',
    lead: 'Every spool type we wind, with the dimensions that decide whether it fits your metalliser. All dimensions in millimetres.',
    tableCaption: 'Swiftmet plastic spool programme — dimensions in mm, net wire weight in kg',
    code: 'Spool type',
    netWeight: 'Wire net weight',
    flangeDiameter: 'Flange diameter',
    coreDiameter: 'Core diameter',
    boreHole: 'Bore hole',
    spoolWidth: 'Width of spool',
    windingWidth: 'Winding width',
    legendTitle: 'What each dimension means',
    drawingTitle: 'Sections, to scale',
    drawingLead:
      'Each outline is drawn from the figures in the table at a single shared scale, so the sizes can be compared by eye.',
    drawingAlt: 'Cross-section of spool',
    empty: 'No spools published yet.',
    unitsNote: 'All dimensions in mm.',
  },
  quality: {
    title: 'Quality',
    lead: 'Where each batch is measured, and what happens when a figure falls outside the customer specification.',
    stepsTitle: 'Checkpoints',
    certificationsTitle: 'Certifications',
    certificationsEmpty: 'Certifications to be confirmed.',
  },
  company: {
    title: 'Company',
    plantsTitle: 'Where we are',
    officeLabel: 'Registered office',
    worksLabel: 'Works',
    incorporatedLabel: 'Incorporated',
    capacityLabel: 'Installed capacity',
  },
  contact: {
    title: 'Contact',
    lead: 'Tell us the wire diameter, the purity and the spool type, and we will come back with a price.',
    phone: 'Phone',
    email: 'Email',
    location: 'Address',
    peopleTitle: 'Who to ask for',
  },
  footer: {
    rights: 'All rights reserved.',
    backToTop: 'Back to top',
  },
  family: {
    'metallising-wire': 'Metallising wire',
    'aluminium-rod': 'Aluminium rod',
    'tea-bag-wire': 'Tea bag wire',
    'welding-wire': 'Welding wire',
    'spring-steel-wire': 'Spring steel wire',
  },
  figure: {
    photoPending: 'Photograph pending',
    photoPendingHint: 'Swiftmet to supply. Upload it in the admin panel.',
  },
  notFound: {
    title: 'This page does not exist',
    lead: 'We may have moved it, or the link may be broken.',
    cta: 'Go to homepage',
  },
} as const

type Dictionary = {
  -readonly [K in keyof typeof en]: { -readonly [P in keyof (typeof en)[K]]: string }
}

/** ⚠️ Borrador — pendiente de revisión por hablante nativo. */
const hi: Dictionary = {
  nav: {
    home: 'मुख्य पृष्ठ',
    products: 'उत्पाद',
    spools: 'स्पूल',
    quality: 'गुणवत्ता',
    company: 'कंपनी',
    contact: 'संपर्क',
    menu: 'मेन्यू',
    close: 'बंद करें',
    skipToContent: 'मुख्य सामग्री पर जाएँ',
  },
  home: {
    heroLead: 'वैक्यूम मेटलाइज़िंग के लिए एल्युमिनियम तार',
    heroTitle: 'उच्च शुद्धता वाला एल्युमिनियम तार, चौदह स्पूल आकारों पर बिना जोड़ लपेटा हुआ।',
    heroSubtitle: 'पलवल, हरियाणा — दुनिया भर के कन्वर्टर और कैपेसिटर निर्माताओं के लिए।',
    heroMontageLabel: 'एल्युमिनियम उत्पादन का पुरालेख फुटेज, मौन लूप में चल रहा है',
    figuresTitle: 'एक नज़र में',
    purityLabel: 'उच्चतम शुद्धता ग्रेड',
    spoolTypesLabel: 'प्लास्टिक स्पूल प्रकार',
    spoolRangeLabel: 'प्रति स्पूल शुद्ध तार',
    jointsLabel: 'प्रति स्पूल जोड़',
    jointsValue: 'शून्य',
    productsTitle: 'उत्पाद',
    viewAllProducts: 'पूरी श्रेणी देखें',
    spoolsTitle: 'स्पूल कार्यक्रम',
    spoolsLead:
      'चौदह प्लास्टिक स्पूल प्रकार, 2.75 किग्रा से 14.5 किग्रा शुद्ध तक, परत-दर-परत लपेटे हुए ताकि स्वचालित मेटलाइज़र पर तार दोबारा पिरोने की ज़रूरत न पड़े।',
    viewSpools: 'सभी आयाम देखें',
    qualityTitle: 'गुणवत्ता',
    viewQuality: 'प्रत्येक बैच की जाँच कैसे होती है',
  },
  products: {
    title: 'उत्पाद',
    lead: 'मेटलाइज़िंग के लिए उच्च शुद्धता वाला एल्युमिनियम तार और रॉड, साथ ही वेल्डिंग और स्प्रिंग अनुप्रयोगों के लिए खींचा गया तार।',
    empty: 'अभी कोई उत्पाद प्रकाशित नहीं है।',
    specifications: 'विशिष्टियाँ',
  },
  product: {
    grade: 'ग्रेड',
    purity: 'एल्युमिनियम शुद्धता',
    diameter: 'व्यास',
    tensile: 'तनन सामर्थ्य',
    elongation: 'विस्तार',
    applications: 'अनुप्रयोग',
    packing: 'पैकिंग',
    spoolWound: 'स्विफ्टमेट स्पूल कार्यक्रम पर आपूर्ति',
    viewSpools: 'स्पूल आयाम देखें',
    backToProducts: 'उत्पादों पर वापस',
    next: 'अगला उत्पाद',
    previous: 'पिछला उत्पाद',
    enquire: 'इस उत्पाद के बारे में पूछें',
  },
  spools: {
    title: 'प्लास्टिक स्पूल',
    lead: 'हम जो भी स्पूल प्रकार लपेटते हैं, उन आयामों के साथ जो तय करते हैं कि वह आपके मेटलाइज़र में फिट होगा या नहीं। सभी आयाम मिलीमीटर में।',
    tableCaption: 'स्विफ्टमेट प्लास्टिक स्पूल कार्यक्रम — आयाम मिमी में, शुद्ध तार भार किग्रा में',
    code: 'स्पूल प्रकार',
    netWeight: 'तार शुद्ध भार',
    flangeDiameter: 'फ़्लैंज व्यास',
    coreDiameter: 'कोर व्यास',
    boreHole: 'बोर होल',
    spoolWidth: 'स्पूल चौड़ाई',
    windingWidth: 'वाइंडिंग चौड़ाई',
    legendTitle: 'प्रत्येक आयाम का अर्थ',
    drawingTitle: 'अनुभाग, पैमाने पर',
    drawingLead:
      'प्रत्येक आकृति तालिका के आँकड़ों से एक ही साझा पैमाने पर बनाई गई है, ताकि आकारों की तुलना देखकर की जा सके।',
    drawingAlt: 'स्पूल का अनुप्रस्थ काट',
    empty: 'अभी कोई स्पूल प्रकाशित नहीं है।',
    unitsNote: 'सभी आयाम मिमी में।',
  },
  quality: {
    title: 'गुणवत्ता',
    lead: 'प्रत्येक बैच कहाँ मापा जाता है, और जब कोई आँकड़ा ग्राहक विशिष्टि से बाहर जाता है तो क्या होता है।',
    stepsTitle: 'जाँच बिंदु',
    certificationsTitle: 'प्रमाणन',
    certificationsEmpty: 'प्रमाणन की पुष्टि होनी है।',
  },
  company: {
    title: 'कंपनी',
    plantsTitle: 'हम कहाँ हैं',
    officeLabel: 'पंजीकृत कार्यालय',
    worksLabel: 'संयंत्र',
    incorporatedLabel: 'निगमन',
    capacityLabel: 'स्थापित क्षमता',
  },
  contact: {
    title: 'संपर्क',
    lead: 'तार का व्यास, शुद्धता और स्पूल प्रकार बताइए, और हम कीमत के साथ उत्तर देंगे।',
    phone: 'फ़ोन',
    email: 'ईमेल',
    location: 'पता',
    peopleTitle: 'किससे बात करें',
  },
  footer: {
    rights: 'सर्वाधिकार सुरक्षित।',
    backToTop: 'ऊपर जाएँ',
  },
  family: {
    'metallising-wire': 'मेटलाइज़िंग तार',
    'aluminium-rod': 'एल्युमिनियम रॉड',
    'tea-bag-wire': 'टी बैग तार',
    'welding-wire': 'वेल्डिंग तार',
    'spring-steel-wire': 'स्प्रिंग स्टील तार',
  },
  figure: {
    photoPending: 'फ़ोटोग्राफ़ प्रतीक्षित',
    photoPendingHint: 'स्विफ्टमेट द्वारा उपलब्ध कराया जाएगा। एडमिन पैनल में अपलोड करें।',
  },
  notFound: {
    title: 'यह पृष्ठ मौजूद नहीं है',
    lead: 'हमने इसे हटा दिया हो सकता है, या लिंक टूटा हो सकता है।',
    cta: 'मुख्य पृष्ठ पर जाएँ',
  },
}

const es: Dictionary = {
  nav: {
    home: 'Inicio',
    products: 'Productos',
    spools: 'Bobinas',
    quality: 'Calidad',
    company: 'Empresa',
    contact: 'Contacto',
    menu: 'Menú',
    close: 'Cerrar',
    skipToContent: 'Saltar al contenido',
  },
  home: {
    heroLead: 'Hilo de aluminio para metalizado al vacío',
    heroTitle: 'Hilo de aluminio de alta pureza, bobinado sin empalmes en catorce formatos.',
    heroSubtitle: 'Palwal, Haryana — para transformadores de film y fabricantes de condensadores.',
    heroMontageLabel: 'Imágenes de archivo de la producción de aluminio, en bucle y sin sonido',
    figuresTitle: 'De un vistazo',
    purityLabel: 'Grado de pureza más alto',
    spoolTypesLabel: 'Tipos de bobina de plástico',
    spoolRangeLabel: 'Hilo neto por bobina',
    jointsLabel: 'Empalmes por bobina',
    jointsValue: 'Ninguno',
    productsTitle: 'Productos',
    viewAllProducts: 'Ver toda la gama',
    spoolsTitle: 'Programa de bobinas',
    spoolsLead:
      'Catorce tipos de bobina de plástico, de 2,75 kg a 14,5 kg netos, bobinados capa a capa para que la metalizadora automática funcione sin que nadie vuelva a enhebrar el hilo.',
    viewSpools: 'Ver todas las medidas',
    qualityTitle: 'Calidad',
    viewQuality: 'Cómo se comprueba cada lote',
  },
  products: {
    title: 'Productos',
    lead: 'Hilo y varilla de aluminio de alta pureza para metalizado, más el hilo que trefilamos para soldadura y muelles.',
    empty: 'Todavía no hay productos publicados.',
    specifications: 'Especificaciones',
  },
  product: {
    grade: 'Grado',
    purity: 'Pureza del aluminio',
    diameter: 'Diámetro',
    tensile: 'Resistencia a tracción',
    elongation: 'Alargamiento',
    applications: 'Aplicaciones',
    packing: 'Embalaje',
    spoolWound: 'Se sirve en el programa de bobinas Swiftmet',
    viewSpools: 'Ver medidas de bobina',
    backToProducts: 'Volver a productos',
    next: 'Siguiente producto',
    previous: 'Producto anterior',
    enquire: 'Preguntar por este producto',
  },
  spools: {
    title: 'Bobinas de plástico',
    lead: 'Todos los formatos que bobinamos, con las medidas que deciden si encaja en tu metalizadora. Todas las dimensiones en milímetros.',
    tableCaption:
      'Programa de bobinas de plástico Swiftmet — dimensiones en mm, peso neto de hilo en kg',
    code: 'Tipo de bobina',
    netWeight: 'Peso neto de hilo',
    flangeDiameter: 'Diámetro de pestaña',
    coreDiameter: 'Diámetro de núcleo',
    boreHole: 'Agujero central',
    spoolWidth: 'Anchura de bobina',
    windingWidth: 'Anchura de bobinado',
    legendTitle: 'Qué significa cada medida',
    drawingTitle: 'Secciones, a escala',
    drawingLead:
      'Cada silueta está dibujada con las cifras de la tabla a una única escala común, para poder comparar los tamaños a simple vista.',
    drawingAlt: 'Sección transversal de la bobina',
    empty: 'Todavía no hay bobinas publicadas.',
    unitsNote: 'Todas las dimensiones en mm.',
  },
  quality: {
    title: 'Calidad',
    lead: 'Dónde se mide cada lote y qué pasa cuando una cifra se sale de la especificación del cliente.',
    stepsTitle: 'Puntos de control',
    certificationsTitle: 'Certificaciones',
    certificationsEmpty: 'Certificaciones pendientes de confirmar.',
  },
  company: {
    title: 'Empresa',
    plantsTitle: 'Dónde estamos',
    officeLabel: 'Domicilio social',
    worksLabel: 'Planta',
    incorporatedLabel: 'Constitución',
    capacityLabel: 'Capacidad instalada',
  },
  contact: {
    title: 'Contacto',
    lead: 'Dinos el diámetro del hilo, la pureza y el tipo de bobina, y te contestamos con precio.',
    phone: 'Teléfono',
    email: 'Email',
    location: 'Dirección',
    peopleTitle: 'A quién preguntar',
  },
  footer: {
    rights: 'Todos los derechos reservados.',
    backToTop: 'Volver arriba',
  },
  family: {
    'metallising-wire': 'Hilo para metalizado',
    'aluminium-rod': 'Varilla de aluminio',
    'tea-bag-wire': 'Hilo para bolsitas de té',
    'welding-wire': 'Hilo de soldadura',
    'spring-steel-wire': 'Hilo de acero para muelles',
  },
  figure: {
    photoPending: 'Fotografía pendiente',
    photoPendingHint: 'La aporta Swiftmet. Se sube desde el panel de administración.',
  },
  notFound: {
    title: 'Esta página no existe',
    lead: 'Puede que la hayamos movido o que el enlace esté mal.',
    cta: 'Ir al inicio',
  },
}

const dictionaries: Record<Locale, Dictionary> = { en, hi, es }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export type { Dictionary }
