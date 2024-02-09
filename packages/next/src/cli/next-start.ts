#!/usr/bin/env node

import '../server/lib/cpu-profile'
import { startServer } from '../server/lib/start-server'
import { printAndExit } from '../server/lib/utils'
import { getProjectDir } from '../lib/get-project-dir'
import {
  getReservedPortExplanation,
  isPortIsReserved,
} from '../lib/helpers/get-reserved-port'

type NextStartOptions = {
  port: number
  hostname?: string
  keepAliveTimeout?: number
  experimentalTestProxy?: boolean
}

const nextStart = async (options: NextStartOptions, directory?: string) => {
  const dir = getProjectDir(directory)
  const host = options.hostname
  const port = options.port
  const isExperimentalTestProxy = options.experimentalTestProxy
  let keepAliveTimeout = options.keepAliveTimeout

  if (isPortIsReserved(port)) {
    printAndExit(getReservedPortExplanation(port), 1)
  }

  if (typeof keepAliveTimeout !== 'undefined') {
    if (
      Number.isNaN(keepAliveTimeout) ||
      !Number.isFinite(keepAliveTimeout) ||
      keepAliveTimeout < 0
    ) {
      printAndExit(
        `Invalid --keepAliveTimeout, expected a non negative number but received "${keepAliveTimeout}"`,
        1
      )
    }
    keepAliveTimeout = Math.ceil(keepAliveTimeout)
  }

  await startServer({
    dir,
    isDev: false,
    isExperimentalTestProxy,
    hostname: host,
    port,
    keepAliveTimeout,
  })
}

export { nextStart }
