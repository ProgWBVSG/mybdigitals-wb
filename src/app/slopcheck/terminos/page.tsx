import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Condiciones de uso de SlopCheck: qué hace la herramienta, qué no garantiza y qué se espera de quien la usa.",
  alternates: { canonical: "/slopcheck/terminos" },
};

export default function Terminos() {
  return (
    <article className="prose">
      <h1>Términos de uso</h1>
      <time dateTime="2026-08-18">Última actualización: 18 de agosto de 2026</time>

      <h2>Qué es esto</h2>
      <p>
        SlopCheck es una herramienta gratuita que analiza una página web pública y devuelve un puntaje,
        un informe y un prompt sugerido. Se ofrece tal cual está, sin garantía de disponibilidad ni de
        exactitud.
      </p>

      <h2>Uso aceptable</h2>
      <p>
        Podés analizar cualquier web pública. No uses la herramienta para automatizar análisis masivos,
        para sobrecargar sitios de terceros ni para presentar los resultados como una auditoría
        certificada. Hay un límite de peticiones por minuto por dirección IP.
      </p>

      <h2>Sobre los resultados</h2>
      <p>
        El puntaje es una heurística sobre 45 señales medibles en el HTML servido. Un puntaje bajo no
        prueba que una web haya sido generada con IA, y un puntaje alto no garantiza que sea buena.
        Los criterios están explicados en la <Link href="/slopcheck/metodologia">metodología</Link>. Las decisiones
        que tomes a partir del informe son tuyas.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        No nos hacemos responsables por daños derivados del uso de la herramienta ni de los cambios que
        hagas en tu web a partir del informe o del prompt generado.
      </p>

      <h2>Cambios</h2>
      <p>
        Estos términos pueden cambiar. La fecha de arriba indica la última versión vigente.
      </p>
    </article>
  );
}
