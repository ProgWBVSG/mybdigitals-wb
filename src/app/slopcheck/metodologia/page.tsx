import type { Metadata } from "next";
import { SIGNALS } from "@/lib/analyzer/registry";
import { AUTHORSHIP_CODES } from "@/lib/analyzer/score";
import { CATEGORY_LABEL, SEVERITY_WEIGHT, type Category } from "@/lib/analyzer/types";

export const metadata: Metadata = {
  title: "Metodología: las 45 señales y cómo se calcula el puntaje",
  description:
    "Qué mide SlopCheck, por qué el puntaje separa autoría de terminado técnico, cuánto pesa cada señal y qué cosas el análisis no puede ver.",
  alternates: { canonical: "/slopcheck/metodologia" },
};

export default function Metodologia() {
  const categorias = Object.keys(CATEGORY_LABEL) as Category[];

  return (
    <article className="prose" style={{ maxWidth: "72ch" }}>
      <h1>Cómo se calcula el puntaje</h1>

      <p>
        El análisis descarga la home, el robots.txt, el sitemap, el llms.txt, las páginas legales, una
        segunda página interna y una URL inexistente para ver qué devuelve el 404. Después pesa el
        JavaScript, revisa si los sourcemaps están públicos y lee el texto visible.
      </p>

      <h2>Dos ejes, no uno</h2>
      <p>
        La pregunta que responde el número es una sola: <strong>¿parece hecha con IA?</strong> Por eso las
        señales están separadas en dos grupos que pesan distinto.
      </p>
      <ul>
        <li>
          <strong>Autoría ({AUTHORSHIP_CODES.size} señales).</strong> Lo que delata que el contenido y la
          estructura salieron de un generador: rótulos funcionales en cada sección, vocabulario de
          modelo, placeholders sin completar, la plantilla visual de siempre, restos del scaffold. Este
          eje puede restar hasta 7,5 puntos.
        </li>
        <li>
          <strong>Terminado técnico ({SIGNALS.length - AUTHORSHIP_CODES.size} señales).</strong> Falta de
          sitemap, de canonical, de páginas legales, errores de accesibilidad, imágenes sin optimizar.
          Cosas que también le pasan a una web escrita a mano, así que solo pueden restar 2,5 puntos.
        </li>
      </ul>
      <p>
        La primera versión sumaba todo junto y el resultado no servía: un HTML artesanal sin sitemap
        puntuaba igual que una plantilla publicada sin tocar. Separar los ejes arregla eso. Hoy un sitio
        hecho a mano pero con el SEO abandonado saca alrededor de 7,5, y una landing de plantilla saca
        entre 5 y 6.
      </p>

      <h2>El peso de cada señal</h2>
      <p>
        Dentro de cada eje, la penalización depende de la gravedad: baja {SEVERITY_WEIGHT.baja}, media{" "}
        {SEVERITY_WEIGHT.media}, alta {SEVERITY_WEIGHT.alta}, crítica {SEVERITY_WEIGHT.critica}. El
        puntaje mínimo es 1 y el máximo 10.
      </p>
      <p>
        Un 10 no significa que la web sea buena: significa que ninguna de estas 45 señales aparece. Un 3
        tampoco prueba que se haya usado IA: significa que tiene las marcas que deja generarla y no
        revisarla después.
      </p>

      <h2>Lo que este análisis no puede ver</h2>
      <p>
        Todo se mide sobre el HTML servido y los archivos que la página referencia, sin abrir un
        navegador real. Eso implica límites concretos:
      </p>
      <ul>
        <li>
          Si el sitio se pinta entero con JavaScript, el analizador lee lo mismo que Google en la primera
          pasada: nada. En ese caso se avisa en el informe y las señales de contenido quedan marcadas
          como no comprobables, en vez de darlas por buenas.
        </li>
        <li>
          Los errores de consola se infieren de los recursos que devuelven error, no de la ejecución del
          JavaScript.
        </li>
        <li>
          El contraste de color y el foco visible se revisan sobre el CSS declarado, no sobre los píxeles
          renderizados.
        </li>
        <li>
          El peso del JavaScript se mide ya descomprimido, que es más alto que lo que viaja por la red.
        </li>
      </ul>

      <h2>Las {SIGNALS.length} señales</h2>
      {categorias.map((cat) => {
        const items = SIGNALS.filter((s) => s.category === cat);
        if (!items.length) return null;
        return (
          <section key={cat}>
            <h2>{CATEGORY_LABEL[cat]}</h2>
            <ul>
              {items.map((s) => (
                <li key={s.code}>
                  <strong>
                    {s.code}. {s.title}
                  </strong>{" "}
                  <span style={{ color: "var(--ink-muted)" }}>
                    ({s.severity}, {AUTHORSHIP_CODES.has(s.code) ? "autoría" : "terminado"})
                  </span>{" "}
                  — {s.why}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </article>
  );
}
