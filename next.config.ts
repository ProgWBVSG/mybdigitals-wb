import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'gregdotel.com',
      },
    ],
  },

  /* Las viejas páginas por tipo de evento se unificaron en la página única,
     donde el visitante elige el evento. Se redirigen para no romper enlaces
     ya compartidos. */
  async redirects() {
    return [
      { source: '/tuinvitaciondigital/bodas', destination: '/tuinvitaciondigital', permanent: true },
      { source: '/tuinvitaciondigital/cumples', destination: '/tuinvitaciondigital', permanent: true },
      // Mensajes se llamaba lu-y-nico: ya no lleva nombres de pareja.
      { source: '/tuinvitaciondigital/i/lu-y-nico', destination: '/tuinvitaciondigital/i/mensajes', permanent: true },
    ];
  },
  /* Páginas legales de Imanía (juego de MyB Digitals). Son HTML estáticos en
     public/imania/: el texto legal vive ahi tal cual, y estas reglas sirven
     las URLs sin .html que piden Google Play y la App Store. */
  async rewrites() {
    return [
      { source: '/imania/privacidad', destination: '/imania/privacidad.html' },
      { source: '/imania/terminos', destination: '/imania/terminos.html' },
      /* Home nueva de MYB, conviviendo con la actual: HTML estático en
         public/nueva/, generado con output/myb-home-v3/publicar.py. */
      { source: '/nueva', destination: '/nueva/index.html' },
      { source: '/nueva/:pagina(area-[a-z]+|soluciones)', destination: '/nueva/:pagina.html' },
    ];
  },
};

export default nextConfig;
