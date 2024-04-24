// app vars
import { expect } from '@playwright/test';
import { link } from 'fs';
import { createBdd } from 'playwright-bdd';
const { Given, Then, When } = createBdd();

// app vars
let baseURL: string
let omgeving: string
let __env: string

Given('dat een visuele test wil doen op de landingpagina van {string}', async ({ page }, env) => {
	__env = env
	if (__env == 'prod') {
		omgeving = ''
	} else { omgeving = `${__env}.` }
	baseURL = `https://${omgeving}omgevingswet.overheid.nl`
	await page.goto(baseURL)
})

Then('klik ik de popup weg', async ({ page }) => {
	try {
		let isModal = await page.isVisible('#modal-popup-container')
		if (isModal) {
			let popupButton = await page.locator('#modal-popup-container > div > div.dso-footer > #button-0')
			if (popupButton) {
				await popupButton.click()
			}
		}
		await expect(page).toHaveScreenshot(`${__env}_landing.png`)
	} catch (error) {
		console.log(error)
	}
})

When('ik op de link {string} klik', async ({ page }, linkText: string) => {
	await page.getByRole('link', { name: linkText }).click()
	await expect(page).toHaveScreenshot(`${__env}_${linkText}.png`)
})

Then('zie ik {string} en {string}', async ({ page }, expectedTitle, expectedHeading) => {
	await page.getByRole('heading', { name: expectedTitle }).click()
	await page.getByRole('heading', { name: expectedHeading }).click()
})
