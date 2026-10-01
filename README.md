# OpenNext Starter

Template base de **Next.js + OpenNext (Cloudflare Workers)**, listo para clonar y renombrar.

## Descripción

Este repositorio sirve como plantilla para aplicaciones Frontend en Next.js (App Router) preparada para:

- Desarrollo local con `next dev`
- Build + preview + deploy sobre Cloudflare Workers (OpenNext)
- Script de inicialización (`npm run init`) para renombrar el proyecto e iniciar un nuevo repositorio Git

## Getting Started

Lee la documentación en:

- https://opennext.js.org/cloudflare
- https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/

## Requisitos

- Repositorio Git y configuracion SSH
  https://support.atlassian.com/bitbucket-cloud/docs/configure-ssh-and-two-step-verification/

## Usar este repo como template

1. Clona / descarga este repositorio.
2. Instala dependencias:

```bash
npm install
```

3. Corre el script para iniciar el proyecto:

```bash
npm run init
```

4. (Opcional) Durante `npm run init` puedes elegir reinicializar Git.

- Si respondes que sí, el script:
  - elimina la carpeta `.git`
  - ejecuta `git init`
  - te pide el URL del repositorio remoto y lo configura como `origin`

Luego haz tu primer commit y push:

```bash
git add -A
git commit -m "chore: init"
git checkout -b develop
git push -u origin develop
```

## Estructura de carpetas

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── presentation/
│   ├── components/
│   ├── config/
│   │   ├── inversify.config.ts
│   │   ├── queryClient.ts
│   │   └── store.ts
│   ├── hooks/
│   ├── pages/
│   └── redux/
│       ├── features/
│       └── middleware/
├── domain/
└── data/
```

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
