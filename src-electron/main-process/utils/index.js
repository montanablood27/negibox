import { app } from 'electron'
import os from 'os'
import { resolve } from 'path'
import { existsSync, lstatSync } from 'fs'
import logger from '../core/Logger'

export function getLogPath () {
  return logger.transports.file.file
}

export function getDhtPath (protocol) {
  const name = protocol === 6 ? 'dht6.dat' : 'dht.dat'
  return resolve(app.getPath('userData'), `./${name}`)
}

export function getSessionPath () {
  return resolve(app.getPath('userData'), './download.session')
}

export function getUserDataPath () {
  return app.getPath('userData')
}

export function getUserDownloadsPath () {
  return app.getPath('downloads')
}

export function getEngineBin (platform) {
  let result = {
    'darwin': 'aria2c',
    'win32': 'aria2c.exe',
    'linux': 'aria2c'
  }.hasOwnProperty(platform) ? {
      'darwin': 'aria2c',
      'win32': 'aria2c.exe',
      'linux': 'aria2c'
    }[platform] : ''
  return result
}

export function transformConfig (config) {
  let result = []
  for (const [k, v] of Object.entries(config)) {
    if (v !== '') {
      result.push(`--${k}=${v}`)
    }
  }
  return result
}

export function isRunningInDmg () {
  if (os.platform() !== 'darwin' || process.env.DEV) {
    return false
  }
  const appPath = app.getAppPath()
  const result = appPath.startsWith('/Volumes/')
  return result
}

export function moveAppToApplicationsFolder (errorMsg = '') {
  return new Promise((resolve, reject) => {
    try {
      const result = app.moveToApplicationsFolder()
      if (result) {
        resolve(result)
      } else {
        reject(new Error(errorMsg))
      }
    } catch (err) {
      reject(err)
    }
  })
}

export function splitArgv (argv) {
  const args = []
  const extra = {}
  for (const arg of argv) {
    if (arg.startsWith('--')) {
      const kv = arg.split('=')
      const key = kv[0]
      const value = kv[1] || '1'
      extra[key] = value
      continue
    }
    args.push(arg)
  }
  return { args, extra }
}

export function parseArgvAsUrl (argv) {
  let arg = argv[1]
  if (!arg) {
    return
  }

  if (checkIsSupportedSchema(arg)) {
    return arg
  }
}

export function checkIsSupportedSchema (url = '') {
  const str = url.toLowerCase()
  if (
    str.startsWith('http:') ||
    str.startsWith('https:') ||
    str.startsWith('ftp:') ||
    str.startsWith('magnet:') ||
    str.startsWith('thunder:') ||
    str.startsWith('flashget:') ||
    str.startsWith('qqdl:') ||
    str.startsWith('fs2you:')
  ) {
    return true
  } else {
    return false
  }
}

export function isDirectory (path) {
  return existsSync(path) && lstatSync(path).isDirectory()
}

export function parseArgvAsFile (argv) {
  let arg = argv[1]
  if (!arg || isDirectory(arg)) {
    return
  }

  if (os.platform() !== 'win32' && os.platform() !== 'darwin') {
    arg = arg.replace('file://', '')
  }
  return arg
}
