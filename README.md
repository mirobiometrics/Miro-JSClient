# @miro/image-upload

Palm enrollment, recognition, and deletion with [Miro](https://mirobiometrics.com/).

See [here](https://github.com/mirobiometrics/Miro-Documentation/blob/main/MIRO_API_DOCUMENTATION.md) for low-level API details.

## Camera Recommendations

For best palm capture results:

- **Use back-facing camera** when available (typically on mobile devices)
- **Front-facing cameras** are typically mirrored; set `imageMirrored: true` in `options`when using them.


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

// Enroll one palm
const result = await enrollImage('/path/to/palm1.jpg');

// Enroll one palm with customer data
const result = await enrollImage('/path/to/palm1.jpg', undefined, 'user-123', 'encrypted-user-data');

// Enroll two palms (must be one left and one right)
const result = await enrollImage('/path/to/palm1.jpg', '/path/to/palm2.jpg', 'user-123', 'encrypted-user-data');

// Recognize a palm
const match = await recognizeImage('/path/to/palm.jpg');
if (match.ok) {
  console.log('Profile ID:', match.profileId);
  console.log('Customer ID:', match.customerId);
}

// Delete a profile by palm match
const deleted = await deleteImage('/path/to/palm.jpg');
```

## API

### `enrollImage(palm1Path, palm2Path?, customerId?, customerData?, options?)`

Enroll one or two palm images and create a profile.

**Parameters:**
- `palm1Path` (string): Path to first palm image
- `palm2Path` (string, optional): Path to second palm image (must be opposite chirality)
- `customerId` (string, optional): Unique customer identifier
- `customerData` (string, optional): Encrypted customer data
- `options` (object, optional):
  - `credentials`: Instance ID and secret
  - `imageMirrored`: Set to `true` if images are horizontally mirrored (e.g., front-facing camera)

**Returns:** `EnrollResult`
```typescript
{ ok: true, profileId: string, customerId?: string, customerData?: string, requestId: string }
// or
{ ok: false, code: string, message: string, requestId?: string }
```

### `recognizeImage(imagePath, options?)`

Recognize a palm and retrieve the associated profile.

**Parameters:**
- `imagePath` (string): Path to palm image
- `options` (object, optional):
  - `credentials`: Instance ID and secret
  - `imageMirrored`: Set to `true` if image is horizontally mirrored (e.g., front-facing camera)

**Returns:** `RecognizeResult`
```typescript
{ ok: true, profileId: string, customerId?: string, customerData?: string, requestId: string }
// or
{ ok: false, code: string, message: string, requestId?: string }
```

### `deleteImage(imagePath, options?)`

Delete a profile by matching a palm image.

**Parameters:**
- `imagePath` (string): Path to palm image
- `options` (object, optional):
  - `credentials`: Instance ID and secret
  - `imageMirrored`: Set to `true` if image is horizontally mirrored (e.g., front-facing camera)

**Returns:** `DeleteResult`
```typescript
{ ok: true, profileId: string, customerId?: string, customerData?: string, requestId: string }
// or
{ ok: false, code: string, message: string, requestId?: string }
```
