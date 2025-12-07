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
        # -> Click each quick access link one by one to verify navigation.
        frame = context.pages[-1]
        # Click 홈 대시보드 (Home Dashboard) quick access link to verify navigation.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the next quick access link 'Sales Lab' to verify navigation.
        frame = context.pages[-1]
        # Click Sales Lab quick access link to verify navigation.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the next quick access link 'AI 튜터' to verify navigation.
        frame = context.pages[-1]
        # Click AI 튜터 quick access link to verify navigation.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the next quick access link '공부방' to verify navigation.
        frame = context.pages[-1]
        # Click 공부방 quick access link to verify navigation.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the last quick access link '마이' to verify navigation.
        frame = context.pages[-1]
        # Click 마이 quick access link to verify navigation.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Verify Admin Console link navigation and check for any crashes.
        frame = context.pages[-1]
        # Click Admin Console link to verify navigation and check for crashes.
        elem = frame.locator('xpath=html/body/div/div/aside/div[2]/button/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Verify navigation links within Admin Console: Dashboard, Product Catalog, Customer Engine, Sales Lab Rules, Gamification, Content (CMS), Analytics, and Settings.
        frame = context.pages[-1]
        # Click Dashboard link in Admin Console to verify navigation.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Product Catalog' tab in Admin Console to verify navigation and content.
        frame = context.pages[-1]
        # Click Product Catalog tab in Admin Console to verify navigation and content.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Customer Engine' tab in Admin Console to verify navigation and content.
        frame = context.pages[-1]
        # Click Customer Engine tab in Admin Console to verify navigation and content.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Sales Lab Rules' tab in Admin Console to verify navigation and content.
        frame = context.pages[-1]
        # Click Sales Lab Rules tab in Admin Console to verify navigation and content.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a[4]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Gamification' tab in Admin Console to verify navigation and content.
        frame = context.pages[-1]
        # Click Gamification tab in Admin Console to verify navigation and content.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a[5]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Content (CMS)' tab in Admin Console to verify navigation and content.
        frame = context.pages[-1]
        # Click Content (CMS) tab in Admin Console to verify navigation and content.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a[6]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Analytics' tab in Admin Console to verify navigation and content.
        frame = context.pages[-1]
        # Click Analytics tab in Admin Console to verify navigation and content.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a[7]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Settings' tab in Admin Console to verify navigation and content.
        frame = context.pages[-1]
        # Click Settings tab in Admin Console to verify navigation and content.
        elem = frame.locator('xpath=html/body/div/div/aside/nav/a[8]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Dashboard').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Product Catalog').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Customer Engine').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Sales Lab Rules').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Gamification').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Content (CMS)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Analytics').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Settings').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Exit Console').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=AI Configuration').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Integrations & Channels').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=General System').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Configure global settings for the platform.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Save Changes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Gemini API Key').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Check Quota').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Recommended: Use a secured API key with restricted scope.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Gemini 2.0 Flash').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Fast, cost-effective. Best for quick roleplay interactions.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Gemini 2.0 Pro').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=High reasoning capability. Best for complex feedback analysis.').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    