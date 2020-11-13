const OBSWebSocket = require('obs-websocket-js');

class Obs {
  constructor(options, bus) {
    this.host = options.host;
    this.port = options.port;
    this.password = options.password;
    this.bus = bus;
    this.obs = null;
    this.connected = false;
  }

  async load() {
    try {
      this.obs = new OBSWebSocket();

      this.obs.on('ConnectionOpened', () => {
        this.connected = true
        this.bus.newEvent({event: 'obs-open'});
      })

      this.obs.on('ConnectionClosed', () => {
        this.bus.newEvent({event: 'obs-close'});
      })

      this.obs.on('Exiting', () => {
        this.unload()
      })

      this.obs.on('SwitchScenes', (data) => {
        this.bus.newEvent({ event: 'obs-switch-scenes', ...data });
      });

      this.obs.on('StreamStarting', (data) => {
        this.bus.newEvent({ event: 'obs-stream-starting', ...data });
      });

      this.obs.on('StreamStarted', () => {
        this.bus.newEvent({ event: 'obs-stream-started' });
      });

      this.obs.on('StreamStopping', (data) => {
        this.bus.newEvent({ event: 'obs-stream-stopping', ...data });
      });

      this.obs.on('StreamStopping', (data) => {
        this.bus.newEvent({ event: 'obs-stream-stopped', ...data });
      });

      this.obs.on('StreamStatus', (data) => {
        this.bus.newEvent({ event: 'obs-stream-status', ...data });
      });

      this.obs.on('RecordingStarting', () => {
        this.bus.newEvent({ event: 'obs-recording-starting' });
      });

      this.obs.on('RecordingStarted', () => {
        this.bus.newEvent({ event: 'obs-recording-started' });
      });

      this.obs.on('RecordingStopping', () => {
        this.bus.newEvent({ event: 'obs-recording-stopping' });
      });

      this.obs.on('RecordingStopped', () => {
        this.bus.newEvent({ event: 'obs-recording-stopped' });
      });

      this.obs.on('RecordingPaused', () => {
        this.bus.newEvent({ event: 'obs-recording-paused' });
      });

      this.obs.on('RecordingResumed', () => {
        this.bus.newEvent({ event: 'obs-recording-resumed' });
      });

      this.obs.on('SourceCreated', (data) => {
        this.bus.newEvent({ event: 'obs-source-created', ...data });
      });

      this.obs.on('SourceDestroyed', (data) => {
        this.bus.newEvent({ event: 'obs-source-destroyed', ...data });
      });

      this.obs.on('SourceVolumeChanged', (data) => {
        this.bus.newEvent({ event: 'obs-source-volume-changed', ...data });
      });

      this.obs.on('SourceMuteStateChanged', (data) => {
        this.bus.newEvent({ event: 'obs-source-mute-changed', ...data });
      });

      this.obs.on('SourceRenamed', (data) => {
        this.bus.newEvent({ event: 'obs-source-renamed', ...data });
      });

      this.obs.on('SourceFilterAdded', (data) => {
        this.bus.newEvent({ event: 'obs-filter-added', ...data });
      });

      this.obs.on('SourceFilterRemoved', (data) => {
        this.bus.newEvent({ event: 'obs-filter-removed', ...data });
      });

      this.obs.on('SourceFilterVisibilityChanged', (data) => {
        this.bus.newEvent({ event: 'obs-filter-visibility-changed', ...data });
      });

      this.obs.on('SceneItemAdded', (data) => {
        this.bus.newEvent({ event: 'obs-sceneitem-added', ...data });
      });

      this.obs.on('SceneItemRemoved', (data) => {
        this.bus.newEvent({ event: 'obs-sceneitem-removed', ...data });
      });

      this.obs.on('SceneItemVisibilityChanged', (data) => {
        this.bus.newEvent({ event: 'obs-sceneitem-visibility-changed', ...data });
      });

      this.obs.on('SceneItemTransformChanged', (data) => {
        this.bus.newEvent({ event: 'obs-sceneitem-transform-changed', ...data });
      });

      this.bus.newEvent({ event: 'obs-load' });

      await this.obs.connect({ address: `${this.host}:${this.port}`, password: this.password });
    } catch (e) {
      console.error(e)
      this.obs = null;
      this.connected = false;
      this.bus.newEvent({ event: 'obs-error' });
    }
  }

  async unload() {
    try {
      this.obs.disconnect();
      this.connected = false;
      this.bus.newEvent({event: 'obs-unload'});
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
    return await this.obs.send('GetVersion');
  }

  async getStats() {
    return await this.obs.send('GetStats');
  }

  async getInfo() {
    return await this.obs.send('GetVideoInfo');
  }

  // Scenes

  async sceneGetCurrent() {
    return await this.obs.send('GetCurrentScene');
  }

  async sceneSetCurrent(scene) {
    return await this.obs.send('SetCurrentScene', { 'scene-name': scene });
  }

  // Sources

  async sourceGetSettings(source) {
    return await this.obs.send('GetSourceSettings', { sourceName: source });
  }

  async sourceSetSettings(source, settings) {
    return await this.obs.send('SetSourceSettings', {
      sourceName: source,
      sourceSettings: settings,
    });
  }

  async sourceGetVolume(source, useDecibel) {
    return await this.obs.send('GetVolume', { source, useDecibel });
  }

  async sourceSetVolume(source, volume, useDecibel) {
    return await this.obs.send('SetVolume', { source, volume, useDecibel });
  }

  async sourceGetMute(source) {
    return await this.obs.send('GetMute', { source });
  }

  async sourceSetMute(source, mute) {
    return await this.obs.send('SetMute', { source, mute });
  }

  async sourceMuteToggle(source) {
    return await this.obs.send('ToggleMute', { source });
  }

  // text

  async textGDIGetSettings(source) {
    return await this.obs.send('GetTextGDIPlusProperties', { source });
  }

  async textGDISetSettings(source, settings) {
    return await this.obs.send('SetTextGDIPlusProperties', { source, ...settings });
  }

  async textFreeGetSettings(source) {
    return await this.obs.send('GetTextFreetype2Properties', { source });
  }

  async textFreeSetSettings(source, settings) {
    return await this.obs.send('SetTextFreetype2Properties', { source, ...settings });
  }

  // filter

  async filterGetSettings(source, filter) {
    return await this.obs.send('GetSourceFilterInfo', { sourceName: source, filterName: filter });
  }

  async filterSetSettings(source, filter, settings) {
    return await this.obs.send('SetSourceFilterSettings', {
      sourceName: source,
      filterName: filter,
      filterSettings: settings,
    });
  }

  async filterSetVisibility(source, filter, enable) {
    return await this.obs.send('SetSourceFilterVisibility', {
      sourceName: source,
      filterName: filter,
      filterEnabled: enable,
    });
  }

  async filterToggleVisibility(source, filter) {
    const { enabled } = await this.filterGetSettings(source, filter);
    return await this.filterSetVisibility(source, filter, !enabled);
  }

  // Scene Items

  async sourceItemGetSettings(scene, itemName) {
    return await this.obs.send('GetSceneItemProperties', {
      'scene-name': scene,
      item: { name: itemName },
    });
  }

  async sceneItemSetSettings(scene, itemName, settings) {
    return await this.obs.send('SetSceneItemProperties', {
      'scene-name': scene,
      item: { name: itemName },
      position: {},
      bounds: {},
      scale: {},
      crop: {},
      ...settings,
    });
  }

  async sourceItemSetVisibility(scene, itemName, visibility) {
    return await this.obs.send('SetSceneItemProperties', {
      'scene-name': scene,
      item: { name: itemName },
      position: {},
      bounds: {},
      scale: {},
      crop: {},
      visible: visibility,
    });
  }

  async sourceItemVisibilityToggle(scene, itemName) {
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
  }

  async sourceItemSetScale(scene, itemName, x, y) {
    return await this.obs.send('SetSceneItemProperties', {
      'scene-name': scene,
      item: { name: itemName },
      scale: { x, y },
      position: {},
      bounds: {},
      crop: {},
    });
  }

  async sourceItemSetPosition(scene, itemName, x, y) {
    return await this.obs.send('SetSceneItemProperties', {
      'scene-name': scene,
      item: { name: itemName },
      position: { x, y },
      bounds: {},
      scale: {},
      crop: {},
    });
  }

  async sourceItemSetRotation(scene, itemName, rotation) {
    return await this.obs.send('SetSceneItemProperties', {
      'scene-name': scene,
      item: { name: itemName },
      rotation,
      position: {},
      bounds: {},
      scale: {},
      crop: {},
    });
  }

  // Streaming

  async streamingGetStatus() {
    return await this.obs.send('GetStreamingStatus');
  }

  async streamingToggle() {
    return await this.obs.send('StartStopStreaming');
  }

  async streamingStart() {
    return await this.obs.send('StartStreaming', {});
  }

  async streamingStop() {
    return await this.obs.send('StopStreaming');
  }

  // Recording

  async recordingGetStatus() {
    return await this.obs.send('GetStreamingStatus');
  }

  async recordingToggle() {
    return await this.obs.send('StartStopRecording');
  }

  async recordingStart() {
    return await this.obs.send('StartRecording');
  }

  async recordingStop() {
    return await this.obs.send('StopRecording');
  }

  async recordingPause() {
    return await this.obs.send('PauseRecording');
  }

  async recordingResume() {
    return await this.obs.send('ResumeRecording');
  }
}


module.exports = Obs
