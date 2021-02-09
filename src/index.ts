import {ObsEvntBoard} from "./ObsEvntBoard";
import {getConfig, onCallMethod} from "./utils";

const OPTIONS = getConfig()

const plugin = new ObsEvntBoard(OPTIONS.config.host, OPTIONS.config.port, OPTIONS.config.password)

plugin
.load()
.then(() => {
  // register message when plugin loaded
  onCallMethod(plugin)
})
