import OBSWebSocket from 'obs-websocket-js'
import { debounce } from 'throttle-debounce'
import {emitNewEvent} from "./utils";

export class ObsEvntBoard {
  private readonly host: string;
  private readonly port: number;
  private readonly password: string;
  private obs: OBSWebSocket;
  private connected: boolean;

  constructor(host: string, port: number, password?: string) {
    this.host = host;
    this.port = port;
    this.password = password;
    this.obs = null;
    this.connected = false;
  }

  async load() {
    try {
      this.obs = new OBSWebSocket();

      this.obs.on('ConnectionOpened', () => {
        this.connected = true;
        emitNewEvent('obs-open');
      })

      this.obs.on('ConnectionClosed', () => {
        this.connected = false;
        emitNewEvent('obs-close');
      })

      this.obs.on('Exiting', () => {
        this.connected = false;
        this.unload()
      })

      this.obs.on('SwitchScenes', (data) => {
        emitNewEvent('obs-switch-scenes', data);
      });

      this.obs.on('StreamStarting', (data) => {
        emitNewEvent('obs-stream-starting', data);
      });

      this.obs.on('StreamStarted', () => {
        emitNewEvent('obs-stream-started');
      });

      this.obs.on('StreamStopping', (data) => {
        emitNewEvent('obs-stream-stopping', data);
      });

      this.obs.on('StreamStopping', (data) => {
        emitNewEvent('obs-stream-stopped', data);
      });

      this.obs.on('StreamStatus', (data) => {
        emitNewEvent('obs-stream-status', data);
      });

      this.obs.on('RecordingStarting', () => {
        emitNewEvent('obs-recording-starting');
      });

      this.obs.on('RecordingStarted', () => {
        emitNewEvent('obs-recording-started' );
      });

      this.obs.on('RecordingStopping', () => {
        emitNewEvent('obs-recording-stopping' );
      });

      this.obs.on('RecordingStopped', () => {
        emitNewEvent('obs-recording-stopped' );
      });

      this.obs.on('RecordingPaused', () => {
        emitNewEvent('obs-recording-paused' );
      });

      this.obs.on('RecordingResumed', () => {
        emitNewEvent('obs-recording-resumed' );
      });

      this.obs.on('SourceCreated', (data) => {
        emitNewEvent('obs-source-created', data);
      });

      this.obs.on('SourceDestroyed', (data) => {
        emitNewEvent('obs-source-destroyed', data);
      });

      this.obs.on('SourceVolumeChanged', (data) => {
        emitNewEvent('obs-source-volume-changed', data);
      });

      this.obs.on('SourceMuteStateChanged', (data) => {
        emitNewEvent('obs-source-mute-changed', data);
      });

      this.obs.on('SourceRenamed', (data) => {
        emitNewEvent('obs-source-renamed', data);
      });

      this.obs.on('SourceFilterAdded', (data) => {
        emitNewEvent('obs-filter-added', data);
      });

      this.obs.on('SourceFilterRemoved', (data) => {
        emitNewEvent('obs-filter-removed', data);
      });

      this.obs.on('SourceFilterVisibilityChanged', (data) => {
        emitNewEvent('obs-filter-visibility-changed', data);
      });

      this.obs.on('SceneItemAdded', (data) => {
        emitNewEvent('obs-sceneitem-added', data);
      });

      this.obs.on('SceneItemRemoved', (data) => {
        emitNewEvent('obs-sceneitem-removed', data);
      });

      this.obs.on('SceneItemVisibilityChanged', (data) => {
        emitNewEvent('obs-sceneitem-visibility-changed', data);
      });

      this.obs.on('SceneItemTransformChanged', (data) => {
        this.debounceTransform(data)
      });

      emitNewEvent('obs-load');

      await this.obs.connect({ address: `${this.host}:${this.port}`, password: this.password });
    } catch (e) {
      console.error(e)
      this.obs = null;
      emitNewEvent('obs-error');
    }
  }

  // don't spam EB !!
  debounceTransform = debounce(2000, (data) => {
    emitNewEvent('obs-sceneitem-transform-changed', data);
  });

  async unload() {
    try {
      this.connected = false;
      this.obs.disconnect();
      emitNewEvent('obs-unload');
    } catch (e) {
      console.error(e)
    }
  }

  async reload() {
    await this.unload();
    await this.load();
  }

  // Général

  async getVersion() {
    if (this.connected) {
      return await this.obs.send('GetVersion');
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async getStats() {
    if (this.connected) {
      return await this.obs.send('GetStats');
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async getInfo() {
    if (this.connected) {
      return await this.obs.send('GetVideoInfo');
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  // Scenes

  async sceneGetCurrent() {
    if (this.connected) {
      return await this.obs.send('GetCurrentScene');
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sceneSetCurrent(scene) {
    if (this.connected) {
      return await this.obs.send('SetCurrentScene', { 'scene-name': scene });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  // Sources

  async sourceGetSettings(source) {
    if (this.connected) {
      return await this.obs.send('GetSourceSettings', { sourceName: source });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sourceSetSettings(source, settings) {
    if (this.connected) {
      return await this.obs.send('SetSourceSettings', {
        sourceName: source,
        sourceSettings: settings,
      });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sourceGetVolume(source, useDecibel) {
    if (this.connected) {
      return await this.obs.send('GetVolume', { source, useDecibel });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sourceSetVolume(source, volume, useDecibel) {
    if (this.connected) {
      return await this.obs.send('SetVolume', { source, volume, useDecibel });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sourceGetMute(source) {
    if (this.connected) {
      return await this.obs.send('GetMute', { source });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sourceSetMute(source, mute) {
    if (this.connected) {
      return await this.obs.send('SetMute', { source, mute });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sourceMuteToggle(source) {
    if (this.connected) {
      return await this.obs.send('ToggleMute', { source });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  // text

  async textGDIGetSettings(source) {
    if (this.connected) {
      return await this.obs.send('GetTextGDIPlusProperties', { source });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async textGDISetSettings(source, settings) {
    if (this.connected) {
      return await this.obs.send('SetTextGDIPlusProperties', { source, ...settings });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async textFreeGetSettings(source) {
    if (this.connected) {
      return await this.obs.send('GetTextFreetype2Properties', { source });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async textFreeSetSettings(source, settings) {
    if (this.connected) {
      return await this.obs.send('SetTextFreetype2Properties', { source, ...settings });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  // filter

  async filterGetSettings(source, filter) {
    if (this.connected) {
      return await this.obs.send('GetSourceFilterInfo', { sourceName: source, filterName: filter });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async filterSetSettings(source, filter, settings) {
    if (this.connected) {
      return await this.obs.send('SetSourceFilterSettings', {
        sourceName: source,
        filterName: filter,
        filterSettings: settings,
      });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async filterSetVisibility(source, filter, enable) {
    if (this.connected) {
      return await this.obs.send('SetSourceFilterVisibility', {
        sourceName: source,
        filterName: filter,
        filterEnabled: enable,
      });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async filterToggleVisibility(source, filter) {
    if (this.connected) {
      const { enabled } = await this.filterGetSettings(source, filter);
      return await this.filterSetVisibility(source, filter, !enabled);
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  // Scene Items

  async sourceItemGetSettings(scene, itemName) {
    if (this.connected) {
      return await this.obs.send('GetSceneItemProperties', {
        'scene-name': scene,
        item: { name: itemName },
      });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sceneItemSetSettings(scene, itemName, settings) {
    if (this.connected) {
      return await this.obs.send('SetSceneItemProperties', {
        'scene-name': scene,
        item: { name: itemName },
        position: {},
        bounds: {},
        scale: {},
        crop: {},
        ...settings,
      });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sourceItemSetVisibility(scene, itemName, visibility) {
    if (this.connected) {
      return await this.obs.send('SetSceneItemProperties', {
        'scene-name': scene,
        item: { name: itemName },
        position: {},
        bounds: {},
        scale: {},
        crop: {},
        visible: visibility,
      });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sourceItemVisibilityToggle(scene, itemName) {
    if (this.connected) {
      const { visible } = await this.sourceItemGetSettings(scene, itemName);
      return await this.obs.send('SetSceneItemProperties', {
        'scene-name': scene,
        item: { name: itemName },
        visible: !visible,
        position: {},
        bounds: {},
        scale: {},
        crop: {},
      });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sourceItemSetScale(scene, itemName, x, y) {
    if (this.connected) {
      return await this.obs.send('SetSceneItemProperties', {
        'scene-name': scene,
        item: { name: itemName },
        scale: { x, y },
        position: {},
        bounds: {},
        crop: {},
      });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sourceItemSetPosition(scene, itemName, x, y) {
    if (this.connected) {
      return await this.obs.send('SetSceneItemProperties', {
        'scene-name': scene,
        item: { name: itemName },
        position: { x, y },
        bounds: {},
        scale: {},
        crop: {},
      });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async sourceItemSetRotation(scene, itemName, rotation) {
    if (this.connected) {
      return await this.obs.send('SetSceneItemProperties', {
        'scene-name': scene,
        item: { name: itemName },
        rotation,
        position: {},
        bounds: {},
        scale: {},
        crop: {},
      });
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  // Streaming

  async streamingGetStatus() {
    if (this.connected) {
      return await this.obs.send('GetStreamingStatus');
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async streamingToggle() {
    if (this.connected) {
      return await this.obs.send('StartStopStreaming');
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async streamingStart() {
    if (this.connected) {
      return await this.obs.send('StartStreaming', {});
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async streamingStop() {
    if (this.connected) {
      return await this.obs.send('StopStreaming');
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  // Recording

  async recordingGetStatus() {
    if (this.connected) {
      return await this.obs.send('GetStreamingStatus');
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async recordingToggle() {
    if (this.connected) {
      return await this.obs.send('StartStopRecording');
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async recordingStart() {
    if (this.connected) {
      return await this.obs.send('StartRecording');
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async recordingStop() {
    if (this.connected) {
      return await this.obs.send('StopRecording');
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async recordingPause() {
    if (this.connected) {
      return await this.obs.send('PauseRecording');
    } else {
      throw new Error('Obs not connected ...')
    }
  }

  async recordingResume() {
    if (this.connected) {
      return await this.obs.send('ResumeRecording');
    } else {
      throw new Error('Obs not connected ...')
    }
  }
}
