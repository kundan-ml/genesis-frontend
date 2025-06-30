// utils/logger.js

export async function logEvent(message, level = 'info') {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, level, timestamp: new Date() }),
      });
    } catch (error) {
      console.error('Logging failed', error);
    }
  }
  