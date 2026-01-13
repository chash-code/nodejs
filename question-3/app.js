import os from 'os';
import fs from 'fs/promises';

// Part A - Using OS module
console.log('=== System Information ===');
console.log('Free Memory:', os.freemem(), 'bytes');
console.log('Total CPU Cores:', os.cpus().length);
console.log('');

// Part B - File System CRUD Operations
async function performFileOperations() {
  try {
    // 1. Create first file - data.txt
    await fs.writeFile('data.txt', 'Hello World');
    console.log('Created data.txt with content: Hello World');
    
    // 2. Create second file - Readme.md
    await fs.writeFile('Readme.md', '## This is first line in Readme');
    console.log('Created Readme.md with content');
    
    // 3. Read data.txt and print its content
    const dataContent = await fs.readFile('data.txt', 'utf-8');
    console.log('Content of data.txt:', dataContent);
    
    // 4. Append text to data.txt
    await fs.appendFile('data.txt', '\nThis is second line');
    console.log('Appended new line to data.txt');
    
    // Read again to verify
    const updatedContent = await fs.readFile('data.txt', 'utf-8');
    console.log('Updated content of data.txt:', updatedContent);
    
    // 5. Delete Readme.md file
    await fs.unlink('Readme.md');
    console.log('Deleted Readme.md file');
    
  } catch (error) {
    console.error('Error performing file operations:', error);
  }
}

// Execute the file operations
performFileOperations();
