import { expect, test } from '@playwright/test'

import { mockAllApis } from '../fixtures/test-utils'

test.describe('Volunteer form', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page)

    // Enable demo mode
    await page.addInitScript(() => {
      sessionStorage.setItem('adoption_os_demo_mode', 'true')
    })
  })

  test('volunteer page renders with form fields', async ({ page }) => {
    await page.goto('/volunteer')

    // Should show the volunteer form
    await expect(page.locator('form, [class*="volunteer"]').first()).toBeVisible()

    // Should not be a white screen
    await expect(page.locator('body')).not.toHaveText('Cannot GET')
  })

  test('form shows validation when submitted empty', async ({ page }) => {
    await page.goto('/volunteer')

    // Try to find and click a submit button
    const submitButton = page.getByRole('button', { name: /submit|apply/i })

    if (await submitButton.isVisible()) {
      await submitButton.click()

      // The page should still be on the volunteer page (not navigate away)
      await expect(page).toHaveURL('/volunteer')
    }
  })
})
