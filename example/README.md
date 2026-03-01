# Miro Image Upload Example

Minimal CLI wrapper for testing the Miro API.

## Setup

```bash
npm install
```

Set credentials:
```bash
export MIRO_INSTANCE_ID="your-instance-id"
export MIRO_SECRET="your-secret"
```

## Usage

**Enroll one palm:**
```bash
node index.js enroll palm1.jpg
```

**Enroll two palms with customer data:**
```bash
node index.js enroll palm1.jpg palm2.jpg user-123 encrypted-data
```

**Recognize a palm:**
```bash
node index.js recognize palm.jpg
```

**Delete a profile:**
```bash
node index.js delete palm.jpg
```
