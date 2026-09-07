# Front v0.3 — Detalhe da pessoa e ações rápidas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir abrir João ou Amor a partir da aba `Pessoas`, exibir uma tela completa de detalhe com cinco ações rápidas mockadas e retornar ao mapa com foco na pessoa selecionada.

**Architecture:** O `App` permanece como controlador simples do fluxo usando estado React local, sem React Router. `PeoplePage` apenas emite a pessoa selecionada, `PersonDetailPage` renderiza o detalhe e feedback das ações, e `MapView` aceita uma posição opcional que um controlador Leaflet usa para mover o mapa quando `Ver no mapa` for acionado.

**Tech Stack:** React 19, TypeScript, Vite, React Leaflet/Leaflet, Lucide React, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-07-person-detail-v0.3-design.md`

## Global Constraints

- Toda a experiência permanece local/mockada.
- Não adicionar login, backend, D1, GPS real, rastreamento em segundo plano ou integrações externas.
- `Rota`, `Mensagem` e `Ligar` devem produzir apenas feedback visual local.
- `Atualizar` deve simular uma solicitação de atualização sem API externa.
- `Ver no mapa` deve voltar para a aba `Mapa` e focar a posição mockada da pessoa selecionada.
- A navegação inferior fica oculta enquanto o detalhe estiver aberto.
- O layout continua mobile-first e respeita safe areas de Android/iOS.
- Não introduzir React Router nesta versão.
- CI final deve passar em testes, TypeScript, build e `npm audit --audit-level=high`.

---

## File Structure

- `src/types/person.ts` — contrato dos dados mockados da pessoa, incluindo rótulo de localização.
- `src/data/people.ts` — dados mockados de João e Amor.
- `src/App.tsx` — estado de aba, pessoa selecionada e foco do mapa; coordena as transições.
- `src/App.test.tsx` — testes de integração do fluxo Pessoas → detalhe → voltar / Ver no mapa.
- `src/components/people/PeoplePage.tsx` — lista interativa e callback de seleção.
- `src/components/people/PeoplePage.css` — aparência/foco dos cards clicáveis.
- `src/components/people/PersonDetailPage.tsx` — tela de detalhe, ações rápidas e feedback local.
- `src/components/people/PersonDetailPage.css` — layout mobile do detalhe.
- `src/components/people/PersonDetailPage.test.tsx` — comportamento das ações mockadas e dados da pessoa.
- `src/components/map/MapView.tsx` — recebe `focusPosition` opcional.
- `src/components/map/MapFocusController.tsx` — efeito Leaflet isolado que move o mapa para `focusPosition`.
- `src/components/map/MapFocusController.test.tsx` — verifica chamada de `setView` sem depender de tiles reais.
- `README.md` — estado atual v0.3, comportamento e limites.

---

### Task 1: Tornar cards de Pessoas selecionáveis e abrir o detalhe

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/people/PeoplePage.tsx`
- Modify: `src/components/people/PeoplePage.css`
- Create: `src/components/people/PersonDetailPage.tsx`
- Create: `src/components/people/PersonDetailPage.css`

**Interfaces:**
- `PeoplePageProps` passa a expor `onSelectPerson: (person: PersonLocation) => void`.
- `App` mantém `selectedPerson: PersonLocation | null`.
- `PersonDetailPageProps` inicialmente expõe `person: PersonLocation` e `onBack: () => void`.

- [ ] **Step 1: Escrever o teste RED do fluxo de abertura e retorno**

Em `src/App.test.tsx`, adicionar um teste que:

```tsx
it('abre o detalhe da pessoa selecionada e volta para Pessoas', () => {
  render(<App />)

  fireEvent.click(screen.getByRole('button', { name: 'Pessoas' }))
  fireEvent.click(screen.getByRole('button', { name: /Abrir João/i }))

  expect(screen.getByRole('heading', { name: 'João', level: 2 })).toBeInTheDocument()
  expect(screen.queryByRole('navigation', { name: 'Navegação principal' })).not.toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Voltar para Pessoas' }))

  expect(screen.getByRole('heading', { name: 'Pessoas', level: 2 })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Pessoas' })).toHaveAttribute('aria-current', 'page')
})
```

- [ ] **Step 2: Rodar o teste para verificar RED**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL porque o card de João ainda não é um botão e `PersonDetailPage` não existe.

- [ ] **Step 3: Implementar seleção mínima em `PeoplePage`**

Alterar a assinatura para:

```tsx
type PeoplePageProps = {
  people: PersonLocation[]
  onSelectPerson: (person: PersonLocation) => void
}
```

Cada item deve conter um botão acessível com:

```tsx
<button
  className="people-page__card"
  type="button"
  aria-label={`Abrir ${person.name}`}
  onClick={() => onSelectPerson(person)}
>
```

Preservar avatar, nome, status e `Localização ativa` dentro do botão.

- [ ] **Step 4: Criar o detalhe mínimo**

Criar `PersonDetailPage.tsx` com:

```tsx
type PersonDetailPageProps = {
  person: PersonLocation
  onBack: () => void
}

export function PersonDetailPage({ person, onBack }: PersonDetailPageProps) {
  return (
    <section className="person-detail" aria-labelledby="person-detail-title">
      <div className="person-detail__content">
        <button type="button" className="person-detail__back" aria-label="Voltar para Pessoas" onClick={onBack}>
          Voltar
        </button>
        <span className="person-detail__avatar" aria-hidden="true">{person.initials}</span>
        <h2 id="person-detail-title">{person.name}</h2>
        <p>{person.status}</p>
        <span>Localização ativa</span>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Coordenar o fluxo no `App`**

Adicionar:

```tsx
const [selectedPerson, setSelectedPerson] = useState<PersonLocation | null>(null)
```

Quando `activeTab === 'people' && selectedPerson`, renderizar `PersonDetailPage`; caso contrário renderizar `PeoplePage`. Passar `onSelectPerson={setSelectedPerson}` e `onBack={() => setSelectedPerson(null)}`. Renderizar `BottomNav` somente quando `selectedPerson === null`.

- [ ] **Step 6: Ajustar CSS dos cards e detalhe**

Em `PeoplePage.css`, garantir que `.people-page__card` continue visualmente igual como botão, adicionando `width: 100%`, `border` existente, `text-align: left`, `font: inherit`, `color: inherit` e `cursor: pointer`, além de estado `:focus-visible` coerente.

Em `PersonDetailPage.css`, criar tela full-height com:
- `position: absolute; inset: 0; overflow-y: auto`;
- padding usando `env(safe-area-inset-top)` e `env(safe-area-inset-bottom)`;
- conteúdo limitado a `440px`;
- avatar circular grande;
- botão voltar no topo;
- visual coerente com a paleta atual.

- [ ] **Step 7: Rodar testes e verificar GREEN**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS, incluindo o fluxo `Mapa ↔ Pessoas` já existente.

- [ ] **Step 8: Commit**

```bash
git add src/App.test.tsx src/App.tsx src/components/people/PeoplePage.tsx src/components/people/PeoplePage.css src/components/people/PersonDetailPage.tsx src/components/people/PersonDetailPage.css
git commit -m "feat: add person detail navigation"
```

---

### Task 2: Adicionar dados de localização e cinco ações rápidas

**Files:**
- Modify: `src/types/person.ts`
- Modify: `src/data/people.ts`
- Modify: `src/components/people/PersonDetailPage.tsx`
- Modify: `src/components/people/PersonDetailPage.css`
- Create: `src/components/people/PersonDetailPage.test.tsx`

**Interfaces:**
- `PersonLocation` ganha `locationLabel: string`.
- `PersonDetailPageProps` ganha `onViewOnMap: (person: PersonLocation) => void`.
- Ações locais identificadas por `QuickAction = 'route' | 'message' | 'call' | 'refresh'`.

- [ ] **Step 1: Escrever testes RED do conteúdo e ações**

Criar `PersonDetailPage.test.tsx` cobrindo:

```tsx
it('mostra localização e as cinco ações rápidas', () => {
  render(<PersonDetailPage person={person} onBack={vi.fn()} onViewOnMap={vi.fn()} />)

  expect(screen.getByText(person.locationLabel)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Ver no mapa' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Rota' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Mensagem' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Ligar' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Atualizar' })).toBeInTheDocument()
})
```

E um teste de feedback:

```tsx
it.each([
  ['Rota', 'Rota disponível quando a integração real for ativada.'],
  ['Mensagem', 'Mensagem disponível quando a integração real for ativada.'],
  ['Ligar', 'Ligação disponível quando a integração real for ativada.'],
])('mostra feedback local para %s', (action, feedback) => {
  render(<PersonDetailPage person={person} onBack={vi.fn()} onViewOnMap={vi.fn()} />)
  fireEvent.click(screen.getByRole('button', { name: action }))
  expect(screen.getByRole('status')).toHaveTextContent(feedback)
})
```

Adicionar teste específico para `Atualizar` esperando `Solicitando atualização...` imediatamente após o clique, sem chamadas externas.

- [ ] **Step 2: Rodar os testes para verificar RED**

Run: `npm test -- --run src/components/people/PersonDetailPage.test.tsx`

Expected: FAIL porque `locationLabel`, ações e feedback ainda não existem.

- [ ] **Step 3: Expandir o contrato e mocks**

Em `PersonLocation` adicionar:

```ts
locationLabel: string
```

Nos mocks usar rótulos explícitos e simulados:

```ts
locationLabel: 'Biguaçu, SC'
```

para João e Amor nesta fase; manter as coordenadas atuais sem alteração.

- [ ] **Step 4: Implementar ações rápidas**

Usar ícones Lucide apropriados (`MapPin`, `Route`, `MessageCircle`, `Phone`, `RefreshCw`). Criar cinco botões com labels exatamente:
- `Ver no mapa`
- `Rota`
- `Mensagem`
- `Ligar`
- `Atualizar`

`Ver no mapa` chama `onViewOnMap(person)`.

Para `Rota`, `Mensagem` e `Ligar`, armazenar um texto de feedback local em estado e renderizar um único elemento `role="status"`.

Para `Atualizar`, ao clicar definir feedback `Solicitando atualização...` e, usando `window.setTimeout`, mudar para `Localização atualizada agora.` após cerca de 900 ms. Limpar timeout no unmount para evitar atualização após desmontagem.

- [ ] **Step 5: Estilizar faixa/grid de ações**

Criar `.person-detail__actions` como grid responsivo de cinco itens, com botões grandes o suficiente para toque, ícone + label, sem copiar identidade visual do Life360. Criar bloco `.person-detail__location` e `.person-detail__feedback` para localização simulada e mensagens de estado.

- [ ] **Step 6: Rodar testes e verificar GREEN**

Run: `npm test -- --run src/components/people/PersonDetailPage.test.tsx src/App.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/types/person.ts src/data/people.ts src/components/people/PersonDetailPage.tsx src/components/people/PersonDetailPage.css src/components/people/PersonDetailPage.test.tsx
git commit -m "feat: add quick actions to person detail"
```

---

### Task 3: Fazer `Ver no mapa` focar a pessoa selecionada

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/map/MapView.tsx`
- Create: `src/components/map/MapFocusController.tsx`
- Create: `src/components/map/MapFocusController.test.tsx`

**Interfaces:**
- `MapViewProps = { focusPosition?: [number, number] | null }`.
- `MapFocusControllerProps = { position?: [number, number] | null; zoom?: number }`.
- `PersonDetailPage` já produz `onViewOnMap(person)` da Task 2.

- [ ] **Step 1: Escrever RED de integração no `App`**

Atualizar o mock de `MapView` em `App.test.tsx` para expor a posição recebida:

```tsx
vi.mock('./components/map/MapView', () => ({
  MapView: ({ focusPosition }: { focusPosition?: [number, number] | null }) => (
    <div data-testid="map-view" data-focus={focusPosition?.join(',') ?? ''} aria-label="Mapa do casal" />
  ),
}))
```

Adicionar teste:

```tsx
it('volta ao mapa focando a pessoa pelo detalhe', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Pessoas' }))
  fireEvent.click(screen.getByRole('button', { name: /Abrir Amor/i }))
  fireEvent.click(screen.getByRole('button', { name: 'Ver no mapa' }))

  expect(screen.getByTestId('map-view')).toHaveAttribute('data-focus', mockPeople[1].position.join(','))
  expect(screen.getByRole('button', { name: 'Mapa' })).toHaveAttribute('aria-current', 'page')
})
```

- [ ] **Step 2: Rodar e verificar RED**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL porque `App` ainda não passa foco ao `MapView`.

- [ ] **Step 3: Coordenar foco no `App`**

Adicionar:

```tsx
const [mapFocusPosition, setMapFocusPosition] = useState<[number, number] | null>(null)
```

Criar handler:

```tsx
function handleViewOnMap(person: PersonLocation) {
  setMapFocusPosition(person.position)
  setSelectedPerson(null)
  setActiveTab('map')
}
```

Passar `focusPosition={mapFocusPosition}` ao `MapView` e `onViewOnMap={handleViewOnMap}` ao detalhe.

- [ ] **Step 4: Escrever RED unitário do controlador Leaflet**

Em `MapFocusController.test.tsx`, mockar `react-leaflet`:

```tsx
const setView = vi.fn()

vi.mock('react-leaflet', () => ({
  useMap: () => ({ setView }),
}))
```

Renderizar `<MapFocusController position={[-27.4898, -48.6518]} zoom={16} />` e esperar:

```tsx
expect(setView).toHaveBeenCalledWith([-27.4898, -48.6518], 16, { animate: true })
```

- [ ] **Step 5: Rodar e verificar RED**

Run: `npm test -- --run src/components/map/MapFocusController.test.tsx`

Expected: FAIL porque o controlador ainda não existe.

- [ ] **Step 6: Implementar `MapFocusController`**

Criar componente sem UI:

```tsx
export function MapFocusController({ position, zoom = 16 }: MapFocusControllerProps) {
  const map = useMap()

  useEffect(() => {
    if (!position) return
    map.setView(position, zoom, { animate: true })
  }, [map, position, zoom])

  return null
}
```

- [ ] **Step 7: Conectar ao `MapView`**

Alterar para:

```tsx
type MapViewProps = {
  focusPosition?: [number, number] | null
}

export function MapView({ focusPosition }: MapViewProps) {
```

Dentro de `MapContainer`, renderizar `<MapFocusController position={focusPosition} />` antes dos marcadores.

- [ ] **Step 8: Rodar testes e verificar GREEN**

Run: `npm test -- --run src/App.test.tsx src/components/map/MapFocusController.test.tsx`

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/App.test.tsx src/App.tsx src/components/map/MapView.tsx src/components/map/MapFocusController.tsx src/components/map/MapFocusController.test.tsx
git commit -m "feat: focus selected person on map"
```

---

### Task 4: Documentar e validar a v0.3

**Files:**
- Modify: `README.md`

**Interfaces:**
- Nenhuma interface nova; esta tarefa consolida estado/documentação e valida o conjunto.

- [ ] **Step 1: Atualizar README**

Alterar o estado atual para `Front v0.3` e registrar:
- detalhe individual de João/Amor;
- cinco ações rápidas;
- `Ver no mapa` funcional com foco mockado;
- demais ações com feedback local;
- tudo ainda sem backend/GPS real/integrações externas.

Adicionar referência à spec e a este plano em `Documentação de produto`.

- [ ] **Step 2: Rodar suíte completa**

Run: `npm test -- --run`

Expected: todas as suítes PASS, sem falhas.

- [ ] **Step 3: Rodar TypeScript**

Run: `npm run typecheck`

Expected: exit code 0, sem erros TypeScript.

- [ ] **Step 4: Rodar build**

Run: `npm run build`

Expected: exit code 0 e `dist/` gerado pelo Vite.

- [ ] **Step 5: Rodar auditoria de dependências**

Run: `npm audit --audit-level=high`

Expected: exit code 0, sem vulnerabilidades high/critical que bloqueiem a entrega.

- [ ] **Step 6: Revisar requisitos da spec**

Confirmar no diff:
- João e Amor abrem detalhes corretos;
- cinco ações visíveis;
- `Ver no mapa` muda para mapa e foca posição;
- voltar retorna para Pessoas;
- bottom nav oculta no detalhe;
- ações mockadas não usam `window.location`, `tel:`, mensageiros ou APIs externas;
- documentação atualizada;
- nenhum backend/login/GPS real adicionado.

- [ ] **Step 7: Commit**

```bash
git add README.md
git commit -m "docs: update front v0.3 status"
```

- [ ] **Step 8: Abrir/atualizar PR e executar revisão final**

Criar PR `Front v0.3 — detalhe da pessoa e ações rápidas`, revisar o diff completo contra `main` e confirmar CI GREEN antes do merge.

- [ ] **Step 9: Integrar e validar `main` pós-merge**

Após revisão e CI da branch, integrar na `main` e verificar novamente o workflow no SHA de merge. A tarefa só é concluída quando testes, TypeScript, build e audit estiverem verdes na `main`.