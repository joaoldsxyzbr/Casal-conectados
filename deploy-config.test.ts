import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function readJson(path: string) {
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8'))
}

describe('configuração de deploy', () => {
  it('faz o Wrangler gerar e publicar o build Vite automaticamente', () => {
    const wrangler = readJson('wrangler.jsonc')
    const pkg = readJson('package.json')

    expect(wrangler).not.toBeNull()
    expect(wrangler?.build?.command).toBe('npm run build')
    expect(wrangler?.assets?.directory).toBe('./dist')
    expect(pkg?.scripts?.deploy).toBe('wrangler deploy')
    expect(pkg?.devDependencies?.wrangler).toBe('4.129.0')
  })
})
