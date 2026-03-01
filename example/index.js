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
      const palm1 = args[1];
      const palm2 = args[2]?.endsWith('.jpg') || args[2]?.endsWith('.png') ? args[2] : undefined;
      const customerId = palm2 ? args[3] : args[2];
      const customerData = palm2 ? args[4] : args[3];
      
      result = await enrollImage(palm1, palm2, customerId, customerData);
      break;

    case 'recognize':
      result = await recognizeImage(args[1]);
      break;

    case 'delete':
      result = await deleteImage(args[1]);
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
