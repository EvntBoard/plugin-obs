export interface OBSPluginOptions {
  id: number,
  slug: string,
  plugin: string,
  active: boolean,
  config: {
    host: string,
    port: number,
    password: string,
  }
}
