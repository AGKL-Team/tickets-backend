# Sistema de Gestión de Reclamos de Clientes

## 📌 Descripción

Aplicación para gestionar reclamos de clientes. Permite a los clientes abrir reclamos, clasificarlos por categoría y prioridad, y gestionar su ciclo de vida hasta resolución o cancelación.

## 🎯 Alcance

- Registro y gestión de reclamos (crear, actualizar, consultar, cancelar)
- Gestión de prioridades y categorías de reclamos
- Control de estados del reclamo (pending, in progress, resolved, cancelled)
- Autenticación vía Firebase y autorización por roles (admin, staff, client)

## 📋 Requisitos previos

- Node.js v18+
- Yarn

> Nota: Para instalar las herramientas necesarias visita:
>
> - Node: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
> - Yarn: [https://classic.yarnpkg.com/en/docs/install#debian-stable](https://classic.yarnpkg.com/en/docs/install#debian-stable)

## ⚒️ Instalación

```bash
git clone <tu-repo>
cd ./backend
yarn install
```

## ▶️ Ejecución

```bash
# Modo desarrollo
yarn run start

# Modo watch
yarn run start:dev
```

## 🧪 Tests

```bash
# Unit tests
yarn run test

# Cobertura
yarn run test:cov
```

## 🌐 Despliegue en producción

```bash
# Instalar el CLI de vercel
npm install -g vercel

# Loguearse
vercel login

# Para deploys

# Para un deploy con dominio temporal (Preview)
# Genera una url específica para la branch
vercel

# Para un deploy con dominio fijo (Production)
vercel --prod
```

## </> Análisis de código estático

Para generar el reporte de análisis de código estático utilizamos ESLint junto a Prettier.

```bash
# Generación del reporte en formato HTML
npx eslint "./src/**/*.{ts,tsx}" --format html --output-file eslint-report.html
```

## 👨‍💻 Autores

- AGKL Team
  - Amante Aldana
  - Gutierrez Alexis
  - Koncurat Thomas
  - Lattazi Valentino

- [Universidad Tecnológica Nacional - Villa María](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.frvm.utn.edu.ar/&ved=2ahUKEwidzN2etMSPAxW5IrkGHa5TAT0QFnoECDkQAQ&usg=AOvVaw2wudWAq9epLXJwg2kQfyWs)
- Materia: Ingeniería de Software
