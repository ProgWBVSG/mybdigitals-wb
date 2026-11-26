/* Todo lo que cambia de un negocio a otro está en este archivo. Marca, colores y clientes son de ejemplo. */
window.MARCA = {
  "id": "tucafeteria",
  "nombre": "Tu Cafetería",
  "logo": [
    "Tu",
    "Cafetería"
  ],
  "logoEstilo": "recto",
  "sellos": 10,
  "hitos": [
    {
      "en": 5,
      "pct": 30
    },
    {
      "en": 10,
      "pct": 100
    }
  ],
  "whatsapp": "",
  "pinDemo": "1234",
  "diasInactivo": 14,
  "horasEntreSellosNfc": 3,
  "membresia": {
    "nombre": "Club del café",
    "precio": 25000,
    "detalle": "Un café por día, de lunes a viernes"
  },
  "local": {
    "lat": -31.4201,
    "lng": -64.1888,
    "radio": 120
  },
  "tema": {
    "--carbon": "#100D0B",
    "--panel": "#1A1512",
    "--linea": "#2F2721",
    "--gris": "#A39686",
    "--crema": "#F4EDE1",
    "--crema-2": "#CFC2AE",
    "--tinta": "#17110D",
    "--tinta-suave": "#66574A",
    "--acento": "#D89A4E",
    "--acento-2": "#A86E2C",
    "--sobre-acento": "#1A0F05",
    "--sobre-sello": "#1A0F05",
    "--madera": "#1E1814",
    "--ruido-papel": "none"
  },
  "css": ".papel,.hoja,.planilla,.ticket{--acento:#8A5A1E;--acento-2:#6A4415;--sobre-acento:#FFFFFF;--sobre-sello:#FFFFFF}",
  "semilla": [
    [
      "Paula Méndez",
      [
        30,
        26,
        21,
        16,
        12,
        8,
        5,
        2
      ]
    ],
    [
      "Bruno Castro",
      [
        14,
        9,
        6,
        1
      ]
    ],
    [
      "Sol Acosta",
      [
        60,
        41,
        22
      ]
    ],
    [
      "Emiliano Luna",
      [
        8,
        3
      ]
    ],
    [
      "Rocío Vega",
      [
        25,
        20,
        17,
        13,
        10,
        7,
        4,
        1,
        0
      ]
    ],
    [
      "Tomás Ibarra",
      [
        90,
        55
      ]
    ],
    [
      "Abril Gómez",
      [
        5
      ]
    ]
  ],
  "logoHtml": "<svg class=\"corona\" viewBox=\"0 0 60 34\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 14h22v8a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9z\"/><path d=\"M39 16h3a4 4 0 0 1 0 8h-3M23 3c-2 3 2 4 0 7M30 2c-2 3 2 4 0 7\"/></g></svg>Tu<span>Cafetería</span>"
};
window.MARCA.selloIcono = function (c) { return '<g fill="none" stroke="' + c + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M28 44h38v12a16 16 0 0 1-16 16h-6a16 16 0 0 1-16-16z"/><path d="M66 48h4a7 7 0 0 1 0 14h-5M24 78h48M40 24c-3 4 3 7 0 12M50 22c-3 4 3 7 0 12M60 24c-3 4 3 7 0 12"/></g>'; };
