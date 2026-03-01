export interface Credentials {
  instanceId: string;
  secret: string;
}

export interface Options {
  credentials?: Credentials;
  imageMirrored?: boolean;
}

export type EnrollOptions = Options;

export type EnrollResult = { ok: true; [key: string]: unknown } | { ok: false; [key: string]: unknown };
export type RecognizeResult = { ok: true; [key: string]: unknown } | { ok: false; [key: string]: unknown };
export type DeleteResult = { ok: true; [key: string]: unknown } | { ok: false; [key: string]: unknown };
