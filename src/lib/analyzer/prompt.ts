import { CATEGORY_LABEL, type Category, type Finding, type PromptVariant } from "./types";

interface PromptInput {
  url: string;
  title: string | null;
  score: number;
  verdict: string;
  findings: Finding[];
}

/** Categorías que se arreglan en el código y no se ven en la página. */
const CATEGORIAS_TECNICAS: Category[] = ["seo", "tecnico", "performance", "accesibilidad"];

const esTecnico = (f: Finding) => CATEGORIAS_TECNICAS.includes(f.category);

/**
 * Regla que existe porque el primer prompt de esta herramienta causaba el
 * problema que decía resolver: pedía reescribir todo y quien lo usaba terminaba
 * con una página más limpia y sin identidad. Sacar la personalidad no reduce el
 * parecido con una plantilla: lo aumenta.
 */
const REGLA_DE_ORO = [
  "## La regla que manda sobre todas las demás",
  "",
  "Lo que suena a esta marca se queda. Tu trabajo es sacar las marcas de generación automática, no las marcas de autor.",
  "",
  "Antes de proponer un solo cambio, hacé una lista de las frases, los títulos y las decisiones visuales que suenan a una persona concreta y no a una plantilla: una línea con carácter, un chiste interno, un modo raro de nombrar un servicio, un detalle gráfico que no viene de ningún template. Esa lista es intocable. Si dudás entre corregir algo y conservarlo, conservalo y dejá anotada la duda.",
  "",
  "Un titular que ya dice algo propio no es un problema aunque no te guste. Un titular que dice \"Servicios\" o \"Testimonios\" sí lo es.",
].join("\n");

const REGLAS_DE_SALIDA = [
  "## Reglas de la respuesta",
  "- No inventes datos, cifras, clientes, plazos ni casos. Si falta información, marcá `[DATO A COMPLETAR: qué necesitás]` y seguí.",
  "- Nada de emojis en el copy ni rótulos genéricos arriba de las secciones.",
  "- Nada de guiones largos dentro de las frases: punto, coma o paréntesis.",
  "- Prohibido el vocabulario de IA: nada de \"en el panorama digital actual\", \"desbloqueá el poder de\", \"llevá tu negocio al siguiente nivel\", \"soluciones de vanguardia\".",
  "- Entregá el resultado listo para aplicar, no descripciones de lo que habría que hacer.",
  "- Al final, listá en dos líneas qué NO tocaste y por qué.",
].join("\n");

/** Contexto común: qué página es y cómo le fue. */
function contexto({ url, title, score, verdict, findings }: PromptInput): string {
  const lineas = [
    "## Contexto",
    `- URL: ${url}`,
  ];
  if (title) lineas.push(`- Título actual: "${title}"`);
  lineas.push(`- Diagnóstico automático: ${score}/10 en el test de "cuánto parece hecha por IA" (${verdict}).`);
  lineas.push(`- Se detectaron ${findings.length} problemas concretos, listados abajo con su evidencia.`);
  return lineas.join("\n");
}

/** Lista de hallazgos agrupada por categoría, con evidencia y arreglo. */
function listaDeProblemas(findings: Finding[], titulo: string): string | null {
  if (!findings.length) return null;
  const porCategoria = new Map<Category, Finding[]>();
  for (const f of findings) {
    porCategoria.set(f.category, [...(porCategoria.get(f.category) ?? []), f]);
  }

  const lineas = [`## ${titulo}`];
  for (const [categoria, items] of porCategoria) {
    lineas.push("", `### ${CATEGORY_LABEL[categoria]}`);
    for (const f of items) {
      lineas.push(`- **${f.title}** (gravedad ${f.severity}). ${f.detail}`);
      if (f.evidence.length) {
        lineas.push(`  - Evidencia: ${f.evidence.slice(0, 3).map((e) => `\`${e}\``).join(" · ")}`);
      }
      lineas.push(`  - Cómo se corrige: ${f.fix}`);
    }
  }
  return lineas.join("\n");
}

const ROL =
  "Sos un desarrollador web y copywriter senior. Escribís en español rioplatense, con lenguaje concreto y sin relleno.";

/**
 * Nivel 1. Toca solo lo que no se ve: metadatos, SEO técnico, accesibilidad y
 * performance. Es el que conviene por defecto porque no tiene forma de romper
 * la identidad de la página.
 */
function promptQuirurgico(input: PromptInput): PromptVariant {
  const tecnicos = input.findings.filter(esTecnico);
  const visibles = input.findings.filter((f) => !esTecnico(f));

  const cuerpo = [
    ROL,
    "",
    contexto(input),
    "",
    "## Alcance: solo lo invisible",
    "",
    "No cambies ni una palabra del texto visible. No toques colores, tipografías, espaciados, tamaños, imágenes ni el orden de las secciones. Si un arreglo obliga a tocar algo que se ve, no lo hagas: anotalo aparte en una lista de \"requiere decisión\" al final.",
    "",
    tecnicos.length
      ? listaDeProblemas(tecnicos, `Resolvé estos ${tecnicos.length} puntos técnicos`)
      : "## No hay nada técnico que resolver\n\nEl análisis no encontró problemas de SEO técnico, accesibilidad ni performance. Decímelo y no inventes tareas.",
    "",
    "## Formato de la respuesta",
    "Para cada punto, en este orden:",
    "1. Qué archivo o qué parte del sitio hay que tocar.",
    "2. El código o la configuración exacta, lista para pegar.",
    "3. Cómo verificar que quedó bien (qué mirar, con qué herramienta).",
    visibles.length
      ? `\nAl final, agregá una sección "Requiere decisión" nombrando los ${visibles.length} hallazgos de contenido y diseño que este prompt deja fuera a propósito, sin resolverlos.`
      : null,
    "",
    REGLAS_DE_SALIDA,
  ]
    .filter((linea): linea is string => linea !== null)
    .join("\n");

  return {
    id: "quirurgico",
    label: "Quirúrgico",
    summary: "Arregla solo lo técnico. No toca ni una palabra ni un color.",
    riesgo: "ninguno",
    text: cuerpo,
  };
}

/**
 * Nivel 2. Suma el copy, pero solo las frases exactas que aparecen en la
 * evidencia, y con la estructura y el diseño congelados.
 */
function promptEquilibrado(input: PromptInput): PromptVariant {
  const { findings } = input;
  const tecnicos = findings.filter(esTecnico);
  const deContenido = findings.filter((f) => !esTecnico(f));

  const cuerpo = [
    ROL,
    "",
    contexto(input),
    "",
    REGLA_DE_ORO,
    "",
    "## Alcance: las frases señaladas, con la voz y el diseño intactos",
    "",
    "Podés reescribir únicamente las frases concretas que aparecen en la evidencia de abajo. El resto del texto no se toca, ni siquiera para mejorarlo.",
    "",
    "El diseño queda congelado: no cambies paleta, tipografías, tamaños, orden de secciones, componentes ni imágenes. Si un hallazgo es de estructura visual (por ejemplo, secciones resueltas en grupos de tres), no la rehagas: explicá en una línea qué cambiarías y dejá que lo decida una persona.",
    "",
    deContenido.length ? listaDeProblemas(deContenido, "Frases y elementos a corregir") : null,
    "",
    tecnicos.length ? listaDeProblemas(tecnicos, "Y estos puntos técnicos, que no se ven") : null,
    "",
    "## Formato de la respuesta",
    "Una tabla con tres columnas: qué dice hoy, qué pasaría a decir, por qué cambia. Una fila por frase.",
    "Después, los puntos técnicos con el código exacto.",
    "",
    REGLAS_DE_SALIDA,
  ]
    .filter((linea): linea is string => linea !== null)
    .join("\n");

  return {
    id: "equilibrado",
    label: "Equilibrado",
    summary: "Corrige las frases detectadas y lo técnico. Respeta la voz y el diseño.",
    riesgo: "bajo",
    text: cuerpo,
  };
}

/** Nivel 3. Rehace la página. Cambia identidad, y eso se avisa. */
function promptCompleto(input: PromptInput): PromptVariant {
  const { findings } = input;
  const graves = findings.filter((f) => f.severity === "critica" || f.severity === "alta");

  const cuerpo = [
    ROL,
    "",
    "Cuidado: este prompt rehace la página. Va a cambiar el orden de las secciones y buena parte del texto. Usalo solo si querés replantear la página entera. Si lo que querés es corregir lo que se detectó, usá el nivel Quirúrgico o el Equilibrado.",
    "",
    contexto(input),
    "",
    REGLA_DE_ORO,
    "",
    "## Lo que necesito de vos",
    "",
    "1. **Qué se conserva.** Empezá por acá: la lista de frases, títulos y decisiones visuales propias que sobreviven al rediseño. Si esa lista queda vacía, decilo, porque significa que la página no tiene nada propio todavía.",
    "2. **Estructura de secciones nueva.** El orden que sostenga el argumento de venta. Qué sección sacar, cuál partir, cuál sumar. Evitá resolver todo en grupos de tres.",
    "3. **Copy nuevo donde haga falta.** Reescribí solo las secciones que cambian de función. Con datos concretos y objeciones respondidas. Marcá `[DATO A COMPLETAR: ...]` donde necesites información que no tenés.",
    "4. **Dirección visual.** Paleta con códigos, tipografías, escala, radios y sombras propios. Nada de gradiente violeta a rosa ni de cards con radio grande y sombra por defecto. Si la página ya tiene una identidad que funciona, decilo y no la cambies.",
    "5. **Checklist técnico.** Los puntos de SEO, accesibilidad y performance con el código exacto.",
    "6. **Orden de ataque.** Ordenado por impacto en el negocio, marcando qué se resuelve en una hora y qué necesita una sesión.",
    "",
    listaDeProblemas(findings, "Problemas detectados en esta página"),
    "",
    REGLAS_DE_SALIDA,
    graves.length
      ? `\n> Empezá por lo más grave: ${graves.slice(0, 3).map((f) => f.title.toLowerCase()).join(", ")}.`
      : null,
  ]
    .filter((linea): linea is string => linea !== null)
    .join("\n");

  return {
    id: "completo",
    label: "Rediseño completo",
    summary: "Replantea estructura, copy y dirección visual.",
    riesgo: "alto",
    aviso:
      "Cambia el diseño y buena parte del texto. Puede hacerte perder la identidad de tu página si no revisás lo que devuelve.",
    text: cuerpo,
  };
}

/** Prompt para cuando no se detectó nada: no hay nada que arreglar. */
function promptSinHallazgos({ url, title, score, verdict }: PromptInput): PromptVariant {
  return {
    id: "quirurgico",
    label: "Subir el techo",
    summary: "No hay nada que corregir. Esto busca mejorar lo que ya funciona.",
    riesgo: "ninguno",
    text: [
      "Sos un director creativo y desarrollador web senior. Escribís en español rioplatense.",
      "",
      `Analicé esta página: ${url}${title ? ` ("${title}")` : ""}.`,
      `Resultado: ${score}/10 en el test de "parece hecha por IA" (${verdict}). No se detectaron señales de generación automática ni fallas técnicas relevantes.`,
      "",
      "No hay nada que arreglar, así que no propongas arreglos. Lo que necesito es distinto:",
      "1. Tres ángulos de mensaje para el titular principal, cada uno con una promesa específica y verificable.",
      "2. Una idea de diseño que haga a esta página memorable sin romper lo que ya funciona.",
      "3. Qué contenido nuevo (un caso, un dato propio, una herramienta) le daría una ventaja que la competencia no pueda copiar.",
      "",
      "No inventes datos: si necesitás información, pedímela.",
    ].join("\n"),
  };
}

/**
 * Devuelve los tres niveles de intervención, del más conservador al más
 * invasivo. La UI muestra el quirúrgico primero a propósito.
 */
export function buildPrompts(input: PromptInput): PromptVariant[] {
  if (!input.findings.length) return [promptSinHallazgos(input)];
  return [promptQuirurgico(input), promptEquilibrado(input), promptCompleto(input)];
}
