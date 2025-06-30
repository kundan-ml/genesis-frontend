// Import the PrismaClient from @prisma/client
import { PrismaClient } from '@prisma/client';

// Create a new instance of PrismaClient
const prisma = new PrismaClient();

// Define an async function to connect to the database
async function connectToDatabase() {
  try {
    // Test the connection by performing a simple query
    await prisma.$connect();
    console.log('Successfully connected to the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    // Disconnect the Prisma client when done
    await prisma.$disconnect();
  }
}

// Call the function to connect to the database
connectToDatabase();
