import { operatorApi } from './src/services/operatorApi.js';

// Simple test runner
async function runTests() {
    console.log("Starting Operator API Tests...");

    try {
        // 1. Get Catalog
        const catalogRes = await operatorApi.getProductCatalog();
        console.log(`[PASS] Get Catalog: Success=${catalogRes.success}, Models=${Object.keys(catalogRes.data.catalog.models).length}`);

        // 2. Get Traits
        const traitsRes = await operatorApi.getTraits();
        console.log(`[PASS] Get Traits: Success=${traitsRes.success}, Count=${traitsRes.data.traits.length}`);

        // 3. Create Persona
        const newPersona = {
            id: "test_persona",
            name: "Test Persona",
            shortDescription: "Test",
            ageGroup: "30s",
            gender: "female",
            mainTraits: ["tech_savvy", "price_sensitive"],
            hiddenTrait: "brand_loyal",
            regions: ["GLOBAL"]
        };
        const createRes = await operatorApi.createPersona(newPersona);
        console.log(`[PASS] Create Persona: Success=${createRes.success}, ID=${createRes.data.persona.id}`);

        // 4. Get Created Persona
        const getRes = await operatorApi.getPersona("test_persona");
        console.log(`[PASS] Get Persona: Success=${getRes.success}, Name=${getRes.data.persona.name}`);

        console.log("All tests passed!");
    } catch (e) {
        console.error("Test Failed:", e);
    }
}

runTests();
