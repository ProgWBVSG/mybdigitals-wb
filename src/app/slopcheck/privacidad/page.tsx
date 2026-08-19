import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué datos maneja SlopCheck: no hay cuentas, no hay cookies de seguimiento y las URLs analizadas no se guardan.",
  alternates: { canonical: "/slopcheck/privacidad" },
};

export default function Privacidad() {
  return (
    <article className="prose">
      <h1>Política de privacidad</h1>
      <time dateTime="2026-08-18">Última actualización: 18 de agosto de 2026</time>

      <h2>Datos que se recogen</h2>
      <p>
        Ninguno de carácter personal. No hay registro, no hay cuentas y no se pide email. La URL que
        pegás se usa para hacer el análisis en el momento y no se almacena en ninguna base de datos.
      </p>

      <h2>Cookies</h2>
      <p>
        Este sitio no instala cookies de seguimiento ni herramientas de analítica de terceros. Por eso no
        vas a ver un banner de consentimiento: no hay nada que consentir.
      </p>

      <h2>Peticiones a sitios de terceros</h2>
      <p>
        Para analizar una web, el servidor le hace peticiones HTTP públicas, como haría cualquier
        navegador o buscador. Esas peticiones quedan registradas en los logs del sitio analizado, no en
        los nuestros.
      </p>

      <h2>Registros técnicos</h2>
      <p>
        La dirección IP se usa en memoria y de forma temporal solo para limitar la cantidad de análisis
        por minuto, y se descarta al poco tiempo. El proveedor de hosting puede conservar logs técnicos
        propios según su propia política.
      </p>

      <h2>Contacto</h2>
      <p>
        Si querés que se revise algo relacionado con esta política, escribí a{" "}
        <a href="mailto:hola@slopcheck.app">hola@slopcheck.app</a>.
      </p>
    </article>
  );
}
