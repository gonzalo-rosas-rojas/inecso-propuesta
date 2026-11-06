# Diseño del showcase de INECSO

## Qué es

Una página que se vende sola: cuenta la propuesta completa a INECSO Ingeniería (web nueva primero, portal de clientes después, cómo trabajaríamos y cómo se cobra) y deja recorrer una demo navegable de su web nueva. La revisa Gonza antes de enviarla.

- **Audiencia:** la gerencia de INECSO. No son técnicos de software; sí son técnicos de lo suyo.
- **Decisión en 30 segundos:** "esto es serio y es para nosotros".
- **Prueba en 3 minutos:** ven su web nueva funcionando con sus propios textos, ven cómo un cliente seguiría su obra, y entienden qué cuesta y cómo se paga.

## Idea rectora

La propuesta se recorre como una obra eléctrica. Arriba, la web está sin luz (lo que inecso.cl muestra de verdad hoy: una carpeta vacía). Abajo, la puesta en servicio. Entre medio, las etapas de una obra: levantamiento, proyecto, ejecución, portal, plan, opciones.

**Objeto memorable:** un diagrama unifilar (el plano de una línea de los eléctricos) fijo a la izquierda. Arranca en el empalme con el interruptor abierto; al bajar, el interruptor se cierra y la corriente (amarillo) avanza de nodo en nodo. El gesto grande ocurre una sola vez, al final: la línea llega a la carga y la última pantalla se enciende.

## Tokens

| Nombre | Hex | Trabajo |
|---|---|---|
| grafito | `#1B2024` | sin energía: la apertura y la demo apagada |
| tinta | `#22292F` | texto |
| papel | `#ECEEEA` | fondo de plano (gris frío, no crema) |
| cianotipo | `#24518F` | líneas de plano, enlaces, la marca INECSO propuesta |
| energía | `#F2C014` | solo lo energizado: la corriente, el botón principal |
| tierra | `#2F8F5B` | "cumple" / etapa terminada |
| falla | `#B5402A` | "no cumple" |

Tipografía: una sola familia, **Archivo** (variable, OFL, local). El ancho es parte del diseño: titulares en ancho 125 y peso 800 como las placas de características de un transformador; texto en ancho 100; rótulos técnicos en ancho 75. Sin mono, sin versales de adorno: los únicos textos en mayúscula son códigos reales (TE1, SEC, kVA).

## Reglas

- La numeración solo donde hay secuencia real (etapas de la obra, plan de trabajo).
- Nada de tarjetas iguales con sombra; la estructura se dibuja con las líneas del plano.
- Movimiento: el unifilar atado al scroll; un encendido de la demo al cargar; nada que entre deslizando en cada sección. `prefers-reduced-motion` deja todo quieto y legible.
- Datos: lo real sale de la web antigua archivada o de una medición propia y lo dice; lo ficticio (obras del portal, fechas de bitácora) va rotulado como ejemplo.
- Sitio estático sin dependencias, sin scripts ni estilos en línea, CSP estricta; se abre también con doble clic (scripts clásicos, no módulos).

## Revisión contra lo genérico

- El fondo oscuro con un acento amarillo es un cliché industrial. Aquí lo oscuro solo vive en la apertura (la web apagada) y el amarillo tiene un único trabajo: energía.
- Se descartó "cifra gigante con etiqueta" para el hero de la demo: en su lugar, la placa de características de INECSO.
- Se descartó el 01/02/03 decorativo: los nodos del unifilar llevan el nombre de la etapa.
