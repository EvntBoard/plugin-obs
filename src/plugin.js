const OBSWebSocket = require('obs-websocket-js');

class Obs {
  constructor(options, { evntBus, logger }) {
    this.host = options.host;
    this.port = options.port;
    this.password = options.password;
    this.evntBus = evntBus;
    this.logger = logger;
    this.obs = null;
    this.connected = false;
  }

  async load() {
    try {
      this.obs = new OBSWebSocket();

      this.obs.on('ConnectionOpened', () => {
        this.connected = true;
        this.evntBus?.newEvent('obs-open');
      })

      this.obs.on('ConnectionClosed', () => {
        this.connected = false;
        this.evntBus?.newEvent('obs-close');
      })

      this.obs.on('Exiting', () => {
        this.connected = false;
        this.unload()
      })

      this.obs.on('SwitchScenes', (data) => {
        this.evntBus?.newEvent('obs-switch-scenes', data);
      });

      this.obs.on('StreamStarting', (data) => {
        this.evntBus?.newEvent('obs-stream-starting', data);
      });

      this.obs.on('StreamStarted', () => {
        this.evntBus?.newEvent('obs-stream-started');
      });

      this.obs.on('StreamStopping', (data) => {
        this.evntBus?.newEvent('obs-stream-stopping', data);
      });

      this.obs.on('StreamStopping', (data) => {
        this.evntBus?.newEvent('obs-stream-stopped', data);
      });

      this.obs.on('StreamStatus', (data) => {
        this.evntBus?.newEvent('obs-stream-status', data);
      });

      this.obs.on('RecordingStarting', () => {
        this.evntBus?.newEvent('obs-recording-starting');
      });

      this.obs.on('RecordingStarted', () => {
        this.evntBus?.newEvent('obs-recording-started' );
      });

      this.obs.on('RecordingStopping', () => {
        this.evntBus?.newEvent('obs-recording-stopping' );
      });

      this.obs.on('RecordingStopped', () => {
        this.evntBus?.newEvent('obs-recording-stopped' );
      });

      this.obs.on('RecordingPaused', () => {
        this.evntBus?.newEvent('obs-recording-paused' );
      });

      this.obs.on('RecordingResumed', () => {
        this.evntBus?.newEvent('obs-recording-resumed' );
      });

      this.obs.on('SourceCreated', (data) => {
        this.evntBus?.newEvent('obs-source-created', data);
      });

      this.obs.on('SourceDestroyed', (data) => {
        this.evntBus?.newEvent('obs-source-destroyed', data);
      });

      this.obs.on('SourceVolumeChanged', (data) => {
        this.evntBus?.newEvent('obs-source-volume-changed', data);
      });

      this.obs.on('SourceMuteStateChanged', (data) => {
        this.evntBus?.newEvent('obs-source-mute-changed', data);
      });

      this.obs.on('SourceRenamed', (data) => {
        this.evntBus?.newEvent('obs-source-renamed', data);
      });

      this.obs.on('SourceFilterAdded', (data) => {
        this.evntBus?.newEvent('obs-filter-added', data);
      });

      this.obs.on('SourceFilterRemoved', (data) => {
        this.evntBus?.newEvent('obs-filter-removed', data);
      });

      this.obs.on('SourceFilterVisibilityChanged', (data) => {
        this.evntBus?.newEvent('obs-filter-visibility-changed', data);
      });

      this.obs.on('SceneItemAdded', (data) => {
        this.evntBus?.newEvent('obs-sceneitem-added', data);
      });

      this.obs.on('SceneItemRemoved', (data) => {
        this.evntBus?.newEvent('obs-sceneitem-removed', data);
      });

      this.obs.on('SceneItemVisibilityChanged', (data) => {
        this.evntBus?.newEvent('obs-sceneitem-visibility-changed', data);
      });

      this.obs.on('SceneItemTransformChanged', (data) => {
        this.evntBus?.newEvent('obs-sceneitem-transform-changed', data);
      });

      this.evntBus?.newEvent('obs-load');

      await this.obs.connect({ address: `${this.host}:${this.port}`, password: this.password });
    } catch (e) {
      this.logger.error(e)
      this.obs = null;
      this.evntBus?.newEvent('obs-error');
    }
  }

  async unload() {
    try {
      this.connected = false;
      this.obs.disconnect();
      this.evntBus?.newEvent('obs-unload');
    } catch (e) {
      this.logger.error(e)
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

module.exports = Obs
