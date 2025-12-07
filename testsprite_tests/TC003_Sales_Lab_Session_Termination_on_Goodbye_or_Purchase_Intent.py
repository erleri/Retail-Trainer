import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5173", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Click on Sales Lab section to start a Sales Lab roleplay session
        frame = context.pages[-1]
        # Click on Sales Lab section to start a Sales Lab roleplay session
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[4]/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click Start Simulation button to start the Sales Lab roleplay session
        frame = context.pages[-1]
        # Click Start Simulation button to start the Sales Lab roleplay session
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Reload the Sales Lab page and try to start the Sales Lab session again
        await page.goto('http://localhost:5173/sales-lab', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Click Start Simulation button to start the Sales Lab roleplay session
        frame = context.pages[-1]
        # Click Start Simulation button to start the Sales Lab roleplay session
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Try to reload the page or restart the Sales Lab session to recover from the error before proceeding with the test.
        await page.goto('http://localhost:5173/sales-lab', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Click Start Simulation button to start the Sales Lab roleplay session
        frame = context.pages[-1]
        # Click Start Simulation button to start the Sales Lab roleplay session
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Try to reload the page or restart the Sales Lab session to recover from the error before proceeding with the test.
        await page.goto('http://localhost:5173/sales-lab', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Click Start Simulation button to start the Sales Lab roleplay session
        frame = context.pages[-1]
        # Click Start Simulation button to start the Sales Lab roleplay session
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        try:
            await expect(frame.locator('text=Session Ended Successfully').first).to_be_visible(timeout=1000)
        except AssertionError:
            raise AssertionError("Test case failed: The Sales Lab session did not end naturally when the user said goodbye or indicated purchase intent, and feedback was not triggered as expected.")
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    