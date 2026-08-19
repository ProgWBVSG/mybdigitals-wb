import { cn } from "@/lib/utils";

/**
 * Fondo de gradiente radial. Se monta como capa de fondo detrás del contenido,
 * por eso es `fixed`: el informe puede ser largo y el degradado no debe repetirse.
 */
export const GradientBackground = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={cn("fixed inset-0", className)}
    style={{
      // z-index 0 y no -10: el body de mybdigitals.com tiene fondo oscuro.
      zIndex: 0,
      background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
    }}
  />
);

export default GradientBackground;
