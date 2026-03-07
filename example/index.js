import { enrollImage, recognizeImage, deleteImage } from '@miro/image-upload';
import { readFileSync } from 'fs';

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log('Usage: node index.js <command> [options]');
  console.log('\nCommands:');
  console.log('  enroll <palm1> [palm2] [customerId] [customerData]');
  console.log('  recognize <palmImage>');
  console.log('  delete <palmImage>');
  process.exit(1);
}

try {
  let result;

  switch (command) {
    case 'enroll':
      const palm1Path = args[1];
      const palm2Path = args[2]?.endsWith('.jpg') || args[2]?.endsWith('.png') ? args[2] : undefined;
      const customerId = palm2Path ? args[3] : args[2];
      const customerData = palm2Path ? args[4] : args[3];
      
      const palm1Buffer = readFileSync(palm1Path);
      const palm2Buffer = palm2Path ? readFileSync(palm2Path) : undefined;
      result = await enrollImage(palm1Buffer, palm2Buffer, customerId, customerData);
      break;

    case 'recognize':
      result = await recognizeImage(readFileSync(args[1]));
      break;

    case 'delete':
      result = await deleteImage(readFileSync(args[1]));
      break;

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
