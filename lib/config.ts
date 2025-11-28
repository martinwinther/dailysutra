/**
 * Validates and provides typed access to environment variables.
 * Throws errors at module initialization if required variables are missing,
 * ensuring fail-fast behavior rather than runtime errors.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function requireEnvOptional(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

export const config = {
  stripe: {
    secretKey: requireEnv("STRIPE_SECRET_KEY"),
    priceId: requireEnv("STRIPE_PRICE_ID"),
    webhookSecret: requireEnv("STRIPE_WEBHOOK_SECRET"),
  },
  firebase: {
    serviceAccount: requireEnv("FIREBASE_SERVICE_ACCOUNT"),
  },
  app: {
    url: requireEnvOptional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  },
} as const;




