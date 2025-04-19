#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  console.log('Building design library...');
  execSync('npx tsup src/index.ts --format esm,cjs --dts --external react --external @emotion/react --external @emotion/styled', 
    { stdio: 'inherit' }
  );
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
