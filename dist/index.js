import { r as requireSemver, a as requireCore, b as requireIo, c as requireLib, d as requireExec, e as commonjsGlobal, f as coreExports, p as primaryKey, g as cacheExports, h as cachePaths, i as getInputs, O as Outputs } from './constants-BocRXqpR.js';
import require$$0$1 from 'crypto';
import fs__default from 'fs';
import require$$0 from 'os';
import require$$2 from 'child_process';
import * as require$$1 from 'path';
import require$$1__default from 'path';
import require$$0$2 from 'stream';
import require$$0__default from 'util';
import require$$0$3 from 'assert';
import 'url';
import 'node:crypto';
import 'node:os';
import 'node:util';
import 'node:process';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
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
import 'timers';

var toolCache = {};

var manifest$1 = {exports: {}};

var manifest = manifest$1.exports;

var hasRequiredManifest;

function requireManifest () {
	if (hasRequiredManifest) return manifest$1.exports;
	hasRequiredManifest = 1;
	(function (module, exports) {
		var __createBinding = (manifest && manifest.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __setModuleDefault = (manifest && manifest.__setModuleDefault) || (Object.create ? (function(o, v) {
		    Object.defineProperty(o, "default", { enumerable: true, value: v });
		}) : function(o, v) {
		    o["default"] = v;
		});
		var __importStar = (manifest && manifest.__importStar) || function (mod) {
		    if (mod && mod.__esModule) return mod;
		    var result = {};
		    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		    __setModuleDefault(result, mod);
		    return result;
		};
		var __awaiter = (manifest && manifest.__awaiter) || function (thisArg, _arguments, P, generator) {
		    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		    return new (P || (P = Promise))(function (resolve, reject) {
		        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
		        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
		        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
		        step((generator = generator.apply(thisArg, _arguments || [])).next());
		    });
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports._readLinuxVersionFile = exports._getOsVersion = exports._findMatch = void 0;
		const semver = __importStar(requireSemver());
		const core_1 = requireCore();
		// needs to be require for core node modules to be mocked
		/* eslint @typescript-eslint/no-require-imports: 0 */
		const os = require$$0;
		const cp = require$$2;
		const fs = fs__default;
		function _findMatch(versionSpec, stable, candidates, archFilter) {
		    return __awaiter(this, void 0, void 0, function* () {
		        const platFilter = os.platform();
		        let result;
		        let match;
		        let file;
		        for (const candidate of candidates) {
		            const version = candidate.version;
		            (0, core_1.debug)(`check ${version} satisfies ${versionSpec}`);
		            if (semver.satisfies(version, versionSpec) &&
		                (!stable || candidate.stable === stable)) {
		                file = candidate.files.find(item => {
		                    (0, core_1.debug)(`${item.arch}===${archFilter} && ${item.platform}===${platFilter}`);
		                    let chk = item.arch === archFilter && item.platform === platFilter;
		                    if (chk && item.platform_version) {
		                        const osVersion = module.exports._getOsVersion();
		                        if (osVersion === item.platform_version) {
		                            chk = true;
		                        }
		                        else {
		                            chk = semver.satisfies(osVersion, item.platform_version);
		                        }
		                    }
		                    return chk;
		                });
		                if (file) {
		                    (0, core_1.debug)(`matched ${candidate.version}`);
		                    match = candidate;
		                    break;
		                }
		            }
		        }
		        if (match && file) {
		            // clone since we're mutating the file list to be only the file that matches
		            result = Object.assign({}, match);
		            result.files = [file];
		        }
		        return result;
		    });
		}
		exports._findMatch = _findMatch;
		function _getOsVersion() {
		    // TODO: add windows and other linux, arm variants
		    // right now filtering on version is only an ubuntu and macos scenario for tools we build for hosted (python)
		    const plat = os.platform();
		    let version = '';
		    if (plat === 'darwin') {
		        version = cp.execSync('sw_vers -productVersion').toString();
		    }
		    else if (plat === 'linux') {
		        // lsb_release process not in some containers, readfile
		        // Run cat /etc/lsb-release
		        // DISTRIB_ID=Ubuntu
		        // DISTRIB_RELEASE=18.04
		        // DISTRIB_CODENAME=bionic
		        // DISTRIB_DESCRIPTION="Ubuntu 18.04.4 LTS"
		        const lsbContents = module.exports._readLinuxVersionFile();
		        if (lsbContents) {
		            const lines = lsbContents.split('\n');
		            for (const line of lines) {
		                const parts = line.split('=');
		                if (parts.length === 2 &&
		                    (parts[0].trim() === 'VERSION_ID' ||
		                        parts[0].trim() === 'DISTRIB_RELEASE')) {
		                    version = parts[1].trim().replace(/^"/, '').replace(/"$/, '');
		                    break;
		                }
		            }
		        }
		    }
		    return version;
		}
		exports._getOsVersion = _getOsVersion;
		function _readLinuxVersionFile() {
		    const lsbReleaseFile = '/etc/lsb-release';
		    const osReleaseFile = '/etc/os-release';
		    let contents = '';
		    if (fs.existsSync(lsbReleaseFile)) {
		        contents = fs.readFileSync(lsbReleaseFile).toString();
		    }
		    else if (fs.existsSync(osReleaseFile)) {
		        contents = fs.readFileSync(osReleaseFile).toString();
		    }
		    return contents;
		}
		exports._readLinuxVersionFile = _readLinuxVersionFile;
		
	} (manifest$1, manifest$1.exports));
	return manifest$1.exports;
}

var retryHelper = {};

var hasRequiredRetryHelper;

function requireRetryHelper () {
	if (hasRequiredRetryHelper) return retryHelper;
	hasRequiredRetryHelper = 1;
	var __createBinding = (retryHelper && retryHelper.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (retryHelper && retryHelper.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (retryHelper && retryHelper.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	var __awaiter = (retryHelper && retryHelper.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(retryHelper, "__esModule", { value: true });
	retryHelper.RetryHelper = void 0;
	const core = __importStar(requireCore());
	/**
	 * Internal class for retries
	 */
	class RetryHelper {
	    constructor(maxAttempts, minSeconds, maxSeconds) {
	        if (maxAttempts < 1) {
	            throw new Error('max attempts should be greater than or equal to 1');
	        }
	        this.maxAttempts = maxAttempts;
	        this.minSeconds = Math.floor(minSeconds);
	        this.maxSeconds = Math.floor(maxSeconds);
	        if (this.minSeconds > this.maxSeconds) {
	            throw new Error('min seconds should be less than or equal to max seconds');
	        }
	    }
	    execute(action, isRetryable) {
	        return __awaiter(this, void 0, void 0, function* () {
	            let attempt = 1;
	            while (attempt < this.maxAttempts) {
	                // Try
	                try {
	                    return yield action();
	                }
	                catch (err) {
	                    if (isRetryable && !isRetryable(err)) {
	                        throw err;
	                    }
	                    core.info(err.message);
	                }
	                // Sleep
	                const seconds = this.getSleepAmount();
	                core.info(`Waiting ${seconds} seconds before trying again`);
	                yield this.sleep(seconds);
	                attempt++;
	            }
	            // Last attempt
	            return yield action();
	        });
	    }
	    getSleepAmount() {
	        return (Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) +
	            this.minSeconds);
	    }
	    sleep(seconds) {
	        return __awaiter(this, void 0, void 0, function* () {
	            return new Promise(resolve => setTimeout(resolve, seconds * 1000));
	        });
	    }
	}
	retryHelper.RetryHelper = RetryHelper;
	
	return retryHelper;
}

var hasRequiredToolCache;

function requireToolCache () {
	if (hasRequiredToolCache) return toolCache;
	hasRequiredToolCache = 1;
	var __createBinding = (toolCache && toolCache.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (toolCache && toolCache.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (toolCache && toolCache.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	var __awaiter = (toolCache && toolCache.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(toolCache, "__esModule", { value: true });
	toolCache.evaluateVersions = toolCache.isExplicitVersion = toolCache.findFromManifest = toolCache.getManifestFromRepo = toolCache.findAllVersions = toolCache.find = toolCache.cacheFile = toolCache.cacheDir = toolCache.extractZip = toolCache.extractXar = toolCache.extractTar = toolCache.extract7z = toolCache.downloadTool = toolCache.HTTPError = void 0;
	const core = __importStar(requireCore());
	const io = __importStar(requireIo());
	const crypto = __importStar(require$$0$1);
	const fs = __importStar(fs__default);
	const mm = __importStar(requireManifest());
	const os = __importStar(require$$0);
	const path = __importStar(require$$1__default);
	const httpm = __importStar(requireLib());
	const semver = __importStar(requireSemver());
	const stream = __importStar(require$$0$2);
	const util = __importStar(require$$0__default);
	const assert_1 = require$$0$3;
	const exec_1 = requireExec();
	const retry_helper_1 = requireRetryHelper();
	class HTTPError extends Error {
	    constructor(httpStatusCode) {
	        super(`Unexpected HTTP response: ${httpStatusCode}`);
	        this.httpStatusCode = httpStatusCode;
	        Object.setPrototypeOf(this, new.target.prototype);
	    }
	}
	toolCache.HTTPError = HTTPError;
	const IS_WINDOWS = process.platform === 'win32';
	const IS_MAC = process.platform === 'darwin';
	const userAgent = 'actions/tool-cache';
	/**
	 * Download a tool from an url and stream it into a file
	 *
	 * @param url       url of tool to download
	 * @param dest      path to download tool
	 * @param auth      authorization header
	 * @param headers   other headers
	 * @returns         path to downloaded tool
	 */
	function downloadTool(url, dest, auth, headers) {
	    return __awaiter(this, void 0, void 0, function* () {
	        dest = dest || path.join(_getTempDirectory(), crypto.randomUUID());
	        yield io.mkdirP(path.dirname(dest));
	        core.debug(`Downloading ${url}`);
	        core.debug(`Destination ${dest}`);
	        const maxAttempts = 3;
	        const minSeconds = _getGlobal('TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS', 10);
	        const maxSeconds = _getGlobal('TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS', 20);
	        const retryHelper = new retry_helper_1.RetryHelper(maxAttempts, minSeconds, maxSeconds);
	        return yield retryHelper.execute(() => __awaiter(this, void 0, void 0, function* () {
	            return yield downloadToolAttempt(url, dest || '', auth, headers);
	        }), (err) => {
	            if (err instanceof HTTPError && err.httpStatusCode) {
	                // Don't retry anything less than 500, except 408 Request Timeout and 429 Too Many Requests
	                if (err.httpStatusCode < 500 &&
	                    err.httpStatusCode !== 408 &&
	                    err.httpStatusCode !== 429) {
	                    return false;
	                }
	            }
	            // Otherwise retry
	            return true;
	        });
	    });
	}
	toolCache.downloadTool = downloadTool;
	function downloadToolAttempt(url, dest, auth, headers) {
	    return __awaiter(this, void 0, void 0, function* () {
	        if (fs.existsSync(dest)) {
	            throw new Error(`Destination file path ${dest} already exists`);
	        }
	        // Get the response headers
	        const http = new httpm.HttpClient(userAgent, [], {
	            allowRetries: false
	        });
	        if (auth) {
	            core.debug('set auth');
	            if (headers === undefined) {
	                headers = {};
	            }
	            headers.authorization = auth;
	        }
	        const response = yield http.get(url, headers);
	        if (response.message.statusCode !== 200) {
	            const err = new HTTPError(response.message.statusCode);
	            core.debug(`Failed to download from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
	            throw err;
	        }
	        // Download the response body
	        const pipeline = util.promisify(stream.pipeline);
	        const responseMessageFactory = _getGlobal('TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY', () => response.message);
	        const readStream = responseMessageFactory();
	        let succeeded = false;
	        try {
	            yield pipeline(readStream, fs.createWriteStream(dest));
	            core.debug('download complete');
	            succeeded = true;
	            return dest;
	        }
	        finally {
	            // Error, delete dest before retry
	            if (!succeeded) {
	                core.debug('download failed');
	                try {
	                    yield io.rmRF(dest);
	                }
	                catch (err) {
	                    core.debug(`Failed to delete '${dest}'. ${err.message}`);
	                }
	            }
	        }
	    });
	}
	/**
	 * Extract a .7z file
	 *
	 * @param file     path to the .7z file
	 * @param dest     destination directory. Optional.
	 * @param _7zPath  path to 7zr.exe. Optional, for long path support. Most .7z archives do not have this
	 * problem. If your .7z archive contains very long paths, you can pass the path to 7zr.exe which will
	 * gracefully handle long paths. By default 7zdec.exe is used because it is a very small program and is
	 * bundled with the tool lib. However it does not support long paths. 7zr.exe is the reduced command line
	 * interface, it is smaller than the full command line interface, and it does support long paths. At the
	 * time of this writing, it is freely available from the LZMA SDK that is available on the 7zip website.
	 * Be sure to check the current license agreement. If 7zr.exe is bundled with your action, then the path
	 * to 7zr.exe can be pass to this function.
	 * @returns        path to the destination directory
	 */
	function extract7z(file, dest, _7zPath) {
	    return __awaiter(this, void 0, void 0, function* () {
	        (0, assert_1.ok)(IS_WINDOWS, 'extract7z() not supported on current OS');
	        (0, assert_1.ok)(file, 'parameter "file" is required');
	        dest = yield _createExtractFolder(dest);
	        const originalCwd = process.cwd();
	        process.chdir(dest);
	        if (_7zPath) {
	            try {
	                const logLevel = core.isDebug() ? '-bb1' : '-bb0';
	                const args = [
	                    'x',
	                    logLevel,
	                    '-bd',
	                    '-sccUTF-8',
	                    file
	                ];
	                const options = {
	                    silent: true
	                };
	                yield (0, exec_1.exec)(`"${_7zPath}"`, args, options);
	            }
	            finally {
	                process.chdir(originalCwd);
	            }
	        }
	        else {
	            const escapedScript = path
	                .join(__dirname, '..', 'scripts', 'Invoke-7zdec.ps1')
	                .replace(/'/g, "''")
	                .replace(/"|\n|\r/g, ''); // double-up single quotes, remove double quotes and newlines
	            const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, '');
	            const escapedTarget = dest.replace(/'/g, "''").replace(/"|\n|\r/g, '');
	            const command = `& '${escapedScript}' -Source '${escapedFile}' -Target '${escapedTarget}'`;
	            const args = [
	                '-NoLogo',
	                '-Sta',
	                '-NoProfile',
	                '-NonInteractive',
	                '-ExecutionPolicy',
	                'Unrestricted',
	                '-Command',
	                command
	            ];
	            const options = {
	                silent: true
	            };
	            try {
	                const powershellPath = yield io.which('powershell', true);
	                yield (0, exec_1.exec)(`"${powershellPath}"`, args, options);
	            }
	            finally {
	                process.chdir(originalCwd);
	            }
	        }
	        return dest;
	    });
	}
	toolCache.extract7z = extract7z;
	/**
	 * Extract a compressed tar archive
	 *
	 * @param file     path to the tar
	 * @param dest     destination directory. Optional.
	 * @param flags    flags for the tar command to use for extraction. Defaults to 'xz' (extracting gzipped tars). Optional.
	 * @returns        path to the destination directory
	 */
	function extractTar(file, dest, flags = 'xz') {
	    return __awaiter(this, void 0, void 0, function* () {
	        if (!file) {
	            throw new Error("parameter 'file' is required");
	        }
	        // Create dest
	        dest = yield _createExtractFolder(dest);
	        // Determine whether GNU tar
	        core.debug('Checking tar --version');
	        let versionOutput = '';
	        yield (0, exec_1.exec)('tar --version', [], {
	            ignoreReturnCode: true,
	            silent: true,
	            listeners: {
	                stdout: (data) => (versionOutput += data.toString()),
	                stderr: (data) => (versionOutput += data.toString())
	            }
	        });
	        core.debug(versionOutput.trim());
	        const isGnuTar = versionOutput.toUpperCase().includes('GNU TAR');
	        // Initialize args
	        let args;
	        if (flags instanceof Array) {
	            args = flags;
	        }
	        else {
	            args = [flags];
	        }
	        if (core.isDebug() && !flags.includes('v')) {
	            args.push('-v');
	        }
	        let destArg = dest;
	        let fileArg = file;
	        if (IS_WINDOWS && isGnuTar) {
	            args.push('--force-local');
	            destArg = dest.replace(/\\/g, '/');
	            // Technically only the dest needs to have `/` but for aesthetic consistency
	            // convert slashes in the file arg too.
	            fileArg = file.replace(/\\/g, '/');
	        }
	        if (isGnuTar) {
	            // Suppress warnings when using GNU tar to extract archives created by BSD tar
	            args.push('--warning=no-unknown-keyword');
	            args.push('--overwrite');
	        }
	        args.push('-C', destArg, '-f', fileArg);
	        yield (0, exec_1.exec)(`tar`, args);
	        return dest;
	    });
	}
	toolCache.extractTar = extractTar;
	/**
	 * Extract a xar compatible archive
	 *
	 * @param file     path to the archive
	 * @param dest     destination directory. Optional.
	 * @param flags    flags for the xar. Optional.
	 * @returns        path to the destination directory
	 */
	function extractXar(file, dest, flags = []) {
	    return __awaiter(this, void 0, void 0, function* () {
	        (0, assert_1.ok)(IS_MAC, 'extractXar() not supported on current OS');
	        (0, assert_1.ok)(file, 'parameter "file" is required');
	        dest = yield _createExtractFolder(dest);
	        let args;
	        if (flags instanceof Array) {
	            args = flags;
	        }
	        else {
	            args = [flags];
	        }
	        args.push('-x', '-C', dest, '-f', file);
	        if (core.isDebug()) {
	            args.push('-v');
	        }
	        const xarPath = yield io.which('xar', true);
	        yield (0, exec_1.exec)(`"${xarPath}"`, _unique(args));
	        return dest;
	    });
	}
	toolCache.extractXar = extractXar;
	/**
	 * Extract a zip
	 *
	 * @param file     path to the zip
	 * @param dest     destination directory. Optional.
	 * @returns        path to the destination directory
	 */
	function extractZip(file, dest) {
	    return __awaiter(this, void 0, void 0, function* () {
	        if (!file) {
	            throw new Error("parameter 'file' is required");
	        }
	        dest = yield _createExtractFolder(dest);
	        if (IS_WINDOWS) {
	            yield extractZipWin(file, dest);
	        }
	        else {
	            yield extractZipNix(file, dest);
	        }
	        return dest;
	    });
	}
	toolCache.extractZip = extractZip;
	function extractZipWin(file, dest) {
	    return __awaiter(this, void 0, void 0, function* () {
	        // build the powershell command
	        const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, ''); // double-up single quotes, remove double quotes and newlines
	        const escapedDest = dest.replace(/'/g, "''").replace(/"|\n|\r/g, '');
	        const pwshPath = yield io.which('pwsh', false);
	        //To match the file overwrite behavior on nix systems, we use the overwrite = true flag for ExtractToDirectory
	        //and the -Force flag for Expand-Archive as a fallback
	        if (pwshPath) {
	            //attempt to use pwsh with ExtractToDirectory, if this fails attempt Expand-Archive
	            const pwshCommand = [
	                `$ErrorActionPreference = 'Stop' ;`,
	                `try { Add-Type -AssemblyName System.IO.Compression.ZipFile } catch { } ;`,
	                `try { [System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`,
	                `catch { if (($_.Exception.GetType().FullName -eq 'System.Management.Automation.MethodException') -or ($_.Exception.GetType().FullName -eq 'System.Management.Automation.RuntimeException') ){ Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force } else { throw $_ } } ;`
	            ].join(' ');
	            const args = [
	                '-NoLogo',
	                '-NoProfile',
	                '-NonInteractive',
	                '-ExecutionPolicy',
	                'Unrestricted',
	                '-Command',
	                pwshCommand
	            ];
	            core.debug(`Using pwsh at path: ${pwshPath}`);
	            yield (0, exec_1.exec)(`"${pwshPath}"`, args);
	        }
	        else {
	            const powershellCommand = [
	                `$ErrorActionPreference = 'Stop' ;`,
	                `try { Add-Type -AssemblyName System.IO.Compression.FileSystem } catch { } ;`,
	                `if ((Get-Command -Name Expand-Archive -Module Microsoft.PowerShell.Archive -ErrorAction Ignore)) { Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force }`,
	                `else {[System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`
	            ].join(' ');
	            const args = [
	                '-NoLogo',
	                '-Sta',
	                '-NoProfile',
	                '-NonInteractive',
	                '-ExecutionPolicy',
	                'Unrestricted',
	                '-Command',
	                powershellCommand
	            ];
	            const powershellPath = yield io.which('powershell', true);
	            core.debug(`Using powershell at path: ${powershellPath}`);
	            yield (0, exec_1.exec)(`"${powershellPath}"`, args);
	        }
	    });
	}
	function extractZipNix(file, dest) {
	    return __awaiter(this, void 0, void 0, function* () {
	        const unzipPath = yield io.which('unzip', true);
	        const args = [file];
	        if (!core.isDebug()) {
	            args.unshift('-q');
	        }
	        args.unshift('-o'); //overwrite with -o, otherwise a prompt is shown which freezes the run
	        yield (0, exec_1.exec)(`"${unzipPath}"`, args, { cwd: dest });
	    });
	}
	/**
	 * Caches a directory and installs it into the tool cacheDir
	 *
	 * @param sourceDir    the directory to cache into tools
	 * @param tool          tool name
	 * @param version       version of the tool.  semver format
	 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
	 */
	function cacheDir(sourceDir, tool, version, arch) {
	    return __awaiter(this, void 0, void 0, function* () {
	        version = semver.clean(version) || version;
	        arch = arch || os.arch();
	        core.debug(`Caching tool ${tool} ${version} ${arch}`);
	        core.debug(`source dir: ${sourceDir}`);
	        if (!fs.statSync(sourceDir).isDirectory()) {
	            throw new Error('sourceDir is not a directory');
	        }
	        // Create the tool dir
	        const destPath = yield _createToolPath(tool, version, arch);
	        // copy each child item. do not move. move can fail on Windows
	        // due to anti-virus software having an open handle on a file.
	        for (const itemName of fs.readdirSync(sourceDir)) {
	            const s = path.join(sourceDir, itemName);
	            yield io.cp(s, destPath, { recursive: true });
	        }
	        // write .complete
	        _completeToolPath(tool, version, arch);
	        return destPath;
	    });
	}
	toolCache.cacheDir = cacheDir;
	/**
	 * Caches a downloaded file (GUID) and installs it
	 * into the tool cache with a given targetName
	 *
	 * @param sourceFile    the file to cache into tools.  Typically a result of downloadTool which is a guid.
	 * @param targetFile    the name of the file name in the tools directory
	 * @param tool          tool name
	 * @param version       version of the tool.  semver format
	 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
	 */
	function cacheFile(sourceFile, targetFile, tool, version, arch) {
	    return __awaiter(this, void 0, void 0, function* () {
	        version = semver.clean(version) || version;
	        arch = arch || os.arch();
	        core.debug(`Caching tool ${tool} ${version} ${arch}`);
	        core.debug(`source file: ${sourceFile}`);
	        if (!fs.statSync(sourceFile).isFile()) {
	            throw new Error('sourceFile is not a file');
	        }
	        // create the tool dir
	        const destFolder = yield _createToolPath(tool, version, arch);
	        // copy instead of move. move can fail on Windows due to
	        // anti-virus software having an open handle on a file.
	        const destPath = path.join(destFolder, targetFile);
	        core.debug(`destination file ${destPath}`);
	        yield io.cp(sourceFile, destPath);
	        // write .complete
	        _completeToolPath(tool, version, arch);
	        return destFolder;
	    });
	}
	toolCache.cacheFile = cacheFile;
	/**
	 * Finds the path to a tool version in the local installed tool cache
	 *
	 * @param toolName      name of the tool
	 * @param versionSpec   version of the tool
	 * @param arch          optional arch.  defaults to arch of computer
	 */
	function find(toolName, versionSpec, arch) {
	    if (!toolName) {
	        throw new Error('toolName parameter is required');
	    }
	    if (!versionSpec) {
	        throw new Error('versionSpec parameter is required');
	    }
	    arch = arch || os.arch();
	    // attempt to resolve an explicit version
	    if (!isExplicitVersion(versionSpec)) {
	        const localVersions = findAllVersions(toolName, arch);
	        const match = evaluateVersions(localVersions, versionSpec);
	        versionSpec = match;
	    }
	    // check for the explicit version in the cache
	    let toolPath = '';
	    if (versionSpec) {
	        versionSpec = semver.clean(versionSpec) || '';
	        const cachePath = path.join(_getCacheDirectory(), toolName, versionSpec, arch);
	        core.debug(`checking cache: ${cachePath}`);
	        if (fs.existsSync(cachePath) && fs.existsSync(`${cachePath}.complete`)) {
	            core.debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
	            toolPath = cachePath;
	        }
	        else {
	            core.debug('not found');
	        }
	    }
	    return toolPath;
	}
	toolCache.find = find;
	/**
	 * Finds the paths to all versions of a tool that are installed in the local tool cache
	 *
	 * @param toolName  name of the tool
	 * @param arch      optional arch.  defaults to arch of computer
	 */
	function findAllVersions(toolName, arch) {
	    const versions = [];
	    arch = arch || os.arch();
	    const toolPath = path.join(_getCacheDirectory(), toolName);
	    if (fs.existsSync(toolPath)) {
	        const children = fs.readdirSync(toolPath);
	        for (const child of children) {
	            if (isExplicitVersion(child)) {
	                const fullPath = path.join(toolPath, child, arch || '');
	                if (fs.existsSync(fullPath) && fs.existsSync(`${fullPath}.complete`)) {
	                    versions.push(child);
	                }
	            }
	        }
	    }
	    return versions;
	}
	toolCache.findAllVersions = findAllVersions;
	function getManifestFromRepo(owner, repo, auth, branch = 'master') {
	    return __awaiter(this, void 0, void 0, function* () {
	        let releases = [];
	        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}`;
	        const http = new httpm.HttpClient('tool-cache');
	        const headers = {};
	        if (auth) {
	            core.debug('set auth');
	            headers.authorization = auth;
	        }
	        const response = yield http.getJson(treeUrl, headers);
	        if (!response.result) {
	            return releases;
	        }
	        let manifestUrl = '';
	        for (const item of response.result.tree) {
	            if (item.path === 'versions-manifest.json') {
	                manifestUrl = item.url;
	                break;
	            }
	        }
	        headers['accept'] = 'application/vnd.github.VERSION.raw';
	        let versionsRaw = yield (yield http.get(manifestUrl, headers)).readBody();
	        if (versionsRaw) {
	            // shouldn't be needed but protects against invalid json saved with BOM
	            versionsRaw = versionsRaw.replace(/^\uFEFF/, '');
	            try {
	                releases = JSON.parse(versionsRaw);
	            }
	            catch (_a) {
	                core.debug('Invalid json');
	            }
	        }
	        return releases;
	    });
	}
	toolCache.getManifestFromRepo = getManifestFromRepo;
	function findFromManifest(versionSpec, stable, manifest, archFilter = os.arch()) {
	    return __awaiter(this, void 0, void 0, function* () {
	        // wrap the internal impl
	        const match = yield mm._findMatch(versionSpec, stable, manifest, archFilter);
	        return match;
	    });
	}
	toolCache.findFromManifest = findFromManifest;
	function _createExtractFolder(dest) {
	    return __awaiter(this, void 0, void 0, function* () {
	        if (!dest) {
	            // create a temp dir
	            dest = path.join(_getTempDirectory(), crypto.randomUUID());
	        }
	        yield io.mkdirP(dest);
	        return dest;
	    });
	}
	function _createToolPath(tool, version, arch) {
	    return __awaiter(this, void 0, void 0, function* () {
	        const folderPath = path.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || '');
	        core.debug(`destination ${folderPath}`);
	        const markerPath = `${folderPath}.complete`;
	        yield io.rmRF(folderPath);
	        yield io.rmRF(markerPath);
	        yield io.mkdirP(folderPath);
	        return folderPath;
	    });
	}
	function _completeToolPath(tool, version, arch) {
	    const folderPath = path.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || '');
	    const markerPath = `${folderPath}.complete`;
	    fs.writeFileSync(markerPath, '');
	    core.debug('finished caching tool');
	}
	/**
	 * Check if version string is explicit
	 *
	 * @param versionSpec      version string to check
	 */
	function isExplicitVersion(versionSpec) {
	    const c = semver.clean(versionSpec) || '';
	    core.debug(`isExplicit: ${c}`);
	    const valid = semver.valid(c) != null;
	    core.debug(`explicit? ${valid}`);
	    return valid;
	}
	toolCache.isExplicitVersion = isExplicitVersion;
	/**
	 * Get the highest satisfiying semantic version in `versions` which satisfies `versionSpec`
	 *
	 * @param versions        array of versions to evaluate
	 * @param versionSpec     semantic version spec to satisfy
	 */
	function evaluateVersions(versions, versionSpec) {
	    let version = '';
	    core.debug(`evaluating ${versions.length} versions`);
	    versions = versions.sort((a, b) => {
	        if (semver.gt(a, b)) {
	            return 1;
	        }
	        return -1;
	    });
	    for (let i = versions.length - 1; i >= 0; i--) {
	        const potential = versions[i];
	        const satisfied = semver.satisfies(potential, versionSpec);
	        if (satisfied) {
	            version = potential;
	            break;
	        }
	    }
	    if (version) {
	        core.debug(`matched: ${version}`);
	    }
	    else {
	        core.debug('match not found');
	    }
	    return version;
	}
	toolCache.evaluateVersions = evaluateVersions;
	/**
	 * Gets RUNNER_TOOL_CACHE
	 */
	function _getCacheDirectory() {
	    const cacheDirectory = process.env['RUNNER_TOOL_CACHE'] || '';
	    (0, assert_1.ok)(cacheDirectory, 'Expected RUNNER_TOOL_CACHE to be defined');
	    return cacheDirectory;
	}
	/**
	 * Gets RUNNER_TEMP
	 */
	function _getTempDirectory() {
	    const tempDirectory = process.env['RUNNER_TEMP'] || '';
	    (0, assert_1.ok)(tempDirectory, 'Expected RUNNER_TEMP to be defined');
	    return tempDirectory;
	}
	/**
	 * Gets a global variable
	 */
	function _getGlobal(key, defaultValue) {
	    /* eslint-disable @typescript-eslint/no-explicit-any */
	    const value = commonjsGlobal[key];
	    /* eslint-enable @typescript-eslint/no-explicit-any */
	    return value !== undefined ? value : defaultValue;
	}
	/**
	 * Returns an array of unique values.
	 * @param values Values to make unique.
	 */
	function _unique(values) {
	    return Array.from(new Set(values));
	}
	
	return toolCache;
}

var toolCacheExports = requireToolCache();

const getCachedSfCli = async () => {
    coreExports.info(`Checking for SF CLI with version ${primaryKey} in GitHub cache...`);
    const cacheKey = await cacheExports.restoreCache(cachePaths, primaryKey);
    coreExports.info(cacheKey ? `Cache restored (key: ${cacheKey})` : 'Cache not found, will download from npm.');
    return toolCacheExports.find('sf-cli', primaryKey);
};

var ioExports = requireIo();

var execExports = requireExec();

async function execute(cmd, params = []) {
    let message = '';
    const exitCode = await execExports.exec(cmd, params);
    if (exitCode === 0) {
        coreExports.info(message);
    }
    else {
        coreExports.setFailed(message);
    }
}
function resolveTempDirectory() {
    if (process.env['RUNNER_TEMP'])
        return process.env['RUNNER_TEMP'];
    if (process.platform === 'win32')
        return require$$1.join(process.env['USERPROFILE'] || 'C:\\', 'actions', 'temp');
    const baseLocation = process.platform === 'darwin' ? '/Users' : '/home';
    return require$$1.join(baseLocation, 'actions', 'temp');
}
async function getTempDirectory() {
    const tmp = require$$1.join(resolveTempDirectory(), 'sf');
    await ioExports.mkdirP(tmp);
    return tmp;
}

class SalesforceCLI {
    input;
    constructor() {
        this.input = getInputs();
    }
    async install() {
        try {
            await this.start();
        }
        catch (error) {
            if (error instanceof Error) {
                this.setOutput(false);
                coreExports.setFailed(error.message);
            }
        }
    }
    async start() {
        if (await this.sfAlreadyInstalled()) {
            this.setOutput(true, 'already-installed');
            coreExports.info('SF CLI already installed and added to path, skipping');
            return;
        }
        const cliPath = await this.fetchSfCli();
        await this.addToPath(cliPath);
    }
    /* -------------------------------------------------------------------------- */
    /*                               Helper Methods                               */
    /* -------------------------------------------------------------------------- */
    async sfAlreadyInstalled() {
        try {
            await execute('sf --version');
            return true;
        }
        catch {
            return false;
        }
    }
    async fetchSfCli() {
        return this.input.USE_CACHE ? await this.restoreFromCache() : await this.installViaNpm();
    }
    async restoreFromCache() {
        let cliPath = await getCachedSfCli();
        if (cliPath) {
            this.setOutput(true, 'cache');
        }
        else {
            cliPath = await this.installViaNpm();
        }
        return cliPath;
    }
    async installViaNpm() {
        coreExports.info(`Installing sf cli (version ${this.input.SF_CLI_VERSION}) from npm...`);
        const tmpDir = await getTempDirectory();
        await execute(`npm --global --prefix ${tmpDir} install @salesforce/cli@${this.input.SF_CLI_VERSION}`);
        const cliPath = await toolCacheExports.cacheDir(tmpDir, 'sf-cli', this.input.SF_CLI_VERSION);
        this.setOutput(true, 'npm');
        return cliPath;
    }
    async addToPath(cliPath) {
        coreExports.info('Adding SF CLI to path...');
        coreExports.addPath(`${cliPath}/bin`);
        coreExports.info('✅ Success! sf commands now available in your workflow.');
    }
    setOutput(ready, source) {
        coreExports.setOutput(Outputs.READY, ready);
        if (source)
            coreExports.setOutput(Outputs.INSTALLED_FROM, source);
    }
}

class SalesforceAuth {
    inputs;
    constructor() {
        this.inputs = getInputs();
    }
    async auth() {
        try {
            this.start();
            coreExports.setOutput(Outputs.AUTHENTICATED, true);
        }
        catch (error) {
            if (error instanceof Error) {
                coreExports.setFailed(error.message);
                coreExports.setOutput(Outputs.AUTHENTICATED, false);
            }
        }
    }
    start() {
        if (this.inputs.AUTH_URL) {
            this.authenticateAuthUrl();
        }
        else if (this.inputs.USERNAME && this.inputs.CLIENT_ID && this.inputs.PRIVATE_KEY) {
            this.authenticateJwt();
        }
        else if (this.inputs.ACCESS_TOKEN && this.inputs.INSTANCE_URL) {
            this.authenticateAccessToken();
        }
        else {
            coreExports.info('No authentication method provided. Skipping authentication, but the SF CLI can still be used.');
        }
    }
    async authenticateAuthUrl() {
        fs__default.writeFileSync('/tmp/sfdx_auth.txt', this.inputs.AUTH_URL);
        await this.authenticate('sf org login sfdx-url', ['--sfdx-url-file /tmp/sfdx_auth.txt']);
        await execute('rm -rf /tmp/sfdx_auth.txt');
    }
    async authenticateJwt() {
        // need to write the key to a file, because when creating scratch orgs the private key is needed again.
        // stored in /tmp at root, which is not tracked by git. Repo is stored at /home/runner/work/my-repo-name/my-repo-name.
        fs__default.writeFileSync('/tmp/server.key', this.inputs.PRIVATE_KEY);
        await this.authenticate('sf org login jwt', [
            `--username ${this.inputs.USERNAME}`,
            `--client-id ${this.inputs.CLIENT_ID}`,
            '--jwt-key-file /tmp/server.key'
        ]);
    }
    async authenticateAccessToken() {
        await this.authenticate(`echo ${this.inputs.ACCESS_TOKEN} | sf org login access-token`, ['--no-prompt']);
    }
    async authenticate(type, parameters) {
        await execute(`${type} ${parameters.join(' ')} ${this.alias} ${this.defaultDevhub} ${this.defaultOrg} ${this.instanceUrl}`);
    }
    get alias() {
        return this.inputs.ALIAS ? `--alias ${this.inputs.ALIAS}` : '';
    }
    get defaultDevhub() {
        return this.inputs.SET_DEFAULT_DEV_HUB ? '--set-default-dev-hub' : '';
    }
    get defaultOrg() {
        return this.inputs.SET_DEFAULT_ORG ? '--set-default' : '';
    }
    get instanceUrl() {
        return this.inputs.INSTANCE_URL ? `--instance-url ${this.inputs.INSTANCE_URL}` : '';
    }
}

async function run() {
    const cli = new SalesforceCLI();
    await cli.install();
    const sf = new SalesforceAuth();
    await sf.auth();
}

/**
 * The entrypoint for the action. This file simply imports and runs the action's
 * main logic.
 */
/* istanbul ignore next */
run();
//# sourceMappingURL=index.js.map
