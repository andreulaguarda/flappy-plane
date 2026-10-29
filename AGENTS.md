# Instrucciones para agentes

## Entrega de cambios

- Tras completar cualquier cambio solicitado (código, estilos, configuración o documentación), ejecutar las comprobaciones que correspondan (`npm test` y `npm run build` cuando aplique).
- Hacer `git commit` y `git push` automáticamente al terminar, sin pedir confirmación.
- Usar mensajes de commit descriptivos, en español, resumiendo el cambio.
- Preparar para el commit únicamente los archivos relacionados con la tarea. No incluir cambios locales ajenos, como modificaciones del usuario en `todos.md`.
- No usar `git push --force` ni reescribir historial. Si el push falla o hay conflictos, informar del problema sin forzar.

## Código

- Mantener el estilo, la estructura y los patrones existentes del proyecto.
- Añadir o actualizar tests cuando cambie lógica de juego.
