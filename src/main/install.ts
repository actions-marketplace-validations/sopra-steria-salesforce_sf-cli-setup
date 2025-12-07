import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'

import { getInputs } from '../shared/inputs.js'
import { getCachedSfCli } from '../cache/restore.js'
import { IActionInputs } from '../shared/types.js'
import { Outputs } from '../cache/constants.js'
import { execute, getTempDirectory } from './helper.js'

export class SalesforceCLI {
  input: IActionInputs

  constructor() {
    this.input = getInputs()
  }

  async install(): Promise<void> {
    try {
      await this.start()
    } catch (error) {
      if (error instanceof Error) {
        this.setOutput(false)
        core.setFailed(error.message)
      }
    }
  }

  private async start(): Promise<void> {
    if (await this.sfAlreadyInstalled()) {
      this.setOutput(true, 'already-installed')
      core.info('SF CLI already installed and added to path, skipping')
      return
    }

    const cliPath = await this.fetchSfCli()
    await this.addToPath(cliPath)
  }

  /* -------------------------------------------------------------------------- */
  /*                               Helper Methods                               */
  /* -------------------------------------------------------------------------- */

  private async sfAlreadyInstalled(): Promise<boolean> {
    try {
      await execute('sf --version')
      return true
    } catch {
      return false
    }
  }

  private async fetchSfCli(): Promise<string> {
    return this.input.USE_CACHE ? await this.restoreFromCache() : await this.installViaNpm()
  }

  private async restoreFromCache(): Promise<string> {
    let cliPath = await getCachedSfCli()

    if (cliPath) {
      this.setOutput(true, 'cache')
    } else {
      cliPath = await this.installViaNpm()
    }

    return cliPath
  }

  private async installViaNpm(): Promise<string> {
    core.info(`Installing sf cli (version ${this.input.SF_CLI_VERSION}) from npm...`)
    const tmpDir = await getTempDirectory()

    await execute(`npm --global --prefix ${tmpDir} install @salesforce/cli@${this.input.SF_CLI_VERSION}`)
    const cliPath = await tc.cacheDir(tmpDir, 'sf-cli', this.input.SF_CLI_VERSION)
    this.setOutput(true, 'npm')

    return cliPath
  }

  private async addToPath(cliPath: string): Promise<void> {
    core.info('Adding SF CLI to path...')
    core.addPath(`${cliPath}/bin`)
    core.info('✅ Success! sf commands now available in your workflow.')
  }

  private setOutput(ready: boolean, source?: string): void {
    core.setOutput(Outputs.READY, ready)
    if (source) core.setOutput(Outputs.INSTALLED_FROM, source)
  }
}
