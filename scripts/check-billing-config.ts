async function main() {
  try {
    const svc = await import("../lib/services/subscription-service");
    const utils = await import("../lib/utils");

    console.log("Running billing config checks...");

    try {
      svc.validateStripePriceIds();
      console.log("✔ Stripe price IDs validation: OK");
    } catch (err: any) {
      console.error("✖ Stripe price IDs validation: FAILED", err?.message ?? err);
      process.exitCode = 2;
      return;
    }

    try {
      const formatted = svc.formatAmountCents(159900, "INR");
      console.log("✔ Server format example for 159900 cents:", formatted);
    } catch (err: any) {
      console.error("✖ Server formatting failed", err?.message ?? err);
      process.exitCode = 3;
      return;
    }

    try {
      const ui = utils.formatCurrency(1599, "INR");
      console.log("✔ UI format example for 1599:", ui);
    } catch (err: any) {
      console.error("✖ UI formatting failed", err?.message ?? err);
      process.exitCode = 4;
      return;
    }

    console.log("All billing checks completed successfully.");
  } catch (err: any) {
    console.error("Unexpected error running checks:", err?.message ?? err);
    process.exitCode = 1;
  }
}

main();
