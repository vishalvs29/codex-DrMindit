import { runRateLimitTests } from "./rate-limit.test";
import { runPrismaSingletonTests } from "./prisma-singleton.test";
import { runSeedTests } from "./seed.test";

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
