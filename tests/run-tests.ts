import { runRateLimitTests } from "./rate-limit.test.ts";
import { runPrismaSingletonTests } from "./prisma-singleton.test.ts";
import { runSeedTests } from "./seed.test.ts";

async function main() {
  await runRateLimitTests();
  await runPrismaSingletonTests();
  await runSeedTests();

  console.log("✅ Stability tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
