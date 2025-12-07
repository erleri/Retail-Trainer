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
        # -> Click on the Sales Lab navigation link to go to the Sales Lab page
        frame = context.pages[-1]
        # Click on Sales Lab navigation link
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Complete Setup step by selecting product options and customer profile traits, then start simulation
        frame = context.pages[-1]
        # Select product size 55"
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[2]/div/div/div[2]/div/div/div[4]/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Select product LG OLED evo G5
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[2]/div/div/div[2]/div/div/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Select difficulty level Lv.1
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[2]/div[2]/div/div[2]/div/div/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Select gender Male
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[2]/div[2]/div/div[2]/div/div/div[3]/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Select trait Price-sensitive
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[2]/div[2]/div/div[2]/div/div/div[4]/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Select trait Quick-decider
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[2]/div[2]/div/div[2]/div/div/div[4]/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click Start Simulation button to begin roleplay chat
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click Start Simulation button to load Roleplay Chat interface
        frame = context.pages[-1]
        # Click Start Simulation button to begin Roleplay Chat
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Attempt to send a simple user input message to check if AI customer responds or if error persists
        frame = context.pages[-1]
        # Input a simple greeting message to test AI customer response
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[3]/div/div[2]/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Hello, I am ready to start the conversation.')
        

        frame = context.pages[-1]
        # Click send button to submit the message
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div/div/div[3]/div/div[2]/div/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        try:
            await expect(frame.locator('text=Sales Lab flow completed successfully').first).to_be_visible(timeout=1000)
        except AssertionError:
            raise AssertionError('Test case failed: The Sales Lab flow execution has failed. The Roleplay Chat interface did not load or AI customer did not respond as expected, preventing successful completion of the flow.')
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    