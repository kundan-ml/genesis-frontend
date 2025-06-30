// app/api/logs/route.js

import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'logs.json');

function readLogs() {
  try {
    const data = fs.readFileSync(logFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return []; // Return an empty array if the file doesn't exist
  }
}

function writeLog(logEntry) {
  const logs = readLogs();
  logs.push(logEntry);

  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), 'utf8');
}

export async function POST(req) {
  try {
    const logEntry = await req.json();
    writeLog(logEntry);
    return new Response(JSON.stringify({ status: 'Log saved' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save log' }), { status: 500 });
  }
}
