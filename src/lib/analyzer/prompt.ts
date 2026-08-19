import { CATEGORY_LABEL, type Finding } from "./types";
import { groupByCategory } from "./score";

interface PromptInput {
  url: string;
  title: string | null;
  score: number;
  verdict: string;
  findings: Finding[];
}

/**
 * Arma el prompt que la persona copia y pega en su IA.
 * Todo lo que entra sale del análisis real: los problemas, las evidencias
 * y los entregables que se piden dependen de lo que se encontró.
 */
export function buildPrompt({ url, title, score, verdict, findings }: PromptInput): string {
  if (!findings.length) {
    return [
      "Sos un director creativo y desarrollador web senior.",
      "",
      `Analicé esta página: ${url}${title ? ` ("${title}")` : ""}.`,
      `Resultado: ${score}/10 en el test de "parece hecha por IA" (${verdict}). No se detectaron señales de generación automática ni fallas técnicas relevantes.`,
      "",
      "Tu tarea ahora no es arreglar, es subir el techo. Dame:",
      "1. Tres ángulos de mensaje distintos para el titular principal, cada uno con una promesa específica y verificable.",
      "2. Una idea de diseño que haga a esta página memorable sin romper lo que ya funciona.",
      "3. Qué contenido nuevo (caso, dato propio, herramienta) le daría una ventaja que la competencia no pueda copiar.",
      "Respondé en español rioplatense, concreto y sin relleno.",
    ].join("\n");
  }

  const grupos = groupByCategory(findings);
  const criticos = findings.filter((f) => f.severity === "critica" || f.severity === "alta");

  const lineas: string[] = [];

  lineas.push(
    "Sos un director creativo, copywriter y desarrollador web senior. Escribís en español rioplatense, con lenguaje concreto, sin frases de relleno y sin vocabulario de IA.",
  );
  lineas.push("");
  lineas.push("## Contexto");
  lineas.push(`- URL: ${url}`);
  if (title) lineas.push(`- Título actual: "${title}"`);
  lineas.push(`- Diagnóstico automático: ${score}/10 en el test de "cuánto parece hecha por IA" (${verdict}).`);
  lineas.push(`- Se detectaron ${findings.length} problemas concretos, listados abajo con su evidencia.`);
  lineas.push("");

  lineas.push("## Problemas detectados en esta página");
  for (const grupo of grupos) {
    lineas.push("");
    lineas.push(`### ${CATEGORY_LABEL[grupo.category]}`);
    for (const f of grupo.findings) {
      lineas.push(`- **${f.title}** (gravedad ${f.severity}). ${f.detail}`);
      if (f.evidence.length) {
        lineas.push(`  - Evidencia: ${f.evidence.slice(0, 3).map((e) => `\`${e}\``).join(" · ")}`);
      }
      lineas.push(`  - Cómo se corrige: ${f.fix}`);
    }
  }

  lineas.push("");
  lineas.push("## Lo que necesito de vos");
  lineas.push("");

  const entregables: string[] = [];

  // Los entregables se arman según lo que realmente falló.
  const has = (id: string) => findings.some((f) => f.id === id);
  const hasCat = (cat: string) => findings.some((f) => f.category === cat);

  if (has("generic-section-labels") || has("ai-phrases") || has("no-specifics") || has("em-dashes")) {
    entregables.push(
      "**Titulares y subtítulos nuevos.** Reescribí el H1, los H2 de cada sección y los subtítulos. Cada titular tiene que decir algo que solo esta empresa pueda decir: un número, un plazo, un nombre, un resultado. Nada de rótulos funcionales tipo \"Servicios\" o \"Testimonios\".",
    );
  }
  if (has("generic-layout") || has("three-part-solution") || has("class-soup") || has("italic-abuse")) {
    entregables.push(
      "**Estructura de secciones nueva.** Proponé el orden de secciones que sostenga el argumento de venta, no la plantilla. Decime qué sección sacar, cuál partir y cuál sumar. Evitá resolver todo en grupos de tres.",
    );
  }
  if (hasCat("contenido") || has("ai-phrases") || has("emoji-overload")) {
    entregables.push(
      "**Copy más humano y específico.** Reescribí el texto de cada sección con datos concretos, ejemplos reales y objeciones respondidas. Marcá con `[DATO A COMPLETAR: ...]` cada lugar donde necesites información que yo tengo que aportar, en vez de inventarla.",
    );
  }
  if (has("fake-testimonials")) {
    entregables.push(
      "**Plan de prueba social real.** Decime exactamente qué pedirle a cada cliente para conseguir un testimonio verificable (nombre, empresa, resultado medible, foto, enlace) y cómo mostrarlo. Si hoy no hay material, proponé con qué reemplazar la sección mientras tanto.",
    );
  }
  if (hasCat("diseno") || has("generator-classes")) {
    entregables.push(
      "**Sugerencias de diseño y UX.** Dame una dirección visual concreta: paleta (con códigos), tipografías, escala tipográfica, radios y sombras propios. Nada de gradiente violeta a rosa, ni de cards con radio grande y sombra por defecto.",
    );
  }

  const tecnicos = findings.filter((f) =>
    ["seo", "tecnico", "performance", "accesibilidad"].includes(f.category),
  );
  if (tecnicos.length) {
    entregables.push(
      `**Checklist técnico accionable.** Convertí estos ${tecnicos.length} puntos en tareas con el código o la configuración exacta para resolverlos: ${tecnicos
        .map((f) => f.title.toLowerCase())
        .join("; ")}.`,
    );
  }

  entregables.push(
    "**Orden de ataque.** Ordená todo lo anterior por impacto sobre el resultado del negocio, y marcá qué se puede resolver en una hora y qué necesita una sesión de trabajo.",
  );

  entregables.forEach((e, i) => lineas.push(`${i + 1}. ${e}`));

  lineas.push("");
  lineas.push("## Reglas de la respuesta");
  lineas.push("- Nada de emojis en el copy ni rótulos genéricos arriba de las secciones.");
  lineas.push("- Nada de guiones largos dentro de las frases: punto, coma o paréntesis.");
  lineas.push(
    "- Prohibido el vocabulario de IA: nada de \"en el panorama digital actual\", \"desbloqueá el poder de\", \"llevá tu negocio al siguiente nivel\", \"soluciones de vanguardia\".",
  );
  lineas.push("- No inventes datos, cifras, clientes ni casos. Si falta información, pedímela.");
  lineas.push("- Entregá el copy listo para pegar, no descripciones de lo que habría que escribir.");

  if (criticos.length) {
    lineas.push("");
    lineas.push(
      `> Empezá por lo más grave: ${criticos
        .slice(0, 3)
        .map((f) => f.title.toLowerCase())
        .join(", ")}.`,
    );
  }

  return lineas.join("\n");
}
