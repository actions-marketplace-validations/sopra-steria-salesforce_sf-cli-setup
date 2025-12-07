import { getInputs } from '../shared/inputs.js'

const version = getInputs().SF_CLI_VERSION
const tool_cache_folder = '/opt/hostedtoolcache'
const tool_cache_name = 'sf-cli'

export const cachePaths = [`${tool_cache_folder}/${tool_cache_name}`]
export const primaryKey = `salesforce/cli@v${version}`

export enum Outputs {
  READY = 'ready',
  INSTALLED_FROM = 'installed-from',
  AUTHENTICATED = 'authenticated'
}
