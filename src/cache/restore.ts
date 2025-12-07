import * as cache from '@actions/cache'
import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import { cachePaths, primaryKey } from './constants.js'

export const getCachedSfCli = async (): Promise<string | void> => {
  core.info(`Checking for SF CLI with version ${primaryKey} in GitHub cache...`)

  const cacheKey = await cache.restoreCache(cachePaths, primaryKey)
  core.info(cacheKey ? `Cache restored (key: ${cacheKey})` : 'Cache not found, will download from npm.')

  return tc.find('sf-cli', primaryKey)
}
