export interface Credentials {
  instanceId: string;
  secret: string;
}

export interface Options {
  credentials?: Credentials;
  imageMirrored?: boolean;
}

export type EnrollOptions = Options;

export type EnrollResult =
  | { ok: true; profileId: string; customerId?: string; customerData?: string; requestId: string }
  | { ok: false; error: string; detail?: string; requestId?: string };

export type RecognizeResult =
  | { ok: true; profileId: string; customerId?: string; customerData?: string; requestId: string }
  | { ok: false; error: string; detail?: string; requestId?: string };

export type DeleteResult =
  | { ok: true; profileId: string; customerId?: string; customerData?: string; requestId: string }
  | { ok: false; error: string; detail?: string; requestId?: string };
