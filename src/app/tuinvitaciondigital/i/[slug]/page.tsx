import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Carta from "@/components/invitacion/Carta";
import Hero from "@/components/invitacion/Hero";
import SeccionCierre from "@/components/invitacion/SeccionCierre";
import SeccionCronograma from "@/components/invitacion/SeccionCronograma";
import SeccionFrase from "@/components/invitacion/SeccionFrase";
import SeccionLugares from "@/components/invitacion/SeccionLugares";
import SeccionRegalos from "@/components/invitacion/SeccionRegalos";
import SeccionRsvp from "@/components/invitacion/SeccionRsvp";
import SeccionVestimenta from "@/components/invitacion/SeccionVestimenta";
import { buscarInvitacion, slugsDeInvitaciones } from "@/invitaciones";

type Props = { params: Promise<{ slug: string }> };

/* Las invitaciones son pocas y conocidas de antemano: se prerenderizan todas
   para que abran al instante desde WhatsApp, que es de donde llega la gente. */
export function generateStaticParams() {
  return slugsDeInvitaciones().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const inv = buscarInvitacion(slug);
  if (!inv) return {};

  return {
    title: `${inv.nombres} · ${inv.fecha}`,
    description: `${inv.volanta} — ${inv.nombres}. ${inv.fecha}.`,
    // La previsualización en WhatsApp es el sobre: es lo primero que ve el
    // invitado, antes incluso de tocar el link.
    openGraph: {
      title: `${inv.nombres} · ${inv.fecha}`,
      description: inv.volanta,
      images: [inv.carta.imagen],
    },
  };
}

export default async function PaginaInvitacion({ params }: Props) {
  const { slug } = await params;
  const invitacion = buscarInvitacion(slug);
  if (!invitacion) notFound();

  return (
    <Carta datos={invitacion.carta}>
      <main className="inv-columna inv-grano">
        <Hero invitacion={invitacion} />

        {invitacion.frase && (
          <SeccionFrase
            frase={invitacion.frase}
            fecha={invitacion.fecha}
            flores={invitacion.flores?.[0]}
          />
        )}

        {invitacion.cronograma && (
          <SeccionCronograma
            hitos={invitacion.cronograma}
            flores={invitacion.flores?.[1] ?? invitacion.flores?.[0]}
          />
        )}

        {invitacion.lugares && (
          <SeccionLugares
            lugares={invitacion.lugares}
            ilustracion={invitacion.ilustracionLugar}
            flores={invitacion.flores?.[2] ?? invitacion.flores?.[0]}
          />
        )}

        {invitacion.dressCode && (
          <SeccionVestimenta
            titulo={invitacion.dressCode.titulo}
            detalle={invitacion.dressCode.detalle}
            ilustracion={invitacion.ilustracionVestimenta}
            flores={invitacion.flores?.[0]}
          />
        )}

        {invitacion.regalo && (
          <SeccionRegalos regalo={invitacion.regalo} flores={invitacion.flores?.[1]} />
        )}

        <SeccionRsvp
          slug={invitacion.slug}
          sello={invitacion.sello}
          cierre={invitacion.cierreRsvp}
          flores={invitacion.flores?.[2]}
        />

        {/* La galería queda fuera de este modelo a propósito: Rosa se sostiene
            con el diseño y no con fotos de la pareja. */}
        <SeccionCierre
          nombres={invitacion.nombres}
          fecha={invitacion.fecha}
          flores={invitacion.flores?.[0]}
        />
      </main>
    </Carta>
  );
}
