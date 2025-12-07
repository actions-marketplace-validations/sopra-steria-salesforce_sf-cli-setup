import { f as coreExports, i as getInputs, g as cacheExports, h as cachePaths, p as primaryKey } from './constants-BocRXqpR.js';
import 'path';
import 'fs';
import 'assert';
import 'os';
import 'crypto';
import 'util';
import 'url';
import 'node:crypto';
import 'node:os';
import 'node:util';
import 'node:process';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'stream';
import 'net';
import 'tls';
import 'tty';
import 'http';
import 'https';
import 'buffer';
import 'querystring';
import 'stream/web';
import 'node:events';
import 'worker_threads';
import 'perf_hooks';
import 'util/types';
import 'async_hooks';
import 'console';
import 'zlib';
import 'diagnostics_channel';
import 'child_process';
import 'timers';

// Catch and log any unhandled exceptions.  These exceptions can leak out of the uploadChunk method in
// @actions/toolkit when a failed upload closes the file descriptor causing any in-process reads to
// throw an uncaught exception.  Instead of failing this action, just warn.
process.on('uncaughtException', (e) => {
    const warningPrefix = '[warning]';
    coreExports.info(`${warningPrefix}${e.message}`);
});
// Added early exit to resolve issue with slow post action step:
async function run(earlyExit) {
    try {
        if (!getInputs().USE_CACHE) {
            return;
        }
        await cachePackages();
        if (earlyExit) {
            process.exit(0);
        }
    }
    catch (error) {
        coreExports.setFailed(error.message);
    }
}
const cachePackages = async () => {
    const cacheKey = await cacheExports.restoreCache(cachePaths, primaryKey);
    if (!cacheKey) {
        await cacheExports.saveCache(cachePaths, primaryKey);
        coreExports.info(`Cache saved with the key: ${primaryKey}`);
    }
    else {
        coreExports.info(`Cache already exists, won't save a new one. Key: ${cacheKey}`);
    }
};
run(true);

export { run };
//# sourceMappingURL=save.js.map
