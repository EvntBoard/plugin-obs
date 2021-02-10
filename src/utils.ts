import { workerData, parentPort } from 'worker_threads'

import {OBSPluginOptions} from "./types";
import {ObsEvntBoard} from "./ObsEvntBoard";

export const getConfig = (): OBSPluginOptions => workerData.plugin

export const emitNewEvent = (event: string, payload?: any) => {
  parentPort.postMessage({
    type: 'newEvent',
    event,
    payload
  })
}

export const onCallMethod = (plugin: ObsEvntBoard) => {
  parentPort.on('message', async (data) => {
    if (data.type === 'callMethod') {
      try {
        const result = await plugin[data.method](...data.args)
        parentPort.postMessage({
          type: 'callMethod',
          id: data.id,
          result
        })
      } catch (e) {
        parentPort.postMessage({
          type: 'callMethod',
          id: data.id,
          error: e
        })
      }
    }
  })
}
