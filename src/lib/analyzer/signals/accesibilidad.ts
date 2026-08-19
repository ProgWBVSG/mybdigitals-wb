import { flag, trim, type Detector } from "./helpers";

/** Señal 20 — sin atributo lang. */
const noLang: Detector = ({ $ }) => {
  const lang = $("html").attr("lang");
  if (lang && lang.trim().length >= 2) return null;
  return flag("no-lang", "La etiqueta html no declara el idioma del contenido.");
};

/** Señal 21 — imágenes sin alt. */
const missingAlt: Detector = ({ $ }) => {
  const imgs = $("img").toArray();
  if (!imgs.length) return null;
  const missing = imgs.filter((el) => $(el).attr("alt") === undefined);
  if (!missing.length) return null;
  // Un alt vacío es válido para decorativas; acá se cuenta solo el atributo ausente.
  const ratio = missing.length / imgs.length;
  if (missing.length < 2 && ratio < 0.3) return null;
  return flag(
    "missing-alt",
    `${missing.length} de ${imgs.length} imágenes no tienen atributo alt.`,
    missing.slice(0, 5).map((el) => trim($(el).attr("src") ?? "<img sin src>", 110)),
  );
};

/** Señal 36 — fallas de accesibilidad que se ven sin renderizar. */
const a11yBasics: Detector = ({ $, lower }) => {
  const problems: string[] = [];
  const evidence: string[] = [];

  // Inputs sin label asociada ni aria-label.
  const inputs = $("input:not([type=hidden]), select, textarea").toArray();
  const unlabeled = inputs.filter((el) => {
    const $el = $(el);
    if ($el.attr("aria-label") || $el.attr("aria-labelledby") || $el.attr("title")) return false;
    const id = $el.attr("id");
    if (id && $(`label[for="${id}"]`).length) return false;
    return $el.parents("label").length === 0;
  });
  if (unlabeled.length) {
    problems.push(`${unlabeled.length} campo(s) de formulario sin label`);
    evidence.push(...unlabeled.slice(0, 3).map((el) => `<${el.tagName} ${$(el).attr("name") ?? $(el).attr("type") ?? ""}>`));
  }

  // Botones y enlaces de solo ícono sin nombre accesible.
  const namelessButtons = $("button, a[href]").toArray().filter((el) => {
    const $el = $(el);
    if ($el.attr("aria-hidden") === "true") return false;
    if ($el.text().replace(/\s+/g, "").length > 0) return false;
    if ($el.attr("aria-label") || $el.attr("aria-labelledby") || $el.attr("title")) return false;
    if ($el.find("img[alt]:not([alt=''])").length) return false;
    // Un <svg> con <title> también aporta nombre accesible.
    if ($el.find("svg title").length) return false;
    return true;
  });
  if (namelessButtons.length >= 2) {
    problems.push(`${namelessButtons.length} botón(es) o enlace(s) de solo ícono sin nombre accesible`);
  }

  // Foco anulado por CSS.
  if (/outline:\s*(none|0)/.test(lower) && !/:focus-visible/.test(lower)) {
    problems.push("el outline de foco está desactivado por CSS sin reemplazo");
    evidence.push("outline: none sin :focus-visible");
  }

  // Salto de jerarquía de encabezados.
  const levels = $("h1, h2, h3, h4, h5, h6").toArray().map((el) => Number(el.tagName[1]));
  const jump = levels.some((lvl, i) => i > 0 && lvl - levels[i - 1] > 1);
  if (jump) problems.push("la jerarquía de encabezados salta niveles (por ejemplo, de H2 a H4)");

  // Texto de enlace sin significado.
  const vagueLinks = $("a").toArray().filter((el) => /^(clic aquí|click here|acá|aquí|leer más|read more|ver más|más info)$/i.test($(el).text().trim()));
  if (vagueLinks.length >= 3) problems.push(`${vagueLinks.length} enlaces con texto vago ("clic aquí", "leer más")`);

  if (problems.length < 1) return null;
  return flag("a11y-basics", `Fallas de accesibilidad detectables en el HTML: ${problems.join("; ")}.`, evidence);
};

export const accesibilidadDetectors: Detector[] = [noLang, missingAlt, a11yBasics];
