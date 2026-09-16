/**
 * GlobalVisa Sync - Travel Agency API Automation & Verification Script
 *
 * Usage:
 *   node script.js
 *
 * Demonstrates:
 * 1. Querying all 195+ world countries from the API
 * 2. Fetching required travel documents for an Indian traveler booking a USA tour package (B1/B2 Visa)
 * 3. Simulating a high-concurrency batch passenger manifest check for a travel agency cruise/flight
 * 4. Checking LRU Memory Cache stats and cache hit ratio
 */

const fetch = globalThis.fetch;

const BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";
const API_KEY = process.env.AGENCY_API_KEY || "agency_standard_sk_987";

async function runTravelAgencyAutomationScript() {
  console.log(
    "================================================================",
  );
  console.log("🚀 GlobalVisa Sync - Travel Agency Automation Test Script");
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`🔑 API Key:  ${API_KEY}`);
  console.log(
    "================================================================\n",
  );

  try {
    // STEP 1: Fetch list of all world countries supported
    console.log(
      "📌 [STEP 1] Fetching complete list of supported world countries...",
    );
    const countriesRes = await fetch(`${BASE_URL}/api/v1/countries`);
    const countriesData = await countriesRes.json();
    console.log(`✅ Total Countries Supported: ${countriesData.total}`);
    console.log(
      `   Sample Countries: ${countriesData.countries.slice(0, 10).join(", ")}...\n`,
    );

    // STEP 2: Comprehensive Check for Traveler in India booking USA Package
    console.log(
      "📌 [STEP 2] Fetching Required Documents for Traveler in INDIA booking a USA Package...",
    );
    const usaPayload = {
      nationality: "India",
      destination: "United States",
      travelPurpose: "tourism",
      stayDurationDays: 14,
    };

    const usaRes = await fetch(`${BASE_URL}/api/v1/visa-checklist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(usaPayload),
    });

    const usaData = await usaRes.json();
    console.log(
      `⏱️  Response Latency: ${usaData.latencyMs}ms | Cache Status: ${usaData.cacheStatus}`,
    );
    console.log(`🏷️  Category:         ${usaData.data.category}`);
    console.log(
      `💰 Estimated Cost:    ${usaData.data.estimatedCost.formatted}`,
    );
    console.log(`⏱️  Processing Time:   ${usaData.data.processingTime}`);
    console.log(`📋 Summary:           ${usaData.data.summary}\n`);

    console.log(
      "📄 REQUIRED DOCUMENTATION CHECKLIST FOR INDIA ➔ USA TOUR PACKAGE:",
    );
    usaData.data.documentChecklist.forEach((doc, idx) => {
      console.log(
        `   ${idx + 1}. [${doc.category.toUpperCase()}] ${doc.title}`,
      );
      console.log(`      - Details: ${doc.description}`);
      console.log(`      - Required For: ${doc.requiredFor}`);
    });
    console.log("\n");

    // STEP 3: Repeat Request to demonstrate LRU Cache Hit
    console.log("📌 [STEP 3] Testing Distributed Cache Hit for India ➔ USA...");
    const cacheHitRes = await fetch(`${BASE_URL}/api/v1/visa-checklist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(usaPayload),
    });
    const cacheHitData = await cacheHitRes.json();
    console.log(
      `⚡ Cache Status: ${cacheHitData.cacheStatus} | Latency: ${cacheHitData.latencyMs}ms (Ultra Fast!)\n`,
    );

    // STEP 4: High-Concurrency Batch Stress Test (Cruise Ship Manifest)
    console.log(
      "📌 [STEP 4] Executing High-Concurrency Batch Manifest Benchmark (10 Passengers)...",
    );
    const batchManifest = [
      {
        passengerId: "p_001",
        nationality: "India",
        destination: "United States",
      },
      {
        passengerId: "p_002",
        nationality: "United States",
        destination: "Japan",
      },
      {
        passengerId: "p_003",
        nationality: "Australia",
        destination: "Indonesia",
      },
      {
        passengerId: "p_004",
        nationality: "United Kingdom",
        destination: "Thailand",
      },
      {
        passengerId: "p_005",
        nationality: "Germany",
        destination: "United States",
      },
      {
        passengerId: "p_006",
        nationality: "Singapore",
        destination: "Vietnam",
      },
      { passengerId: "p_007", nationality: "France", destination: "Japan" },
      { passengerId: "p_008", nationality: "Canada", destination: "Mexico" },
      { passengerId: "p_009", nationality: "India", destination: "Thailand" },
      { passengerId: "p_010", nationality: "Italy", destination: "Australia" },
    ];

    const batchRes = await fetch(`${BASE_URL}/api/v1/batch-checklist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({ items: batchManifest }),
    });
    const batchData = await batchRes.json();

    console.log(
      `✅ Batch Execution Completed in ${batchData.batchLatencyMs}ms!`,
    );
    console.log(
      `   Passed: ${batchData.successCount}/${batchData.totalCount} passengers processed concurrently.\n`,
    );

    // STEP 5: Cache Memory Inspection
    console.log("📌 [STEP 5] Inspecting LRU Memory Cache Performance...");
    const statsRes = await fetch(`${BASE_URL}/api/v1/cache/stats`);
    const statsData = await statsRes.json();
    console.log(
      `📊 Cache Hit Ratio: ${statsData.hitRatioPercent}% (${statsData.hits} Hits / ${statsData.misses} Misses)`,
    );
    console.log(`🔑 Active Cached Keys: ${statsData.totalKeys}`);
    console.log(
      `💾 Memory Allocated: ${(statsData.memoryUsageBytes / 1024).toFixed(2)} KB\n`,
    );

    console.log(
      "================================================================",
    );
    console.log("🎉 GlobalVisa Sync Test Script Executed Successfully!");
    console.log(
      "================================================================",
    );
  } catch (error) {
    console.error("❌ Automation script encountered an error:", error.message);
  }
}

runTravelAgencyAutomationScript();
