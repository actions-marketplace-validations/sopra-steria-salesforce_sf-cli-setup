import * as core from '@actions/core'
import * as cache from '@actions/cache'
import { getInputs } from '../shared/inputs.js'
import { cachePaths, primaryKey } from './constants.js'

// Catch and log any unhandled exceptions.  These exceptions can leak out of the uploadChunk method in
// @actions/toolkit when a failed upload closes the file descriptor causing any in-process reads to
// throw an uncaught exception.  Instead of failing this action, just warn.
process.on('uncaughtException', (e) => {
  const warningPrefix = '[warning]'
  core.info(`${warningPrefix}${e.message}`)
})

// Added early exit to resolve issue with slow post action step:
export async function run(earlyExit?: boolean): Promise<void> {
  try {
    if (!getInputs().USE_CACHE) {
      return
    }

    await cachePackages()

    if (earlyExit) {
      process.exit(0)
    }
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

const cachePackages = async (): Promise<void> => {
  const cacheKey = await cache.restoreCache(cachePaths, primaryKey)

  if (!cacheKey) {
    await cache.saveCache(cachePaths, primaryKey)
    core.info(`Cache saved with the key: ${primaryKey}`)
  } else {
    core.info(`Cache already exists, won't save a new one. Key: ${cacheKey}`)
  }
}

run(true)
