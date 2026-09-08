# Casal Conectados — Mensagens v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o front centrado em mapa/localização por um protótipo mobile-first de recados rápidos, mensagem curta, chat local persistido e tela `Nós`, sem backend.

**Architecture:** A SPA React continuará controlando a aba ativa e o histórico em memória. O histórico será persistido exclusivamente por uma camada isolada de `localStorage`, com fallback silencioso para memória quando o storage falhar; Home e Chat não acessam `localStorage` diretamente. O mapa e todos os componentes/dependências exclusivos de localização serão removidos ao final da migração.

**Tech Stack:** React 19, TypeScript 5.7, Vite 8, Lucide React, Vitest 5, Testing Library, Wrangler / Cloudflare Workers Static Assets.

**Spec:** `docs/superpowers/specs/2026-09-07-casal-conectados-mensagens-v1-design.md`

## Global Constraints

- Esta fase é somente front-end: sem backend, D1, login, pareamento, sincronização entre dispositivos, push real ou realtime.
- A navegação principal deve ter exatamente `Início`, `Chat` e `Nós`.
- A Home deve usar uma grade 2xN com exatamente seis atalhos iniciais: `Bom dia ❤️`, `Tô com saudade 🥰`, `Te amo ❤️`, `Cheguei 🏠`, `Flor do dia 🌷`, `Pensando em você 💭`.
- Atalhos e mensagens escritas devem compartilhar o mesmo histórico cronológico local.
- O histórico deve persistir em `localStorage`, mas falhas de storage não podem quebrar a UI; o estado em memória continua funcionando na sessão.
- Feedback de envio deve ser explicitamente local, por exemplo `Recado adicionado ❤️`; não deve sugerir entrega real ao parceiro.
- A tela `Nós` usa a data fixa `16/09/2022` e cálculo determinístico no front.
- O visual deve ser minimalista, romântico discreto, mobile-first, com safe areas e sem animações exageradas.
- Remover `leaflet`, `react-leaflet`, `@types/leaflet`, import de CSS do Leaflet e todos os componentes/tipos/mocks exclusivos de localização.
- Gates finais obrigatórios: `npm test -- --run`, `npm run typecheck`, `npm run build`, `npm audit --audit-level=high`.

---

## File Structure

### Criar
- `src/types/message.ts` — contrato do item salvo localmente.
- `src/storage/messageStorage.ts` — única camada com acesso a `localStorage`.
- `src/storage/messageStorage.test.ts` — validação, persistência, corrupção e falha de storage.
- `src/components/home/HomePage.tsx` — atalhos 2xN, campo curto e feedback local.
- `src/components/home/HomePage.test.tsx` — comportamento da Home.
- `src/components/chat/ChatPage.tsx` — histórico unificado e limpeza do protótipo.
- `src/components/chat/ChatPage.test.tsx` — vazio, ordenação, tipos e limpeza.
- `src/components/us/UsPage.tsx` — resumo do casal.
- `src/components/us/UsPage.test.tsx` — conteúdo e contador.
- `src/utils/relationshipDuration.ts` — cálculo determinístico de dias juntos.
- `src/utils/relationshipDuration.test.ts` — casos controlados do contador.

### Modificar
- `src/App.tsx` — novo shell, estado de mensagens e navegação `home/chat/us`.
- `src/App.test.tsx` — substituir testes de mapa pelos fluxos da nova fase.
- `src/components/navigation/BottomNav.tsx` — três abas e novos ícones.
- `src/styles.css` — novo layout global mobile-first sem regras Leaflet/mapa.
- `src/main.tsx` — remover import do CSS do Leaflet.
- `package.json` e lockfile — remover dependências de mapa.
- `README.md` — refletir estado implementado quando a migração estiver concluída.

### Remover
- `src/components/map/MapFocusController.test.tsx`
- `src/components/map/MapFocusController.tsx`
- `src/components/map/MapView.tsx`
- `src/components/map/PersonMarker.tsx`
- `src/components/people/PeoplePage.css`
- `src/components/people/PeoplePage.tsx`
- `src/components/people/PeopleSheet.tsx`
- `src/components/people/PersonDetailPage.css`
- `src/components/people/PersonDetailPage.test.tsx`
- `src/components/people/PersonDetailPage.tsx`
- `src/data/people.ts`
- `src/types/person.ts`
- `src/components/header/AppHeader.tsx`

---

### Task 1: Contrato e storage local resiliente

**Files:**
- Create: `src/types/message.ts`
- Create: `src/storage/messageStorage.ts`
- Create: `src/storage/messageStorage.test.ts`

**Interfaces:**
- Produces: `LocalMessage`, `MESSAGE_STORAGE_KEY`, `loadMessages()`, `saveMessages()`, `appendMessage()`, `clearMessages()`.
- `LocalMessage.status` é sempre `'saved-local'` nesta fase.

- [ ] **Step 1: Escrever testes RED do storage**

Criar `src/storage/messageStorage.test.ts` com:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  MESSAGE_STORAGE_KEY,
  appendMessage,
  clearMessages,
  loadMessages,
} from './messageStorage'
import type { LocalMessage } from '../types/message'

const message: LocalMessage = {
  id: 'm1',
  type: 'quick',
  content: 'Te amo ❤️',
  sender: 'joao',
  createdAt: '2026-09-07T20:30:00.000Z',
  status: 'saved-local',
}

describe('messageStorage', () => {
  beforeEach(() => localStorage.clear())

  it('carrega vazio sem histórico salvo', () => {
    expect(loadMessages()).toEqual([])
  })

  it('persiste e recupera mensagens válidas', () => {
    appendMessage([], message)
    expect(loadMessages()).toEqual([message])
  })

  it('ignora JSON corrompido', () => {
    localStorage.setItem(MESSAGE_STORAGE_KEY, '{quebrado')
    expect(loadMessages()).toEqual([])
  })

  it('ignora itens com contrato inválido', () => {
    localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify([{ id: 1 }]))
    expect(loadMessages()).toEqual([])
  })

  it('continua retornando o próximo estado quando setItem falha', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage indisponível')
    })
    expect(appendMessage([], message)).toEqual([message])
    spy.mockRestore()
  })

  it('limpa o histórico sem lançar erro', () => {
    appendMessage([], message)
    clearMessages()
    expect(loadMessages()).toEqual([])
  })
})
```

- [ ] **Step 2: Executar o teste e confirmar RED**

Run: `npm test -- --run src/storage/messageStorage.test.ts`

Expected: FAIL porque `messageStorage.ts` e `LocalMessage` ainda não existem.

- [ ] **Step 3: Implementar contrato mínimo**

Criar `src/types/message.ts`:

```ts
export type MessageType = 'quick' | 'text'
export type MessageSender = 'joao'
export type MessageStatus = 'saved-local'

export type LocalMessage = {
  id: string
  type: MessageType
  content: string
  sender: MessageSender
  createdAt: string
  status: MessageStatus
}
```

Criar `src/storage/messageStorage.ts` com a chave `casal-conectados:messages:v1`, validação de todos os campos e `try/catch` em `getItem`, `setItem` e `removeItem`.

Assinaturas:

```ts
export const MESSAGE_STORAGE_KEY = 'casal-conectados:messages:v1'
export function loadMessages(): LocalMessage[]
export function saveMessages(messages: LocalMessage[]): boolean
export function appendMessage(messages: LocalMessage[], message: LocalMessage): LocalMessage[]
export function clearMessages(): boolean
```

`appendMessage` deve executar:

```ts
const next = [...messages, message]
saveMessages(next)
return next
```

- [ ] **Step 4: Rodar teste do storage**

Run: `npm test -- --run src/storage/messageStorage.test.ts`

Expected: PASS.

- [ ] **Step 5: Rodar typecheck**

Run: `npm run typecheck`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/types/message.ts src/storage/messageStorage.ts src/storage/messageStorage.test.ts
git commit -m "feat: add local message storage"
```

---

### Task 2: Novo shell e navegação Início · Chat · Nós

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/components/navigation/BottomNav.tsx`
- Create: `src/components/home/HomePage.tsx`
- Create: `src/components/chat/ChatPage.tsx`
- Create: `src/components/us/UsPage.tsx`

**Interfaces:**
- Produces: `type AppTab = 'home' | 'chat' | 'us'`.
- `BottomNav` recebe `activeTab: AppTab` e `onTabChange: (tab: AppTab) => void`.
- As páginas iniciais expõem headings `Início`, `Chat` e `Nós`.

- [ ] **Step 1: Substituir testes de mapa por teste RED do novo shell**

`src/App.test.tsx` deve conter:

```tsx
it('inicia em Início e navega entre as três abas', () => {
  render(<App />)

  const home = screen.getByRole('button', { name: 'Início' })
  const chat = screen.getByRole('button', { name: 'Chat' })
  const us = screen.getByRole('button', { name: 'Nós' })

  expect(home).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('heading', { name: 'Início' })).toBeInTheDocument()

  fireEvent.click(chat)
  expect(chat).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('heading', { name: 'Chat' })).toBeInTheDocument()

  fireEvent.click(us)
  expect(us).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('heading', { name: 'Nós' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Executar e confirmar RED**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL porque ainda existem as abas `Mapa` e `Pessoas`.

- [ ] **Step 3: Implementar shell mínimo**

`App.tsx` deve ter:

```tsx
const [activeTab, setActiveTab] = useState<AppTab>('home')

return (
  <main className="app-shell">
    <div className="app-content">
      {activeTab === 'home' ? <HomePage /> : null}
      {activeTab === 'chat' ? <ChatPage /> : null}
      {activeTab === 'us' ? <UsPage /> : null}
    </div>
    <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
  </main>
)
```

Criar páginas mínimas com `<h1>Início</h1>`, `<h1>Chat</h1>` e `<h1>Nós</h1>`.

`BottomNav.tsx` deve usar `Home`, `MessageCircle` e `Heart` do Lucide React, três colunas e `aria-current="page"` apenas na aba ativa.

- [ ] **Step 4: Rodar testes e typecheck**

Run:

```bash
npm test -- --run src/App.test.tsx
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/components/navigation/BottomNav.tsx src/components/home/HomePage.tsx src/components/chat/ChatPage.tsx src/components/us/UsPage.tsx
git commit -m "feat: replace map navigation with couple tabs"
```

---

### Task 3: Home 2xN com recados rápidos e mensagem curta

**Files:**
- Modify: `src/components/home/HomePage.tsx`
- Create: `src/components/home/HomePage.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- `HomePage` consumes: `onAddMessage(type: MessageType, content: string): void`.
- `App` owns `messages: LocalMessage[]`, initialized uma vez com `loadMessages()`.
- IDs são gerados com `crypto.randomUUID()`; timestamps com `new Date().toISOString()`.

- [ ] **Step 1: Escrever testes RED da Home**

`src/components/home/HomePage.test.tsx` deve cobrir os seis atalhos, envio de texto, bloqueio de whitespace e feedback local:

```tsx
const onAddMessage = vi.fn()
render(<HomePage onAddMessage={onAddMessage} />)

for (const label of [
  'Bom dia ❤️',
  'Tô com saudade 🥰',
  'Te amo ❤️',
  'Cheguei 🏠',
  'Flor do dia 🌷',
  'Pensando em você 💭',
]) {
  expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
}

fireEvent.click(screen.getByRole('button', { name: 'Te amo ❤️' }))
expect(onAddMessage).toHaveBeenCalledWith('quick', 'Te amo ❤️')
expect(screen.getByRole('status')).toHaveTextContent('Recado adicionado ❤️')

fireEvent.change(screen.getByLabelText('Mensagem curta'), {
  target: { value: 'Boa noite, amor' },
})
fireEvent.click(screen.getByRole('button', { name: 'Adicionar mensagem' }))
expect(onAddMessage).toHaveBeenCalledWith('text', 'Boa noite, amor')
expect(screen.getByLabelText('Mensagem curta')).toHaveValue('')
```

Adicionar um segundo teste:

```tsx
fireEvent.change(screen.getByLabelText('Mensagem curta'), {
  target: { value: '   ' },
})
fireEvent.click(screen.getByRole('button', { name: 'Adicionar mensagem' }))
expect(onAddMessage).not.toHaveBeenCalled()
```

- [ ] **Step 2: Executar e confirmar RED**

Run: `npm test -- --run src/components/home/HomePage.test.tsx`

Expected: FAIL porque a Home ainda é mínima.

- [ ] **Step 3: Implementar Home**

Usar:

```ts
const QUICK_MESSAGES = [
  'Bom dia ❤️',
  'Tô com saudade 🥰',
  'Te amo ❤️',
  'Cheguei 🏠',
  'Flor do dia 🌷',
  'Pensando em você 💭',
] as const
```

O formulário usa `trim()` antes de chamar `onAddMessage`. Após envio válido, limpa o campo e mostra `Recado adicionado ❤️` em `role="status"`.

- [ ] **Step 4: Integrar histórico no App**

Inicialização:

```tsx
const [messages, setMessages] = useState<LocalMessage[]>(() => loadMessages())
```

Handler:

```tsx
function handleAddMessage(type: MessageType, content: string) {
  const message: LocalMessage = {
    id: crypto.randomUUID(),
    type,
    content,
    sender: 'joao',
    createdAt: new Date().toISOString(),
    status: 'saved-local',
  }

  setMessages((current) => appendMessage(current, message))
}
```

Passar `onAddMessage={handleAddMessage}` para `HomePage`.

- [ ] **Step 5: Adicionar teste de integração de persistência em App**

Em `src/App.test.tsx`:

```tsx
beforeEach(() => localStorage.clear())

it('persiste um recado rápido criado na Home', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Te amo ❤️' }))

  const stored = JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) ?? '[]')
  expect(stored).toEqual([
    expect.objectContaining({
      type: 'quick',
      content: 'Te amo ❤️',
      sender: 'joao',
      status: 'saved-local',
    }),
  ])
})
```

- [ ] **Step 6: Rodar testes da Home, App e storage**

Run:

```bash
npm test -- --run src/components/home/HomePage.test.tsx src/App.test.tsx src/storage/messageStorage.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/home/HomePage.tsx src/components/home/HomePage.test.tsx src/App.tsx src/App.test.tsx
git commit -m "feat: add quick notes home"
```

---

### Task 4: Chat local unificado e limpeza do protótipo

**Files:**
- Modify: `src/components/chat/ChatPage.tsx`
- Create: `src/components/chat/ChatPage.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- `ChatPage` consumes: `messages: LocalMessage[]`, `onClear(): void`.
- Ordem visual: `createdAt` ascendente; não mutar o array recebido.

- [ ] **Step 1: Escrever testes RED do Chat**

`src/components/chat/ChatPage.test.tsx` deve conter:

```tsx
it('mostra estado vazio', () => {
  render(<ChatPage messages={[]} onClear={vi.fn()} />)
  expect(screen.getByText('Nenhum recado ainda')).toBeInTheDocument()
})

it('mostra quick e text do mais antigo para o mais recente', () => {
  render(
    <ChatPage
      messages={[
        { id: '2', type: 'text', content: 'Depois', sender: 'joao', createdAt: '2026-09-07T12:00:00.000Z', status: 'saved-local' },
        { id: '1', type: 'quick', content: 'Antes ❤️', sender: 'joao', createdAt: '2026-09-07T11:00:00.000Z', status: 'saved-local' },
      ]}
      onClear={vi.fn()}
    />,
  )

  const items = screen.getAllByTestId('chat-message')
  expect(items[0]).toHaveTextContent('Antes ❤️')
  expect(items[1]).toHaveTextContent('Depois')
})

it('solicita limpeza do histórico', () => {
  const onClear = vi.fn()
  render(<ChatPage messages={[]} onClear={onClear} />)
  fireEvent.click(screen.getByRole('button', { name: 'Limpar histórico' }))
  expect(onClear).toHaveBeenCalledTimes(1)
})
```

- [ ] **Step 2: Executar e confirmar RED**

Run: `npm test -- --run src/components/chat/ChatPage.test.tsx`

Expected: FAIL porque o Chat ainda é mínimo.

- [ ] **Step 3: Implementar Chat**

Ordenação:

```ts
const orderedMessages = [...messages].sort((a, b) =>
  a.createdAt.localeCompare(b.createdAt),
)
```

Cada item deve expor `data-testid="chat-message"`, conteúdo e hora formatada com:

```ts
new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(message.createdAt))
```

Diferenciar `quick` e `text` somente por classe e rótulo discreto; não exibir status de entrega/leitura.

- [ ] **Step 4: Integrar limpeza no App**

```tsx
function handleClearMessages() {
  clearMessages()
  setMessages([])
}
```

Passar `messages={messages}` e `onClear={handleClearMessages}` para `ChatPage`.

- [ ] **Step 5: Adicionar teste de integração Home -> Chat -> reload local -> limpeza**

Em `src/App.test.tsx`:

```tsx
it('mantém o histórico local entre montagens e permite limpar', () => {
  const first = render(<App />)

  fireEvent.click(screen.getByRole('button', { name: 'Flor do dia 🌷' }))
  fireEvent.click(screen.getByRole('button', { name: 'Chat' }))
  expect(screen.getByText('Flor do dia 🌷')).toBeInTheDocument()

  first.unmount()

  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Chat' }))
  expect(screen.getByText('Flor do dia 🌷')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Limpar histórico' }))
  expect(screen.getByText('Nenhum recado ainda')).toBeInTheDocument()
  expect(localStorage.getItem(MESSAGE_STORAGE_KEY)).toBeNull()
})
```

- [ ] **Step 6: Rodar testes relevantes**

Run:

```bash
npm test -- --run src/components/chat/ChatPage.test.tsx src/App.test.tsx src/storage/messageStorage.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/chat/ChatPage.tsx src/components/chat/ChatPage.test.tsx src/App.tsx src/App.test.tsx
git commit -m "feat: add local couple chat history"
```

---

### Task 5: Tela Nós e contador determinístico

**Files:**
- Create: `src/utils/relationshipDuration.ts`
- Create: `src/utils/relationshipDuration.test.ts`
- Modify: `src/components/us/UsPage.tsx`
- Create: `src/components/us/UsPage.test.tsx`

**Interfaces:**
- Produces: `RELATIONSHIP_START = '2022-09-16'`.
- Produces: `getDaysTogether(now: Date): number`.
- `UsPage` aceita `now?: Date` para teste; padrão `new Date()`.

- [ ] **Step 1: Escrever testes RED do contador**

Criar `src/utils/relationshipDuration.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getDaysTogether } from './relationshipDuration'

describe('getDaysTogether', () => {
  it('retorna zero na data inicial', () => {
    expect(getDaysTogether(new Date(2022, 8, 16, 12))).toBe(0)
  })

  it('conta dias corridos por data de calendário', () => {
    expect(getDaysTogether(new Date(2022, 8, 17, 12))).toBe(1)
  })

  it('não retorna negativo para data anterior', () => {
    expect(getDaysTogether(new Date(2022, 8, 15, 12))).toBe(0)
  })
})
```

- [ ] **Step 2: Executar e confirmar RED**

Run: `npm test -- --run src/utils/relationshipDuration.test.ts`

Expected: FAIL porque o util ainda não existe.

- [ ] **Step 3: Implementar cálculo sem dependência externa**

Criar `src/utils/relationshipDuration.ts`:

```ts
export const RELATIONSHIP_START = '2022-09-16'
const DAY_MS = 86_400_000

export function getDaysTogether(now: Date): number {
  const startUtc = Date.UTC(2022, 8, 16)
  const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.max(0, Math.floor((nowUtc - startUtc) / DAY_MS))
}
```

- [ ] **Step 4: Escrever teste RED da tela Nós**

Criar `src/components/us/UsPage.test.tsx`:

```tsx
render(<UsPage now={new Date(2022, 8, 17, 12)} />)
expect(screen.getByRole('heading', { name: 'Nós' })).toBeInTheDocument()
expect(screen.getByText('João + Amor')).toBeInTheDocument()
expect(screen.getByText('Desde 16/09/2022')).toBeInTheDocument()
expect(screen.getByText('1 dia juntos')).toBeInTheDocument()
```

Adicionar dois casos explícitos:

```tsx
render(<UsPage now={new Date(2022, 8, 16, 12)} />)
expect(screen.getByText('0 dias juntos')).toBeInTheDocument()
```

```tsx
render(<UsPage now={new Date(2022, 8, 18, 12)} />)
expect(screen.getByText('2 dias juntos')).toBeInTheDocument()
```

- [ ] **Step 5: Implementar `UsPage`**

Mostrar somente `Nós`, `João + Amor`, `Desde 16/09/2022` e o contador formatado com `Intl.NumberFormat('pt-BR')`. Usar singular apenas quando o valor for `1`.

- [ ] **Step 6: Rodar testes e typecheck**

Run:

```bash
npm test -- --run src/utils/relationshipDuration.test.ts src/components/us/UsPage.test.tsx
npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/utils/relationshipDuration.ts src/utils/relationshipDuration.test.ts src/components/us/UsPage.tsx src/components/us/UsPage.test.tsx
git commit -m "feat: add couple summary screen"
```

---

### Task 6: Novo visual mobile-first e remoção completa do mapa

**Files:**
- Modify: `src/styles.css`
- Modify: `src/main.tsx`
- Modify: `package.json`
- Modify: lockfile
- Delete: todos os arquivos listados em **Remover**.

**Interfaces:**
- A aplicação não deve importar nenhum símbolo de Leaflet, React Leaflet, `people.ts` ou `person.ts`.
- `.bottom-nav` passa a ter três colunas.

- [ ] **Step 1: Adicionar verificação de ausência de mapa em App**

Adicionar a `src/App.test.tsx`:

```tsx
it('não exibe a experiência antiga de localização', () => {
  render(<App />)
  expect(screen.queryByText('Mapa')).not.toBeInTheDocument()
  expect(screen.queryByText('Pessoas')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Remover import de Leaflet de `src/main.tsx`**

Eliminar:

```ts
import 'leaflet/dist/leaflet.css'
```

- [ ] **Step 3: Remover dependências de mapa**

Executar:

```bash
npm uninstall leaflet react-leaflet @types/leaflet
```

Confirmar que `package.json` não contém os três pacotes e que o lockfile foi atualizado pelo npm.

- [ ] **Step 4: Excluir arquivos antigos**

Remover exatamente os arquivos listados em **Remover**. Após Task 2, `AppHeader` não possui consumidor e deve ser excluído junto com os fluxos de mapa/pessoas.

- [ ] **Step 5: Reescrever `src/styles.css` para a nova composição**

Manter os fundamentos globais e implementar estas regras-base:

```css
.app-shell {
  min-height: 100dvh;
  background: #f5f2f7;
}

.app-content {
  width: min(100%, 480px);
  min-height: 100dvh;
  margin: 0 auto;
  padding: calc(env(safe-area-inset-top) + 24px) 16px calc(env(safe-area-inset-bottom) + 96px);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.quick-action {
  min-height: 88px;
}

.bottom-nav {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
```

Complementar com `.message-composer`, `.chat-list`, `.chat-message`, `.us-card`, estados ativos e `:focus-visible`, mantendo contraste legível e alvos de toque confortáveis.

Eliminar todos os seletores `.map-*`, `.leaflet-*`, `.person-marker*`, `.people-sheet*` e `.person-*` exclusivos da experiência antiga.

- [ ] **Step 6: Rodar busca de resíduos e gates técnicos**

Run:

```bash
grep -R "leaflet\|react-leaflet\|MapView\|PersonMarker\|mockPeople\|PersonLocation" -n src package.json || true
npm test -- --run
npm run typecheck
npm run build
npm audit --audit-level=high
```

Expected: grep sem resíduos funcionais; todos os comandos npm PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: remove location experience"
```

---

### Task 7: Documentação, revisão do diff e validação final

**Files:**
- Modify: `README.md`
- Keep: `docs/superpowers/specs/2026-09-07-casal-conectados-mensagens-v1-design.md`
- Keep: `docs/superpowers/plans/2026-09-07-casal-conectados-mensagens-v1.md`

**Interfaces:**
- README deve descrever o produto implementado, não o mapa antigo.

- [ ] **Step 1: Atualizar README para o estado entregue**

Registrar explicitamente:

- Home 2xN com seis recados rápidos;
- mensagem curta personalizada;
- histórico Chat unificado;
- persistência local e fallback de sessão;
- tela Nós com data `16/09/2022` e contador;
- navegação `Início · Chat · Nós`;
- remoção de mapa/localização;
- limites: sem backend, sincronização, push e entrega real.

- [ ] **Step 2: Rodar suíte completa em estado limpo**

Run:

```bash
npm test -- --run
npm run typecheck
npm run build
npm audit --audit-level=high
```

Expected: todos PASS, sem warnings que indiquem import quebrado ou dependência ausente.

- [ ] **Step 3: Revisar diff contra a spec**

Run:

```bash
git diff main...HEAD -- src package.json package-lock.json README.md docs/superpowers
```

Checklist:

- nenhum backend/D1/login/push foi introduzido;
- nenhum mapa/localização permaneceu;
- os seis atalhos têm exatamente as copies aprovadas;
- feedback não afirma entrega real;
- storage inválido/falhando não quebra a UI;
- Chat ordena do mais antigo para o mais recente;
- `Nós` usa `16/09/2022`;
- safe areas permanecem suportadas;
- documentação corresponde ao código.

- [ ] **Step 4: Commit de documentação**

```bash
git add README.md docs/superpowers
git commit -m "docs: update mensagens v1 project context"
```

- [ ] **Step 5: Verificação final do branch**

Run novamente:

```bash
npm test -- --run
npm run typecheck
npm run build
npm audit --audit-level=high
```

Expected: PASS em todos os gates antes de abrir/atualizar PR e considerar integração em `main`.
