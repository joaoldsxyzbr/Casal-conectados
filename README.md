# Casal Conectados

Aplicativo de casal em desenvolvimento, começando por uma experiência mobile de localização inspirada no conceito geral do Life360, sem copiar sua identidade visual.

## Estado atual

**Front v0.3**

A versão atual continua exclusivamente visual e usa dados simulados. O objetivo desta etapa é validar o fluxo de detalhe individual e ações rápidas antes de adicionar autenticação, backend ou localização real.

### Implementado

- mapa ocupando a tela principal;
- tiles do OpenStreetMap via Leaflet;
- dois perfis simulados: João e Amor;
- marcadores simulados no mapa;
- status `Atualizado agora` para os dois perfis;
- painel inferior flutuante no mapa;
- cards de João e Amor no painel do mapa são interativos e abrem o detalhe individual;
- navegação inferior funcional entre `Mapa` e `Pessoas`;
- tela `Pessoas` com os dois membros do círculo e indicação de localização ativa;
- detalhe individual de João e Amor ao tocar no card da pessoa, tanto no mapa quanto na tela `Pessoas`;
- ao voltar do detalhe, o app retorna para a tela de origem (`Mapa` ou `Pessoas`);
- localização simulada `Biguaçu, SC` no detalhe;
- cinco ações rápidas: `Ver no mapa`, `Rota`, `Mensagem`, `Ligar` e `Atualizar`;
- `Ver no mapa` retorna ao mapa e centraliza a posição mockada da pessoa selecionada;
- `Rota`, `Mensagem` e `Ligar` exibem feedback local sem integração externa;
- `Atualizar` simula solicitação e conclusão de atualização de localização;
- navegação inferior oculta durante o detalhe;
- estado visual correto da aba ativa;
- layout mobile-first com suporte a safe areas de Android/iOS;
- fallback visual se os tiles do mapa falharem;
- CI com testes, TypeScript, build e auditoria de dependências;
- configuração de deploy via Cloudflare Workers Static Assets.

### Deliberadamente fora da v0.3

- login e cadastro;
- pareamento real;
- backend e banco de dados;
- GPS real;
- rastreamento em segundo plano;
- bateria e velocidade reais;
- histórico de localização;
- geofencing;
- notificações;
- abertura de Google Maps, Apple Maps, mensageiros ou chamadas reais;
- edição de perfil;
- publicação na Play Store ou App Store.

## Stack

- React
- TypeScript
- Vite
- React Leaflet / Leaflet
- OpenStreetMap
- Lucide React
- Vitest
- Testing Library
- Cloudflare Workers Static Assets / Wrangler

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

O `wrangler.jsonc` é a fonte de verdade do deploy. Ele executa `npm run build` automaticamente e publica os arquivos gerados em `./dist`.

Para Cloudflare Workers Builds:

- Production branch: `main`
- Build command: pode ficar vazio
- Deploy command: `npx wrangler deploy`
- Root directory: raiz do repositório

Também é possível reproduzir localmente com:

```bash
npm run deploy
```

O código da aplicação precisa estar presente na branch de produção antes do deploy.

## Estrutura principal

- `src/components/map` — mapa, marcadores e controlador de foco da pessoa selecionada;
- `src/components/header` — cabeçalho flutuante;
- `src/components/people` — painel do mapa, tela Pessoas e detalhe individual;
- `src/components/navigation` — navegação inferior funcional;
- `src/data` — dados simulados;
- `src/types` — contratos compartilhados.

## Documentação de produto

- Spec inicial: `docs/superpowers/specs/2026-09-06-front-v0.1-design.md`
- Plano inicial: `docs/superpowers/plans/2026-09-06-front-v0.1.md`
- Evolução v0.2: mudança bounded aprovada em chat, focada apenas na aba `Pessoas`.
- Spec v0.3: `docs/superpowers/specs/2026-09-07-person-detail-v0.3-design.md`
- Plano v0.3: `docs/superpowers/plans/2026-09-07-person-detail-v0.3.md`
