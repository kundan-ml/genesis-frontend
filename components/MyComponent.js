// components/MyComponent.js

export default function MyComponent() {
    useEffect(() => {
      fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Component mounted',
          level: 'info',
          timestamp: new Date().toISOString(),
        }),
      }).catch((error) => console.error('Failed to log:', error));
    }, []);
  
    return <div>MyComponent</div>;
  }
  