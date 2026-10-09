import { test, expect } from "@playwright/test";

for (const viewport of [{ name: 'desktop', width: 1280, height: 720 }, { name: 'mobile', width: 390, height: 844 }]) {
  test.describe(`Examples ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: 'reduce' });

    test('Carousel playground playback and frame inspection', async ({ page }) => {
      await page.goto('/iframe.html?id=examples-text-carousel-playground--playground&viewMode=story');
      await page.waitForLoadState('networkidle');
      const preview = page.getByRole('region', { name: 'Carousel preview' });
      await expect(preview).toBeVisible({ timeout: 20000 });
      await page.clock.install();
      await page.getByRole('button', { name: 'Pause playback' }).click();
      const frozen = await preview.innerText();
      await page.clock.fastForward(10000);
      await expect.poll(() => preview.innerText()).toBe(frozen);
      await page.getByRole('button', { name: 'Resume playback' }).click();
      await page.clock.fastForward(1800);
      await expect.poll(() => preview.innerText()).not.toBe(frozen);
      await page.getByRole('button', { name: 'Pause playback' }).click();
      await page.getByLabel('Phrases (one per line)').fill('Design systems\nDesign tools');
      await page.getByLabel('Typing delay (ms)').fill('120');
      await page.getByLabel('Dwell interval (ms)').fill('3000');
      await page.getByRole('button', { name: 'Apply phrases and restart' }).click();
      await page.evaluate(() => document.fonts.ready);
      await expect(preview).toContainText('Design systems');
      await expect(page).toHaveScreenshot(`playground-paused-${viewport.name}.png`, { fullPage: true });
      await page.getByLabel('Preview mode').selectOption('inspect');
      await page.getByRole('button', { name: 'Next frame' }).click();
      const slider = page.getByRole('slider', { name: 'Frame' });
      await slider.fill((await slider.getAttribute('max'))!);
      await expect(page.getByLabel('Inspected frame')).toHaveText('Design tools');
      await expect(page).toHaveScreenshot(`playground-inspection-${viewport.name}.png`, { fullPage: true });
      await page.getByLabel('Phrases (one per line)').fill('');
      await page.getByRole('button', { name: 'Apply phrases and restart' }).click();
      await expect(preview).toContainText('Enter at least one phrase');
      await expect(page).toHaveScreenshot(`playground-empty-${viewport.name}.png`, { fullPage: true });
    });

    test('Showcase forms navigation and dialog', async ({ page }) => {
      await page.goto('/iframe.html?id=examples-showcase--page&viewMode=story');
      await page.waitForLoadState('networkidle');
      await page.getByRole('heading', { name: 'Studio', level: 1 }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveTitle('Studio - Design System Showcase');
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Studio projects, contact details, and delivery information.');
      await expect(page).toHaveScreenshot(`showcase-${viewport.name}.png`, { fullPage: true });
      const contact = page.getByRole('form', { name: 'contact form' });
      const address = page.getByRole('form', { name: 'address form' });
      const formScreenshot = { style: 'header, header * { visibility: hidden !important; }' };
      await contact.getByRole('button', { name: 'Send message' }).click();
      await expect(contact.locator('[aria-invalid="true"]')).toHaveCount(4);
      for (const field of await contact.locator('[aria-invalid="true"]').all()) {
        const description = await field.getAttribute('aria-describedby');
        expect(description).toBeTruthy();
        await expect(page.locator(`[id="${description}"]`)).toContainText('required');
      }
      await expect(contact.getByRole('textbox', { name: 'Full name', exact: true })).toBeFocused();
      await expect(contact).toHaveScreenshot(`showcase-contact-errors-${viewport.name}.png`, formScreenshot);
      await contact.getByRole('textbox', { name: 'Full name', exact: true }).fill('Alex Rivera');
      await contact.getByRole('textbox', { name: 'Email', exact: true }).fill('alex@example');
      await contact.getByRole('combobox', { name: 'Reason', exact: true }).selectOption('Project inquiry');
      await contact.getByText('I consent to being contacted', { exact: true }).click();
      await expect(contact.getByRole('checkbox')).toBeChecked();
      await contact.getByRole('button', { name: 'Send message' }).click();
      await expect(contact.getByRole('textbox', { name: 'Email', exact: true })).toHaveAttribute('aria-invalid', 'true');
      await expect(contact.getByRole('status')).toBeEmpty();
      await contact.getByRole('textbox', { name: 'Email', exact: true }).fill('alex@example.com');
      await contact.getByRole('button', { name: 'Send message' }).click();
      await expect(contact.getByRole('status')).toContainText('Message ready');
      await expect(contact).toHaveScreenshot(`showcase-contact-success-${viewport.name}.png`, formScreenshot);
      await address.getByRole('button', { name: 'Save address' }).click();
      await expect(address.locator('[aria-invalid="true"]')).toHaveCount(4);
      await expect(address).toHaveScreenshot(`showcase-address-errors-${viewport.name}.png`, formScreenshot);
      await address.getByRole('textbox', { name: 'Street', exact: true }).fill('100 Main Street');
      await address.getByRole('textbox', { name: 'City', exact: true }).fill('Chicago');
      await address.getByRole('textbox', { name: 'Postal code', exact: true }).fill('60601');
      await address.getByRole('combobox', { name: 'Country', exact: true }).selectOption('United States');
      await address.getByRole('button', { name: 'Save address' }).click();
      await expect(address.getByRole('status')).toContainText('Address saved');
      await expect(address).toHaveScreenshot(`showcase-address-success-${viewport.name}.png`, formScreenshot);
      await address.getByRole('button', { name: 'Reset address' }).click();
      await expect(address.getByRole('textbox', { name: 'Street', exact: true })).toHaveValue('');
      await page.getByRole('navigation', { name: 'Page sections' }).getByRole('link', { name: 'Confirmation' }).click();
      const opener = page.getByRole('button', { name: 'Open Modal Example' });
      await opener.click();
      const dialog = page.getByRole('dialog', { name: 'Project confirmation' });
      await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(dialog.getByRole('button', { name: 'Learn more' })).toBeFocused();
      await expect(page).toHaveScreenshot(`showcase-dialog-${viewport.name}.png`);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(opener).toBeFocused();
    });

    for (const story of ['roles', 'typefaces', 'comparison']) {
      test(`Fonts ${story} default and edited`, async ({ page }) => {
        await page.goto(`/iframe.html?id=examples-fonts--${story}&viewMode=story`);
        await page.getByLabel('Sample text').waitFor();
        await page.evaluate(() => document.fonts.ready);
        await expect(page).toHaveScreenshot(`fonts-${story}-${viewport.name}.png`, { fullPage: true });
        await page.getByLabel('Sample text').fill('Readable type 2026');
        await expect(page.getByText('Readable type 2026', { exact: true }).first()).toBeVisible();
        await expect(page).toHaveScreenshot(`fonts-${story}-edited-${viewport.name}.png`, { fullPage: true });
        await page.getByLabel('Sample text').fill('');
        await expect(page.getByLabel('Sample text')).toHaveValue('');
        if (story === 'comparison') await expect(page.getByText('Noah Wright — Software builder', { exact: true })).toBeVisible();
        else await expect(page.getByText('Readable type 2026', { exact: true })).toHaveCount(0);
      });
    }

    test('Header routes and shortcuts', async ({ page }) => {
      await page.goto('/iframe.html?id=examples-header-integration--routed-application-header&viewMode=story');
      await page.getByRole('heading', { name: 'Home', level: 2 }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`header-home-${viewport.name}.png`);
      await page.keyboard.press('Alt+n');
      await expect(page.getByRole('menuitem', { name: 'Home' })).toBeFocused();
      await expect(page).toHaveScreenshot(`header-nav-${viewport.name}.png`);
      await page.getByRole('menuitem', { name: 'About' }).click();
      await expect(page).toHaveURL(/#about$/);
      await expect(page.getByRole('heading', { name: 'About', level: 2 })).toBeVisible();
      await expect(page).toHaveScreenshot(`header-about-${viewport.name}.png`);
      await page.reload();
      await expect(page.getByRole('heading', { name: 'About', level: 2 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.keyboard.press('Alt+a');
      await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeFocused();
      await expect(page).toHaveScreenshot(`header-account-${viewport.name}.png`);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'Account' })).toBeFocused();
      await expect(page.getByRole('menu')).toHaveCount(0);
      await page.goto('/iframe.html?id=examples-header-integration--routed-application-header&viewMode=story#home');
      await page.keyboard.press('Alt+n');
      await page.getByRole('menuitem', { name: 'Services' }).click();
      await expect(page.getByRole('heading', { name: 'Services', level: 2 })).toBeVisible();
      await page.goBack();
      await expect(page.getByRole('heading', { name: 'Home', level: 2 })).toBeVisible();
      await page.goForward();
      await expect(page.getByRole('heading', { name: 'Services', level: 2 })).toBeVisible();
      await page.goto('/iframe.html?id=examples-header-integration--routed-application-header&viewMode=story#unknown');
      await expect(page.getByRole('heading', { name: 'Home', level: 2 })).toBeVisible();
      await page.keyboard.press('Alt+n');
      const resources = page.getByRole('menuitem', { name: 'Resources' });
      await resources.focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.getByRole('menuitem', { name: 'About the studio' })).toBeFocused();
      await expect(page).toHaveScreenshot(`header-nested-${viewport.name}.png`);
      await page.keyboard.press('ArrowLeft');
      await expect(resources).toBeFocused();
      await expect(page.getByRole('menu')).toHaveCount(1);
      await page.keyboard.press('ArrowRight');
      await page.getByRole('menuitem', { name: 'Contact the studio' }).click();
      await expect(page.getByRole('heading', { name: 'Contact', level: 2 })).toBeVisible();
      await expect(page.getByRole('menu')).toHaveCount(0);
    });

    test('Header drawer', async ({ page }) => {
      await page.goto('/iframe.html?id=examples-header-responsive--navigation-drawer&viewMode=story');
      const trigger = page.getByRole('button', { name: 'Open navigation drawer' });
      await trigger.click();
      const drawer = page.getByRole('dialog', { name: 'Navigation drawer' });
      await expect(drawer).toBeVisible();
      await page.keyboard.press('Shift+Tab');
      await expect(drawer.getByRole('button', { name: 'Contact', exact: true })).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(drawer.getByRole('button', { name: 'Close navigation drawer' })).toBeFocused();
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`header-drawer-${viewport.name}.png`);
      await drawer.getByRole('button', { name: 'Contact', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Contact', level: 1 })).toBeVisible();
      await expect(trigger).toBeFocused();
      await trigger.click();
      await expect(drawer).toBeVisible();
      await drawer.getByRole('button', { name: 'Close navigation drawer' }).click();
      await expect(drawer).not.toBeVisible();
      await trigger.click();
      await expect(drawer).toBeVisible();
      await page.mouse.click(viewport.width - 10, viewport.height - 10);
      await expect(drawer).not.toBeVisible();
      await expect(page).toHaveScreenshot(`header-drawer-contact-${viewport.name}.png`);
      await trigger.click();
      await expect(drawer).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(drawer).not.toBeVisible();
      await expect(trigger).toBeFocused();
    });
  });
}

test.describe("Example Pages", () => {
  test('Menu exit is inert and reopening cancels removal', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/iframe.html?id=examples-header-integration--routed-application-header&viewMode=story');
    const trigger = page.getByRole('button', { name: 'Account' });
    await trigger.click();
    await page.clock.install();
    await trigger.click();
    const exiting = page.locator('.nw-menu__panel--closing');
    await expect(exiting).toHaveAttribute('inert', '');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await trigger.click();
    await page.clock.fastForward(200);
    await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible();
    await trigger.click();
    await page.clock.fastForward(200);
    await expect(page.locator('.nw-menu__panel')).toHaveCount(0);
  });
  test("Colors page snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=examples-colors--color-grid&viewMode=story");
    await page.waitForLoadState("networkidle");
    
    // Wait for colors to be computed and rendered
    await page.locator('h1:has-text("Theme colors")').waitFor({ state: "visible" });
    
    await expect(page).toHaveScreenshot("example-colors.png", {
      fullPage: true
    });
  });

  test("Header integration - standard app snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=examples-header-integration--standard-app-header&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("example-header-standard.png", {
      fullPage: true
    });
  });

  test("Header integration - minimal portfolio snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=examples-header-integration--minimal-portfolio&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("example-header-portfolio.png");
  });

  test("Showcase page snapshot", async ({ page }) => {
    await page.goto("/iframe.html?id=examples-showcase--page&viewMode=story");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("example-showcase.png", {
      fullPage: true
    });
  });
});
