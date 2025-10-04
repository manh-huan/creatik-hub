/**
 * Redis Configuration and Client Setup
 * Used for caching, session storage, and temporary token storage
 */

import { createClient } from "redis";

// Validate required environment variables (password is optional for local dev)
if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
  throw new Error("Missing required Redis environment variables: REDIS_HOST and REDIS_PORT");
}

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = parseInt(process.env.REDIS_PORT, 10);

//Todo: make password required in production
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
const REDIS_DB = parseInt(process.env.REDIS_DB || '0', 10);

let redisClient: ReturnType<typeof createClient> | null = null;

/**
 * Create and connect to Redis client
 * @returns Redis client instance
 */
export async function createRedisClient(): Promise<
  ReturnType<typeof createClient>
> {
  if (redisClient) {
    return redisClient;
  }

  const client = createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
    password: REDIS_PASSWORD,
    database: REDIS_DB,
  });

  client.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });

  client.on("connect", () => {
    console.log("Redis connected successfully");
  });

  client.on("reconnecting", () => {
    console.log("Redis reconnecting...");
  });

  client.on("ready", () => {
    console.log("Redis client ready");
  });

  try {
    await client.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    throw err;
  }

  redisClient = client;
  return client;
}

/**
 * Get existing Redis client or create new one
 * @returns Redis client instance
 */
export async function getRedisClient(): Promise<ReturnType<typeof createClient>> {
  if (!redisClient) {
    return await createRedisClient();
  }
  return redisClient;
}

export async function closeRedisClient(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log("Redis connection closed");
  }
}

/**
 * Check if Redis is connected
 */
export function isRedisConnected(): boolean {
  return redisClient !== null && redisClient.isOpen;
}

export default {
  createRedisClient,
  getRedisClient,
  closeRedisClient,
  isRedisConnected,
};
