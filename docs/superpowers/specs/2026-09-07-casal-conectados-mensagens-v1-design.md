# Casal Conectados — nova fase de mensagens rápidas (design)

Data: 2026-09-07
Status: aprovado em brainstorming; implementação ainda não iniciada.

## Contexto

O projeto deixa de ter localização/mapa como função principal. O foco passa a ser um app privado para o casal, voltado a conexão rápida no dia a dia: recados de um toque, mensagens curtas e um mini-chat simples.

A primeira versão desta nova fase será somente front-end. Não haverá backend, autenticação, sincronização entre dispositivos, notificações push reais ou banco remoto. Os dados serão simulados e persistidos localmente no navegador para permitir testar a experiência completa antes de investir na infraestrutura real.

## Objetivo da fase

Validar se o produto funciona bem como um app de comunicação afetiva rápida, simples e mobile-first, com três áreas principais:

- `Início`: atalhos de um toque e mensagem curta personalizada;
- `Chat`: histórico unificado dos recados e textos enviados;
- `Nós`: resumo visual do casal e contador de tempo juntos.

## Decisões de produto aprovadas

- remover o mapa da experiência principal;
- abandonar, nesta fase, o posicionamento inspirado em rastreamento tipo Life360;
- manter a base React/TypeScript/Vite, CI e deploy existentes;
- remover dependências e componentes específicos de mapa/localização;
- usar uma Home minimalista, sem excesso de decoração;
- usar grade 2xN para os atalhos rápidos;
- manter atalhos rápidos e mensagens escritas no mesmo histórico;
- persistir o histórico com `localStorage`;
- adiar backend, login, pareamento e push real;
- navegação principal: `Início`, `Chat`, `Nós`.

## Arquitetura proposta

A aplicação continua SPA em React, mas o estado de produto será reorganizado em três fluxos independentes.

### App shell

Responsabilidades:

- controlar a aba ativa;
- manter a navegação inferior fixa;
- orquestrar acesso ao histórico local;
- compartilhar operações de envio entre Home e Chat.

As telas não devem acessar `localStorage` diretamente. Uma camada isolada de storage será a única responsável por leitura, escrita e limpeza do histórico.

### Camada de storage

Responsabilidades:

- carregar mensagens do navegador;
- persistir novos itens;
- validar conteúdo recuperado antes de entregá-lo à UI;
- limpar histórico no modo protótipo;
- oferecer uma interface simples que possa futuramente ser substituída por API sem reescrever as telas.

Contrato lógico sugerido:

- `loadMessages()`
- `saveMessages(messages)`
- `appendMessage(message)`
- `clearMessages()`

## Modelo de dados

Cada item do histórico deve conter:

- `id`: identificador único local;
- `type`: `quick` ou `text`;
- `content`: texto exibido no histórico;
- `sender`: remetente simulado da fase front;
- `createdAt`: timestamp ISO;
- `status`: estado local de persistência.

Exemplo conceitual:

```ts
{
  id: '...'
  type: 'quick'
  content: 'Te amo ❤️'
  sender: 'joao'
  createdAt: '2026-09-07T20:30:00.000Z'
  status: 'saved-local'
}
```

Nesta fase não haverá mensagem recebida de outro dispositivo. O histórico existe apenas para validar UX e persistência local.

## Tela Início

### Layout

- mobile-first;
- cabeçalho simples;
- grade de duas colunas com seis atalhos grandes;
- campo curto de mensagem abaixo da grade;
- botão de envio;
- navegação inferior fixa.

### Atalhos iniciais

1. `Bom dia ❤️`
2. `Tô com saudade 🥰`
3. `Te amo ❤️`
4. `Cheguei 🏠`
5. `Flor do dia 🌷`
6. `Pensando em você 💭`

### Comportamento

Ao tocar em um atalho:

1. criar um item `quick`;
2. salvar imediatamente no storage local;
3. atualizar o estado em memória;
4. exibir feedback curto e explicitamente local, por exemplo `Recado adicionado ❤️`;
5. disponibilizar o item imediatamente no Chat.

Ao escrever uma mensagem:

1. impedir envio vazio ou contendo apenas espaços;
2. criar um item `text`;
3. persistir localmente;
4. limpar o campo após sucesso;
5. mostrar o mesmo tipo de feedback local.

## Tela Chat

### Objetivo

Exibir um histórico cronológico único de atalhos e mensagens escritas.

### Comportamento

- carregar o histórico do storage ao iniciar a aplicação;
- mostrar estado vazio quando não houver mensagens;
- exibir todos os itens em ordem cronológica, do mais antigo para o mais recente;
- diferenciar visualmente apenas o necessário entre toque rápido e texto;
- manter a experiência simples, sem recursos avançados de mensageria nesta fase;
- incluir opção de limpar histórico apenas por se tratar de protótipo local.

### Fora de escopo no Chat

- respostas reais do parceiro;
- entrega/leitura real;
- anexos;
- áudio;
- edição/exclusão individual;
- paginação;
- criptografia ponta a ponta;
- websocket/realtime.

## Tela Nós

### Conteúdo inicial

- `João + Amor`;
- data base do relacionamento: `16/09/2022`;
- contador calculado no front;
- visual discreto e limpo;
- sem fotos nesta fase.

### Contador

O contador deve ser derivado da data fixa e da data atual do dispositivo, sem depender de backend.

A apresentação pode priorizar legibilidade em vez de precisão excessiva. Exemplo de composição aceitável: anos, meses e dias corridos ou uma frase resumida equivalente, desde que o cálculo seja determinístico e testável.

## Navegação

A navegação inferior será fixa e terá exatamente três destinos:

- `Início`;
- `Chat`;
- `Nós`.

A aba ativa deve ter estado visual e `aria-current="page"`.

Não haverá rotas externas nem deep links nesta fase.

## Visual

Direção aprovada:

- minimalista;
- romântico discreto;
- sem visual infantil;
- fundo limpo;
- botões grandes e confortáveis para toque;
- boa leitura em Android e iPhone;
- suporte a safe areas;
- sem animações exageradas.

A identidade existente pode servir como referência de suavidade, mas a interface anterior centrada em mapa não deve limitar a nova composição.

## Remoções da implementação atual

A implementação desta fase deverá remover do produto:

- mapa Leaflet;
- OpenStreetMap;
- `react-leaflet`;
- `leaflet`;
- `@types/leaflet`;
- componentes de mapa;
- marcadores e foco em localização;
- tela Pessoas orientada a localização;
- detalhe individual orientado a GPS;
- tipos e mocks exclusivos de localização.

A remoção deve ser feita apenas quando a implementação começar e sempre acompanhada por testes e validação de dependências.

## Dependências mantidas

- React;
- React DOM;
- TypeScript;
- Vite;
- Lucide React;
- Vitest;
- Testing Library;
- Wrangler / Cloudflare Workers Static Assets.

## Fluxo de dados

### Envio rápido

`Home -> ação de envio -> serviço de histórico -> localStorage -> estado React -> feedback local -> Chat`

### Inicialização

`App -> serviço de histórico -> validação dos dados locais -> estado React -> telas`

### Limpeza

`Chat -> confirmação local -> serviço de histórico -> localStorage limpo -> estado React vazio`

## Tratamento de erros

Como é uma fase somente front, os principais riscos são armazenamento local e dados inválidos.

Regras:

- se `localStorage` estiver indisponível, a aplicação deve continuar funcionando em memória durante a sessão;
- se o conteúdo salvo estiver corrompido ou com formato inesperado, ignorar o conteúdo inválido e iniciar histórico vazio;
- nunca quebrar a renderização por falha de storage;
- envio de texto vazio deve ser bloqueado na interface;
- feedbacks devem ser locais e não podem sugerir entrega real ao parceiro.

## Acessibilidade

- botões com rótulos claros;
- navegação semântica;
- `aria-current` para aba ativa;
- feedback local exposto como status quando fizer sentido;
- foco visível;
- alvos de toque adequados para mobile;
- contraste legível.

## Testes obrigatórios

### Navegação

- inicia em `Início`;
- alterna corretamente entre `Início`, `Chat` e `Nós`;
- mantém estado visual da aba ativa.

### Home

- renderiza os seis atalhos;
- toque rápido cria item correto;
- mensagem escrita cria item correto;
- texto vazio não é enviado;
- feedback local aparece após a ação.

### Persistência

- mensagens são gravadas no `localStorage`;
- mensagens persistidas reaparecem após nova montagem da aplicação;
- dados inválidos de storage não quebram a aplicação;
- indisponibilidade de storage mantém o app funcional em memória durante a sessão;
- limpeza remove o histórico.

### Chat

- começa vazio sem dados prévios;
- mostra atalhos e textos no mesmo histórico;
- respeita ordem cronológica do mais antigo para o mais recente.

### Nós

- mostra `João + Amor`;
- usa a data `16/09/2022`;
- contador é calculado corretamente para datas controladas em teste.

### Gates de projeto

- `npm test -- --run`;
- `npm run typecheck`;
- `npm run build`;
- `npm audit --audit-level=high`.

## Fora de escopo desta fase

- backend;
- Cloudflare D1;
- login/cadastro;
- pareamento real;
- sincronização entre dispositivos;
- push real;
- service worker dedicado a notificações;
- chat realtime;
- localização;
- GPS/background tracking;
- fotos e memórias;
- reações;
- anexos;
- chamada ou WhatsApp;
- publicação em App Store/Play Store.

## Critérios de aceite

A fase será considerada pronta quando:

1. o mapa e os fluxos de localização não fizerem mais parte da interface;
2. a Home minimalista 2xN estiver funcional;
3. os seis atalhos criarem itens locais;
4. mensagens curtas puderem ser adicionadas ao histórico local;
5. o Chat exibir o histórico unificado;
6. o histórico persistir após fechar e reabrir o app no mesmo navegador, quando `localStorage` estiver disponível;
7. a tela Nós mostrar o casal e o contador desde 16/09/2022;
8. a navegação `Início · Chat · Nós` estiver funcional e acessível;
9. dependências de mapa forem removidas;
10. documentação for atualizada;
11. todos os testes, typecheck, build e audit passarem.

## Próxima etapa após aprovação da spec

Criar um plano detalhado de implementação com TDD, executar a migração da interface em uma branch dedicada, revisar o diff, atualizar a documentação e validar o CI antes de integrar em `main`.
