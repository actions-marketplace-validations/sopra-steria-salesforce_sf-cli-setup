import * as core from '@actions/core'
import { IActionInputs } from './types.js'

export const getInputs = (): IActionInputs => {
  const SF_CLI_VERSION: string = core.getInput('sf-cli-version', {
    required: true
  })
  const USE_CACHE: string = core.getInput('use-cache', { required: false })
  const AUTH_URL: string = core.getInput('auth-url', { required: false })
  const USERNAME = core.getInput('username', { required: false })
  const CLIENT_ID: string = core.getInput('client-id', { required: false })
  const PRIVATE_KEY: string = core.getInput('private-key', { required: false })
  const INSTANCE_URL: string = core.getInput('instance-url', {
    required: false
  })
  const ACCESS_TOKEN: string = core.getInput('access-token', {
    required: false
  })
  const ALIAS: string = core.getInput('alias:', { required: false })
  const SET_DEFAULT_DEV_HUB: string = core.getInput('set-default-dev-hub', {
    required: false
  })
  const SET_DEFAULT_ORG: string = core.getInput('set-default-org', {
    required: false
  })

  return {
    SF_CLI_VERSION,
    USE_CACHE: USE_CACHE === 'true',
    AUTH_URL,
    USERNAME,
    CLIENT_ID,
    PRIVATE_KEY,
    INSTANCE_URL,
    ACCESS_TOKEN,
    ALIAS,
    SET_DEFAULT_DEV_HUB: SET_DEFAULT_DEV_HUB === 'true',
    SET_DEFAULT_ORG: SET_DEFAULT_ORG === 'true'
  }
}
