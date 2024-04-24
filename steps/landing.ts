import { createBdd } from 'playwright-bdd'
const { Given, When, Then } = createBdd()

Given('dat ik op de Omgevingswet landing pagina ben', async ({ page }) => {
	await page.goto("/")
})

Then('zie ik de popup {string} en {string}', async ({ page }) => {
try {
		let isModal = await page.isVisible('#modal-popup-container')
		if (isModal) {
			let popupButton = await page.locator('#modal-popup-container > div > div.dso-footer > #button-0')
			if (popupButton) {
				await popupButton.click()
			}
		}
	} catch (error) {
		console.log(error)
	}
})

When('ik klik op de link {string}', async ({ page }, linkText: string) => {
	await page.getByRole('link', { name: linkText }).click()
})

Then('zie ik het titel {string}', async ({ page }, expectedTitle) => {
	await page.getByRole('heading', { name: expectedTitle }).click()
})

Then('zie ik de heading {string}', async ({ page }, expectedHeading) => {
	await page.getByRole('heading', { name: expectedHeading }).click()
})
