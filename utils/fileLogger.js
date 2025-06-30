// utils/fileLogger.js

import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'logs.txt');

export function logToFile(message, level = 'info') {
  const logEntry = `${new Date().toISOString()} - ${level.toUpperCase()}: ${message}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
}
