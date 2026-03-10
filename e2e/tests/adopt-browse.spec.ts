import { expect, test } from '@playwright/test'

import { mockAllApis } from '../fixtures/test-utils'

test.describe('Adopt page — browsing and filtering', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page)
    await page.goto('/adopt')
    // Wait for pet cards to render
    await expect(page.locator('.pet-item').first()).toBeVisible()
  })

  test('displays all pets by default', async ({ page }) => {
    // Fixture has 6 pets total
    const petCards = page.locator('.pet-item')
    await expect(petCards).toHaveCount(6)
  })

  test('filters by cats', async ({ page }) => {
    await page.getByRole('button', { name: 'Cats' }).click()
    // Fixture has 3 cats: Luna, Whiskers, Oliver
    const petCards = page.locator('.pet-item')
    await expect(petCards).toHaveCount(3)
  })

  test('filters by dogs', async ({ page }) => {
    await page.getByRole('button', { name: 'Dogs' }).click()
    // Fixture has 3 dogs: Buddy, Daisy, Max
    const petCards = page.locator('.pet-item')
    await expect(petCards).toHaveCount(3)
  })

  test('View All Pets resets filter', async ({ page }) => {
    await page.getByRole('button', { name: 'Cats' }).click()
    await expect(page.locator('.pet-item')).toHaveCount(3)

    await page.getByRole('button', { name: 'View All Pets' }).click()
    await expect(page.locator('.pet-item')).toHaveCount(6)
  })

  test('clicking a pet navigates to detail view', async ({ page }) => {
    // Click the image/fallback inside the first pet item
    await page.locator('.pet-item .img-wrapper').first().click()
    await expect(page).toHaveURL(/\/adopt\//)
  })
})
