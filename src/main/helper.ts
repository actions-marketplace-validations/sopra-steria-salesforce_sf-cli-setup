import * as path from 'path'
import * as io from '@actions/io'
import * as exec from '@actions/exec'
import * as core from '@actions/core'

export async function execute(cmd: string, params: string[] = []): Promise<void> {
  let message = ''
  const exitCode = await exec.exec(cmd, params)

  const options: exec.ExecOptions = {}
  options.listeners = {
    stdout: (data: Buffer) => {
      message = data.toString()
    },
    stderr: (data: Buffer) => {
      message = data.toString()
    }
  }

  if (exitCode === 0) {
    core.info(message)
  } else {
    core.setFailed(message)
  }
}

export function resolveTempDirectory(): string {
  if (process.env['RUNNER_TEMP']) return process.env['RUNNER_TEMP']
  if (process.platform === 'win32') return path.join(process.env['USERPROFILE'] || 'C:\\', 'actions', 'temp')
  const baseLocation = process.platform === 'darwin' ? '/Users' : '/home'
  return path.join(baseLocation, 'actions', 'temp')
}

export async function getTempDirectory(): Promise<string> {
  const tmp = path.join(resolveTempDirectory(), 'sf')
  await io.mkdirP(tmp)
  return tmp
}
