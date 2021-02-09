import {OBSPluginOptions} from "./types";
import {ObsEvntBoard} from "./ObsEvntBoard";

export const getConfig = (): OBSPluginOptions => JSON.parse(process.argv.slice(2)[0])

export const emitNewEvent = (event: string, payload?: any) => {
  process.send({
    type: 'newEvent',
    event,
    payload
  })
}

export const onCallMethod = (plugin: ObsEvntBoard) => {
  process.on('message', async (data) => {
    if (data.type === 'callMethod') {
      try {
        const result = await plugin[data.method](...data.args)
        process.send({
          type: 'callMethod',
          id: data.id,
          result
        })
      } catch (e) {
        process.send({
          type: 'callMethod',
          id: data.id,
          error: e
        })
      }
    }
  })
}
