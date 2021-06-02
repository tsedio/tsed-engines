export type EngineCallback = (err: Error | null, str?: string | any) => any;

export interface RenderCallback {
  (str: string, options: any, cb: EngineCallback): Promise<any>;
}

export interface EngineOptions {
  cache?: boolean,

  [otherOptions: string]: any
}

export interface Engine {
  render(str: string, options: EngineOptions): Promise<string>;
  render(str: string, options: EngineOptions, cb: EngineCallback): any;

  (path: string, options: EngineOptions, cb: EngineCallback): any;
  (path: string, options: EngineOptions): Promise<string>;
}