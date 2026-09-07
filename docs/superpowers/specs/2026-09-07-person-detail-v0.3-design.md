# Front v0.3 — Detalhe da pessoa e ações rápidas

## Objetivo

Evoluir o front do Casal Conectados para permitir abrir o detalhe de uma pessoa a partir da aba `Pessoas`, mantendo toda a experiência local/mockada e sem introduzir backend, autenticação ou GPS real.

## Fluxo principal

1. Usuário abre a aba `Pessoas`.
2. Toca no card de `João` ou `Amor`.
3. O app abre uma tela completa de detalhe da pessoa selecionada.
4. A tela mostra identidade, status e ações rápidas.
5. O botão voltar retorna para a aba `Pessoas`.
6. A ação `Ver no mapa` retorna ao mapa e centraliza visualmente a pessoa selecionada.

## Tela de detalhe

A tela deve conter:

- botão voltar no topo;
- avatar/inicial grande;
- nome da pessoa;
- status `Atualizado agora`;
- indicação visual `Localização ativa`;
- bloco curto de localização simulada;
- faixa/grid de ações rápidas;
- identidade visual consistente com as telas atuais;
- layout mobile-first com safe areas de Android/iOS.

Durante a tela de detalhe, a navegação inferior principal fica oculta. A navegação do fluxo é feita pelo botão voltar ou pela ação `Ver no mapa`.

## Ações rápidas

### Ver no mapa

- funcional dentro do front;
- retorna à aba `Mapa`;
- centraliza o mapa na posição mockada da pessoa selecionada;
- não solicita GPS real.

### Rota

- ação visual/mockada nesta versão;
- não abre Google Maps, Apple Maps ou outro app externo;
- deve fornecer feedback visual curto de que a integração real será adicionada depois.

### Mensagem

- ação visual/mockada nesta versão;
- não abre mensageiro externo e não envia mensagem real;
- deve fornecer feedback visual curto.

### Ligar

- ação visual/mockada nesta versão;
- não inicia chamada telefônica real;
- deve fornecer feedback visual curto.

### Atualizar

- simula uma solicitação de atualização de localização;
- altera temporariamente o feedback/status visual para demonstrar a interação;
- não chama API nem serviço externo.

## Arquitetura de front

### Estado de navegação

O `App` continua sendo o controlador simples do fluxo nesta fase.

Estado mínimo esperado:

- aba ativa: `map | people`;
- pessoa selecionada: `PersonLocation | null`;
- pessoa a focar no mapa: id opcional.

Não será introduzido React Router nesta versão. O fluxo é pequeno e cabe no estado local existente.

### PeoplePage

- os cards passam a ser interativos;
- recebe callback `onSelectPerson`;
- ao selecionar, entrega o objeto/ID da pessoa ao `App`.

### PersonDetailPage

Novo componente responsável apenas pelo detalhe da pessoa.

Responsabilidades:

- renderizar dados da pessoa;
- renderizar ações rápidas;
- emitir callbacks para voltar, ver no mapa e ações mockadas;
- não conhecer Leaflet, backend ou navegação externa.

### MapView

Passa a aceitar um foco opcional de pessoa/posição.

Responsabilidade nova:

- quando houver pessoa selecionada para foco, mover o mapa para a posição mockada correspondente;
- preservar o comportamento atual quando não houver foco.

## Feedback das ações mockadas

As ações `Rota`, `Mensagem`, `Ligar` e `Atualizar` devem responder imediatamente na própria tela, sem abrir modais complexos.

Preferência: mensagem compacta/estado temporário dentro do detalhe, para manter o fluxo simples e testável.

## Testes

Cobertura mínima:

- tocar em uma pessoa abre o detalhe correto;
- detalhe mostra nome/status da pessoa selecionada;
- voltar retorna para `Pessoas`;
- `Ver no mapa` retorna ao mapa e informa a pessoa a focar;
- aba inferior não aparece enquanto o detalhe está aberto;
- ações mockadas produzem feedback sem navegação externa;
- fluxo atual `Mapa ↔ Pessoas` continua funcionando.

CI continua exigindo:

- testes;
- TypeScript;
- build;
- auditoria de dependências em nível alto.

## Fora do escopo da v0.3

- login/cadastro;
- backend ou D1;
- GPS real;
- rastreamento em segundo plano;
- bateria real;
- velocidade real;
- histórico de localização;
- geofencing;
- abrir apps externos para rota/mensagem/chamada;
- notificações;
- edição de perfil;
- dados reais do casal.

## Critérios de aceite

A v0.3 está concluída quando:

- João e Amor podem ser abertos a partir da aba `Pessoas`;
- cada detalhe mostra os dados mockados da pessoa correta;
- as cinco ações rápidas estão visíveis;
- `Ver no mapa` funciona dentro do front;
- as demais ações respondem visualmente sem integração externa;
- voltar para `Pessoas` funciona;
- navegação atual não sofre regressão;
- documentação do estado do projeto é atualizada;
- CI final passa na branch e após integração na `main`.
