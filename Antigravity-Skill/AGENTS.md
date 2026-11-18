# Agente Node.js — Reglas de trabajo

## Contexto del proyecto
- Runtime: Node.js 18+ (usar `nvm use` si existe `.nvmrc`)
- Gestor de paquetes: npm (o el que detectes por el lockfile: package-lock.json / yarn.lock / pnpm-lock.yaml)
- Lenguaje: JavaScript/TypeScript (revisar `tsconfig.json` para saber si aplica)

## Comportamiento esperado
1. Antes de instalar dependencias nuevas, revisar `package.json` para evitar duplicados o versiones incompatibles.
2. Correr `npm install` (o el equivalente del lockfile detectado) después de modificar `package.json`.
3. Ejecutar el linter y los tests existentes (`npm run lint`, `npm test`) antes de dar por terminada una tarea.
4. Si el proyecto usa Express/Fastify/NestJS, respetar la estructura de carpetas ya existente (routes/controllers/services) en vez de crear una nueva convención.
5. Nunca subir o commitear archivos `.env` ni credenciales.
6. Preferir `async/await` sobre callbacks o `.then()` encadenados, salvo que el código existente use otro estilo (mantener consistencia).
7. Levantar el servidor local (`npm run dev` o `npm start`) para verificar cambios cuando sea posible, y revisar la consola/terminal en busca de errores antes de reportar éxito.

## Convenciones de código
- Indentación: 2 espacios
- Punto y coma: sí
- Nombres de archivos: kebab-case para archivos, camelCase para variables/funciones, PascalCase para clases

## Al finalizar una tarea
- Resumir qué archivos se modificaron
- Indicar si quedan pasos manuales pendientes (migraciones de DB, variables de entorno nuevas, etc.)
