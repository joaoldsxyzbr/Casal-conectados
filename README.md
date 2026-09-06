# Casal Conectados

Aplicativo de casal em desenvolvimento, começando por uma experiência mobile de localização inspirada no conceito geral do Life360, sem copiar sua identidade visual.

## Estado atual

**Front v0.1**

A versão atual é exclusivamente visual e usa dados simulados. O objetivo desta etapa é validar a experiência principal antes de adicionar autenticação, backend ou localização real.

### Implementado

- mapa ocupando a tela principal;
- tiles do OpenStreetMap via Leaflet;
- dois perfis simulados: João e Amor;
- marcadores simulados no mapa;
- status `Atualizado agora` para os dois perfis;
- painel inferior flutuante;
- navegação inferior com `Mapa` e `Pessoas`;
- layout mobile-first com suporte a safe areas de Android/iOS;
- fallback visual se os tiles do mapa falharem;
- CI com testes, TypeScript, build e auditoria de dependências.

### Deliberadamente fora da v0.1

- login e cadastro;
- pareamento real;
- backend e banco de dados;
- GPS real;
- rastreamento em segundo plano;
- histórico de localização;
- geofencing;
- notificações;
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

## Estrutura principal

- `src/components/map` — mapa e marcadores;
- `src/components/header` — cabeçalho flutuante;
- `src/components/people` — painel dos dois perfis;
- `src/components/navigation` — navegação inferior;
- `src/data` — dados simulados;
- `src/types` — contratos compartilhados.

## Documentação de produto

- Spec: `docs/superpowers/specs/2026-09-06-front-v0.1-design.md`
- Plano: `docs/superpowers/plans/2026-09-06-front-v0.1.md`
