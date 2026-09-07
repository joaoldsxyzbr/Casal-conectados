import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function readJson(path: string) {
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8'))
}

describe('configuração de deploy', () => {
  it('publica o build Vite em dist com Wrangler versionado', () => {
    const wrangler = readJson('wrangler.jsonc')
    const pkg = readJson('package.json')

    expect(wrangler).not.toBeNull()
    expect(wrangler?.assets?.directory).toBe('./dist')
    expect(pkg?.scripts?.deploy).toBe('npm run build && wrangler deploy')
    expect(pkg?.devDependencies?.wrangler).toBe('4.129.0')
  })
})
