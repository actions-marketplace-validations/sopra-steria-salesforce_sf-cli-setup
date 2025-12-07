import * as core from '@actions/core'
import { execute } from './helper.js'
import fs from 'fs'
import { getInputs } from '../shared/inputs.js'
import { IActionInputs } from '../shared/types.js'
import { Outputs } from '../cache/constants.js'

export class SalesforceAuth {
  inputs: IActionInputs

  constructor() {
    this.inputs = getInputs()
  }

  async auth(): Promise<void> {
    try {
      this.start()
      core.setOutput(Outputs.AUTHENTICATED, true)
    } catch (error) {
      if (error instanceof Error) {
        core.setFailed(error.message)
        core.setOutput(Outputs.AUTHENTICATED, false)
      }
    }
  }

  private start(): void {
    if (this.inputs.AUTH_URL) {
      this.authenticateAuthUrl()
    } else if (this.inputs.USERNAME && this.inputs.CLIENT_ID && this.inputs.PRIVATE_KEY) {
      this.authenticateJwt()
    } else if (this.inputs.ACCESS_TOKEN && this.inputs.INSTANCE_URL) {
      this.authenticateAccessToken()
    } else {
      core.info('No authentication method provided. Skipping authentication, but the SF CLI can still be used.')
    }
  }

  private async authenticateAuthUrl(): Promise<void> {
    fs.writeFileSync('/tmp/sfdx_auth.txt', this.inputs.AUTH_URL)
    await this.authenticate('sf org login sfdx-url', ['--sfdx-url-file /tmp/sfdx_auth.txt'])
    await execute('rm -rf /tmp/sfdx_auth.txt')
  }

  private async authenticateJwt(): Promise<void> {
    // need to write the key to a file, because when creating scratch orgs the private key is needed again.
    // stored in /tmp at root, which is not tracked by git. Repo is stored at /home/runner/work/my-repo-name/my-repo-name.
    fs.writeFileSync('/tmp/server.key', this.inputs.PRIVATE_KEY)

    await this.authenticate('sf org login jwt', [
      `--username ${this.inputs.USERNAME}`,
      `--client-id ${this.inputs.CLIENT_ID}`,
      '--jwt-key-file /tmp/server.key'
    ])
  }

  private async authenticateAccessToken(): Promise<void> {
    await this.authenticate(`echo ${this.inputs.ACCESS_TOKEN} | sf org login access-token`, ['--no-prompt'])
  }

  private async authenticate(type: string, parameters: string[]): Promise<void> {
    await execute(
      `${type} ${parameters.join(' ')} ${this.alias} ${this.defaultDevhub} ${this.defaultOrg} ${this.instanceUrl}`
    )
  }

  get alias(): string {
    return this.inputs.ALIAS ? `--alias ${this.inputs.ALIAS}` : ''
  }

  get defaultDevhub(): string {
    return this.inputs.SET_DEFAULT_DEV_HUB ? '--set-default-dev-hub' : ''
  }

  get defaultOrg(): string {
    return this.inputs.SET_DEFAULT_ORG ? '--set-default' : ''
  }

  get instanceUrl(): string {
    return this.inputs.INSTANCE_URL ? `--instance-url ${this.inputs.INSTANCE_URL}` : ''
  }
}
