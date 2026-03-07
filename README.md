# @miro/image-upload

Palm enrollment, recognition, and deletion with [Miro](https://mirobiometrics.com/).

See [here](https://github.com/mirobiometrics/Miro-Documentation/blob/main/MIRO_API_DOCUMENTATION.md) for low-level API details.

## Requirements

- Images must be less than 6Mbs in size.
- Image resolution must be between 1080x1080 and 2400x2400. Portrait images are preferred.
- Device clock must be within a few minutes of the current server time.
- Each request must contain a unique image. Submitting the same image multiple times will be rejected.

## Camera Recommendations

For best palm capture results:

- Use back-facing camera when available (typically on mobile devices)
- Front-facing cameras are typically mirrored; set `imageMirrored: true` in `options` when using them.


## Installation

1. Install the latest tarball from https://github.com/mirobiometrics/Miro-JSClient/releases (assuming 1.0.0 in this example):


```bash
npm install /path/to/miro-image-upload-1.0.0.tgz
```

2. Set up credentials (choose one):

**Option A: Environment variables (recommended)**
```bash
export MIRO_INSTANCE_ID="your-instance-id"
export MIRO_SECRET="your-secret"
```

**Option B: Pass directly in code**
```typescript
const options = {
  credentials: { instanceId: 'your-id', secret: 'your-secret' }
};
```

## Usage

```typescript
import { enrollImage, recognizeImage, deleteImage } from '@miro/image-upload';
import { readFile } from 'fs/promises';

// Enroll one palm
const palm1 = await readFile('/path/to/palm1.jpg');
const result = await enrollImage(palm1);

// Enroll one palm with customer data
const result = await enrollImage(palm1, undefined, 'user-123', 'encrypted-user-data');

// Enroll two palms (must be one left and one right)
const palm2 = await readFile('/path/to/palm2.jpg');
const result = await enrollImage(palm1, palm2, 'user-123', 'encrypted-user-data');

// Recognize a palm
const palmBuffer = await readFile('/path/to/palm.jpg');
const match = await recognizeImage(palmBuffer);
if (match.ok) {
  console.log('Profile ID:', match.profileId);
  console.log('Customer ID:', match.customerId);
}

// Delete a profile by palm match
const deleted = await deleteImage(palmBuffer);
```

## API

### `enrollImage(palm1Buffer, palm2Buffer?, customerId?, customerData?, options?)`

Enroll one or two palm images and create a profile.

**Parameters:**
- `palm1Buffer` (Buffer): First palm image buffer
- `palm2Buffer` (Buffer, optional): Second palm image buffer (must be opposite chirality)
- `customerId` (string, optional): Unique customer identifier
- `customerData` (string, optional): Encrypted customer data
- `options` (object, optional):
  - `credentials`: Instance ID and secret
  - `imageMirrored`: Set to `true` if images are horizontally mirrored (e.g., front-facing camera)

**Returns:** `EnrollResult`
```typescript
{ ok: true, profileId: string, customerId?: string, customerData?: string, requestId: string }
// or
{ ok: false, error: string, detail?: string, requestId?: string }
```

### `recognizeImage(imageBuffer, options?)`

Recognize a palm and retrieve the associated profile.

**Parameters:**
- `imageBuffer` (Buffer): Palm image buffer
- `options` (object, optional):
  - `credentials`: Instance ID and secret
  - `imageMirrored`: Set to `true` if image is horizontally mirrored (e.g., front-facing camera)

**Returns:** `RecognizeResult`
```typescript
{ ok: true, profileId: string, customerId?: string, customerData?: string, requestId: string }
// or
{ ok: false, error: string, detail?: string, requestId?: string }
```

### `deleteImage(imageBuffer, options?)`

Delete a profile by matching a palm image.

**Parameters:**
- `imageBuffer` (Buffer): Palm image buffer
- `options` (object, optional):
  - `credentials`: Instance ID and secret
  - `imageMirrored`: Set to `true` if image is horizontally mirrored (e.g., front-facing camera)

**Returns:** `DeleteResult`
```typescript
{ ok: true, profileId: string, customerId?: string, customerData?: string, requestId: string }
// or
{ ok: false, error: string, detail?: string, requestId?: string }
```
