/* Todo lo que cambia de un negocio a otro está en este archivo. Marca, colores y clientes son de ejemplo. */
window.MARCA = {
  "id": "turestaurante",
  "nombre": "Tu Restaurante",
  "logo": [
    "Tu",
    "Restaurante"
  ],
  "logoEstilo": "recto",
  "sellos": 10,
  "hitos": [
    {
      "en": 5,
      "pct": 15
    },
    {
      "en": 10,
      "pct": 40
    }
  ],
  "whatsapp": "",
  "pinDemo": "1234",
  "diasInactivo": 30,
  "horasEntreSellosNfc": 12,
  "membresia": null,
  "local": {
    "lat": -31.4201,
    "lng": -64.1888,
    "radio": 150
  },
  "tema": {
    "--carbon": "#120C0B",
    "--panel": "#1C1412",
    "--linea": "#362925",
    "--gris": "#A8988F",
    "--crema": "#F3ECE2",
    "--crema-2": "#CDBFB0",
    "--tinta": "#1A1210",
    "--tinta-suave": "#6A5A52",
    "--acento": "#D2553F",
    "--acento-2": "#9E3A28",
    "--sobre-acento": "#FFFFFF",
    "--sobre-sello": "#FFFFFF",
    "--madera": "#221714",
    "--ruido-papel": "none"
  },
  "css": ".papel,.hoja,.planilla,.ticket{--acento:#A8372A;--acento-2:#7E2A1F;--sobre-acento:#FFFFFF;--sobre-sello:#FFFFFF}",
  "semilla": [
    [
      "Florencia Díaz",
      [
        120,
        90,
        61,
        40,
        18,
        4
      ]
    ],
    [
      "Martín Herrera",
      [
        200,
        170,
        140,
        110,
        80,
        52,
        30,
        12,
        2
      ]
    ],
    [
      "Camila Ortiz",
      [
        70,
        33,
        9
      ]
    ],
    [
      "Gonzalo Ríos",
      [
        150,
        96
      ]
    ],
    [
      "Julieta Sosa",
      [
        210,
        175,
        140,
        101,
        77,
        49,
        22
      ]
    ],
    [
      "Ramiro Paz",
      [
        45,
        3
      ]
    ],
    [
      "Lucía Ferreyra",
      [
        12
      ]
    ]
  ],
  "logoHtml": "<svg class=\"corona\" viewBox=\"0 0 60 34\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.6\" stroke-linecap=\"round\"><path d=\"M10 26a20 20 0 0 1 40 0\"/><path d=\"M5 27h50\"/><circle cx=\"30\" cy=\"5\" r=\"2.2\" fill=\"currentColor\"/><path d=\"M30 7.5V9\"/></g></svg>Tu<span>Restaurante</span>"
};
window.MARCA.selloIcono = function (c) { return '<g fill="none" stroke="' + c + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="52" r="17"/><circle cx="50" cy="52" r="10" stroke-width="2"/><path d="M24 30v12a4 4 0 0 0 4 4v28M20 30v10M28 30v10M76 30c-5 3-6 11-6 18h6v26"/></g>'; };
