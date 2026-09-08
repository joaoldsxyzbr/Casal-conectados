# Casal Conectados

Aplicativo privado de casal em desenvolvimento.

## Estado atual

A implementação publicada em `main` ainda corresponde ao **Front v0.3**, centrado em mapa, perfis simulados e ações de localização. Essa versão continua funcional e permanece como base técnica até a nova fase ser implementada.

### Front v0.3 implementado

- mapa com OpenStreetMap/Leaflet;
- dois perfis simulados: João e Amor;
- painel flutuante e tela Pessoas;
- detalhe individual;
- ações rápidas simuladas;
- navegação `Mapa` / `Pessoas`;
- layout mobile-first com safe areas;
- testes, TypeScript, build, audit e deploy via Cloudflare Workers Static Assets.

## Próxima fase aprovada — mensagens rápidas

O produto foi redefinido antes de adicionar backend ou localização real.

A próxima fase troca o foco de rastreamento por **comunicação rápida e privada entre o casal**, com:

- Home minimalista em grade 2xN;
- seis recados de um toque;
- mensagem curta personalizada;
- Chat com histórico unificado;
- tela `Nós` com João + Amor e contador desde `16/09/2022`;
- navegação `Início · Chat · Nós`;
- persistência local com `localStorage` apenas para o protótipo front-end.

### Atalhos definidos

- `Bom dia ❤️`
- `Tô com saudade 🥰`
- `Te amo ❤️`
- `Cheguei 🏠`
- `Flor do dia 🌷`
- `Pensando em você 💭`

### Escopo desta próxima fase

Será **somente front-end**. Não serão adicionados ainda:

- backend;
- Cloudflare D1;
- login/cadastro;
- pareamento real;
- sincronização entre celulares;
- push real;
- chat realtime;
- GPS/localização;
- fotos, anexos ou áudio.

O mapa, Leaflet e os fluxos orientados a localização serão removidos quando a implementação desta nova fase começar.

## Stack atual

- React
- TypeScript
- Vite
- Lucide React
- Vitest
- Testing Library
- Cloudflare Workers Static Assets / Wrangler
- React Leaflet / Leaflet ainda presentes em `main` até a migração da nova fase

## Desenvolvimento

```bash
npm install
npm run dev
```

## Validação

```bash
npm test -- --run
npm run typecheck
npm run build
npm audit --audit-level=high
```

## Deploy no Cloudflare

O `wrangler.jsonc` é a fonte de verdade do deploy. Ele executa `npm run build` automaticamente e publica `./dist`.

Configuração esperada no Cloudflare Workers Builds:

- Production branch: `main`
- Build command: pode ficar vazio
- Deploy command: `npx wrangler deploy`
- Root directory: raiz do repositório

## Documentação de produto

- Spec inicial: `docs/superpowers/specs/2026-09-06-front-v0.1-design.md`
- Plano inicial: `docs/superpowers/plans/2026-09-06-front-v0.1.md`
- Evolução v0.2: mudança bounded aprovada em chat, focada na aba `Pessoas`.
- Spec v0.3: `docs/superpowers/specs/2026-09-07-person-detail-v0.3-design.md`
- Plano v0.3: `docs/superpowers/plans/2026-09-07-person-detail-v0.3.md`
- **Nova fase de mensagens rápidas:** `docs/superpowers/specs/2026-09-07-casal-conectados-mensagens-v1-design.md`

A implementação da nova fase só deve começar após revisão e aprovação final da spec correspondente.
