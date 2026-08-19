import { Analyzer } from "@/components/slopcheck/Analyzer";
import { SIGNALS } from "@/lib/analyzer/registry";
import { CATEGORY_LABEL, type Category } from "@/lib/analyzer/types";

/** Datos estructurados propios de la herramienta, dentro del sitio de MYB. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SlopCheck",
  url: "https://mybdigitals.com/slopcheck",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "Analiza cualquier URL y devuelve un puntaje del 1 al 10 sobre cuánto parece hecha por IA, un informe de problemas y un prompt personalizado para mejorarla.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  inLanguage: "es",
  publisher: {
    "@type": "Organization",
    name: "MYB Digitals",
    url: "https://mybdigitals.com",
  },
};

export default function SlopcheckHome() {
  const categorias = (Object.keys(CATEGORY_LABEL) as Category[])
    .map((cat) => ({ cat, total: SIGNALS.filter((s) => s.category === cat).length }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Analyzer />

      <div className="shell">
        <section className="block" id="que-mira">
          <h2>Qué se revisa</h2>
          <p className="block-lead">
            Se analizan {SIGNALS.length} señales para saber si tu web está hecha con IA. Al final tenés un
            prompt útil para arreglar lo que falle.
          </p>

          <ul className="checks">
            {categorias.map(({ cat, total }) => (
              <li key={cat}>
                <span className="checks-count">{total}</span>
                <span className="checks-label">{CATEGORY_LABEL[cat]}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
