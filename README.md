# ZenWall

ZenWall e um aplicativo de wallpapers feito com React + Vite, com foco em experiencia mobile, feed continuo de wallpapers, pastas para favoritos e plano premium.

## Recursos

- Feed de wallpapers com carregamento continuo
- Busca e filtro por categoria
- Pull-to-refresh no feed principal
- Bottom navigation para mobile
- Criacao de conta local
- Pastas para organizar wallpapers salvos
- Limite gratuito de 3 saves por dia
- Reset diario baseado no horario de Brasilia
- Liberacao de save extra por fluxo de anuncio simulado
- Plano premium local de R$ 20 com saves ilimitados e sem anuncios
- Preview de wallpaper com download e salvamento

## Stack

- React 19
- Vite 8
- Tailwind CSS 4
- React Router
- TanStack Query
- Sonner
- Lucide React

## Como rodar localmente

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar em modo desenvolvimento

```bash
npm run dev
```

O Vite vai mostrar no terminal uma URL parecida com:

```bash
http://localhost:5173
```

Abra essa URL no navegador para testar o app antes de publicar.

## Como testar uma build local

### 1. Gerar build

```bash
npm run build
```

### 2. Abrir a versao de producao localmente

```bash
npm run preview
```

Isso permite ver como o app ficara publicado, mas ainda so no seu computador.

## Publicar para testes antes do lancamento

Voce tem duas formas simples:

### Opcao 1. Testar localmente

Use `npm run dev` ou `npm run preview`.

### Opcao 2. Publicar em preview privado

Voce pode usar:

- Vercel
- Netlify

Essas plataformas normalmente criam uma URL de preview a cada deploy. Assim voce testa online antes de divulgar.

Se quiser mais controle:

- deixe o repositorio como `private`
- conecte o GitHub na Vercel ou Netlify
- publique e compartilhe a URL so com quem voce quiser

## Deploy sugerido

### Vercel

1. Entre em [https://vercel.com](https://vercel.com)
2. Importe o repositorio `Zenwall`
3. Framework: `Vite`
4. Comando de build: `npm run build`
5. Output directory: `dist`

### Netlify

1. Entre em [https://netlify.com](https://netlify.com)
2. Conecte o repositorio `Zenwall`
3. Build command: `npm run build`
4. Publish directory: `dist`

## Observacoes importantes

- O login, premium e anuncios estao implementados em modo local para demonstracao.
- Os dados de conta, pastas e wallpapers salvos ficam em armazenamento local do navegador.
- O feed tenta buscar wallpapers em fontes abertas em tempo real e usa fallback local quando necessario.
- Para producao real, o ideal e conectar autenticacao, pagamento e anuncios a servicos externos.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Repositorio

[https://github.com/Gazu-app-cyber/Zenwall](https://github.com/Gazu-app-cyber/Zenwall)
