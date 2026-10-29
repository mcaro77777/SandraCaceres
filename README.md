# Sandra Cáceres — landing page y tarjeta personal

Landing estática, accesible y responsive para la marca personal de Sandra Cáceres. El sitio usa HTML, CSS y JavaScript sin dependencias; Nginx lo sirve dentro de un contenedor Docker listo para Easypanel.

## Easypanel

- Repositorio: `mcaro77777/SandraCaceres`
- Rama: `main`
- Ruta de compilación: `/`
- Tipo de fuente: GitHub
- Puerto interno: `80`
- Dominio: `sandracaceres.eu`

Después de crear el servicio, vincula `sandracaceres.eu` y `www.sandracaceres.eu` en la sección de dominios de Easypanel y habilita HTTPS. El DNS debe apuntar a la IP pública del servidor donde corre Easypanel.

### Estado DNS observado

Comprobación del 29 de octubre de 2026:

- `sandracaceres.eu` resuelve a `2.57.91.91` y todavía muestra la página de dominio estacionado de Hostinger.
- `www.sandracaceres.eu` es un CNAME correcto hacia `sandracaceres.eu`.
- La captura de Easypanel muestra el panel en `2.24.100.127:3000`.

Antes de publicar, confirma que `2.24.100.127` sea la IP pública del servidor Easypanel y, si lo es, reemplaza el registro A de `@` por esa IP. No añadas el puerto `3000` al DNS: el dominio se vincula dentro de Easypanel y el servicio escucha internamente en el puerto `80`.

## Vista local

Puedes abrir `index.html` directamente o servir la carpeta con un servidor HTTP estático.

## Tarjeta de presentación

Los maestros y exportaciones PNG están en `print/`. El PDF final para imprenta queda en `output/pdf/`:

- Tamaño final: 90 × 55 mm.
- Sangrado: 3 mm por lado.
- Documento: 96 × 61 mm.
- Zona segura: 5 mm hacia el interior del corte.
- QR: dirige a `https://sandracaceres.eu/?utm_source=tarjeta&utm_medium=qr&utm_campaign=contacto`.

La tarjeta no imprime el teléfono de la imagen de referencia porque el número visible (`+56 9 8407 149`) parece tener un dígito menos que un móvil chileno válido. Verifícalo antes de añadirlo a una tirada de imprenta.

Para volver a generar los SVG finales:

```powershell
node scripts/build-print.mjs
```

Para imprenta se recomienda papel couché de 350 g con laminado mate. Confirma siempre la plantilla, el perfil CMYK y las marcas de corte con la imprenta antes de producir.

## Uso de marca

La identidad principal del sitio es Sandra Cáceres. Equifax y DICOM aparecen como referencias profesionales en texto, sin redibujar logotipos corporativos. El uso de logotipos oficiales debe contar con autorización y archivos aprobados por la marca.

