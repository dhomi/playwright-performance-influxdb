// app vars
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
const { Given, Then, } = createBdd();
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { WriteFailure } from './writeFailure';

// app vars
const shadowRoot = 'alexia-app .container'
let baseURL: string
const perfAppName = 'performance-meting-app'
let omgeving: string
let __env: string
let __isInflux: boolean
let timeout: number

// influxdb
const url = process.env.CI ? 'https://yourserver.org' : 'http://localhost:8086'
const token = process.env.CI ? 'your-key' : 'cVFLEIJIfXSX8sBkQkCLcFFYaAnixihlctuIUVs22ewRqlz09hPUBMMpaiVsHBHDE8ExMNaDsBQNELSxpDeEXg=='
const client = new InfluxDB({ url, token })
let org = `dso-beheer`
let bucket = `tm_perf_meting`
let writeClient = client.getWriteApi(org, bucket, 'ns')

/** MEETPUNTEN
	'landing-page-start',
	'landing-page-end',
	'verguningcheck-click',
	'zoek-locatie-end',
	'kies-werkzaamheden-first',
	'kies-werkzaamheden',
	'extra-werkzaamheden'
	werkzaamheden-overzicht
	'werkzaamheden-end',
	'vragen-beantwoorden-end',
	'resultaten-page-end',
**/
// Meetpunten toewijzen
let meetpunten_totaal = undefined
let landing_page = undefined
let verguningcheck_click = undefined
let zoek_locatie = undefined
let kies_werkzaamheden = undefined
let werkzaamheden = undefined
let extra_werkzaamheden = undefined
let werkzaamheden_overzicht = undefined
let werkzaamheden_end = undefined
let vragen_beantwoorden = undefined
let resultaten_page = undefined

// api endpoint responses
const locatieAPI = '**/sessie/api/sessies/LOCATIE'
const permitcheckQuestionsAPI = '**/permit_check_questions'
const conclusionsAPI = '**/conclusion'
const explanationsAPI = '**/explanations'

Given('ik de {string} kies met initiele gegevens met {string}', async ({ page }, env, isInflux: string) => {
	__env = env
	if (__env == 'prod') {
		omgeving = ''
	} else { omgeving = `${__env}.` }
	baseURL = `https://${omgeving}omgevingswet.overheid.nl`
	isInflux.toLowerCase() == 'ja' ? __isInflux = true : __isInflux = false
})

Then('dat ik de performance meting doe op {string}', async ({ page }, env) => {
	try {
		performance.mark('landing-page-start')
		await page.goto(baseURL)

		expect(page.url()).toContain(baseURL)

		let isModal = await page.isVisible('#modal-popup-container')
		if (isModal) {
			let popupButton = page.locator('#modal-popup-container > div > div.dso-footer > #button-0')
			if (popupButton) {
				await popupButton.click()
			}
		}
		performance.mark('landing-page-end')
		performance.measure('landing-page', 'landing-page-start', 'landing-page-end')
	} catch (error) {
		__isInflux && WriteFailure(__env, 'landing-page')
		console.log(error)
	}
})

Given('kies ik voor de vergunningcheck', async ({ page }, env) => {
	try {
		// *** Vergunningcheck ***
		expect(page.url()).toContain(baseURL)
		await page.click(`text="Vergunningcheck"`)
		await page.getByRole('button', { name: 'Doe de Vergunningcheck' }).first().click()

		expect(page.url()).toContain('/checken')

		page.getByRole('heading', { name: 'Vergunningcheck' })
		performance.mark('verguningcheck-click')
		performance.measure('verguningcheck-click', 'landing-page-end', 'verguningcheck-click')
	} catch (error) {
		__isInflux && WriteFailure(__env, 'verguningcheck-click')
		console.log(error)
	}
})

Then('zoek de locatie met {string} door {int}', async ({ page }, adresTekst: string, env) => {
	try {

		expect(page.url()).toContain('/checken/nieuw/stap/1')
		// *** Zoek op Address lookup ***
		await page.getByRole('tab', { name: 'Zoek op adres' }).click()
		await page.locator('#search-box').fill(adresTekst)
		await page.getByLabel(adresTekst).click()
		await page.locator('.ol-map-popup-content-wrapper')
		await page.getByRole('button', { name: 'Zoeken' }).click()

		await page.waitForResponse(locatieAPI)

		await page.locator(`${shadowRoot} .btn.dso-primary`).hover()
		await page.getByRole('button', { name: 'Volgende stap' }).click()

		performance.mark('zoek-locatie-end')
		performance.measure('zoek-locatie', 'verguningcheck-click', 'zoek-locatie-end')
	} catch (error) {
		__isInflux && WriteFailure(__env, 'zoek-locatie')
		console.log(error)
	}
})

Given('gebruik ik werkzamheid met {int}', async ({ page }, _timeout: number, env) => {
	// eerste werkzaamheid kiezen
	try {
		timeout = _timeout
		page.getByRole('heading', { name: 'Vergunningcheck' })
		page.locator('h2#step-indicator').filter({ hasText: "2. Kies werkzaamheden" })
		await page.waitForSelector('.dso-list-button', { timeout: _timeout })

		await page.locator('#dso-list-button-checkbox').first().click()
		page.locator('#toggle-show-items-button').filter({ hasText: "U heeft 1 werkzaamheid gekozen" })
		await page.getByTestId('next-button-bottom').click()

		performance.mark('kies-werkzaamheden-first')
		performance.measure('kies-werkzaamheden-first', 'zoek-locatie-end', 'kies-werkzaamheden-first')
	} catch (error) {
		__isInflux && WriteFailure(__en, 'kies-werkzaamheden-first')
		console.log(error)
	}

	// extra werkz.
	try {
		await page.getByRole('heading', { name: '2. Kies werkzaamheden - extra werkzaamheden' })
		await page.getByRole('button', { name: 'U heeft 1 werkzaamheid gekozen' })
		// await page.getByTestId('next-button-bottom').click()

		performance.mark('kies-werkzaamheden')
		performance.measure('werkzaamheden', 'kies-werkzaamheden-first', 'kies-werkzaamheden')
	} catch (error) {
		__isInflux && WriteFailure(__env, 'werkzaamheden')
		console.log(error)
	}

	// werkz. overzicht
	try {
		await page.getByRole('heading', { name: '2. Kies werkzaamheden - overzicht' })
		await page.locator('#delete-all-button')

		performance.mark('extra-werkzaamheden')
		performance.measure('extra-werkzaamheden', 'kies-werkzaamheden', 'extra-werkzaamheden')
		await page.getByTestId('next-button-bottom').click()
	} catch (error) {
		__isInflux && WriteFailure(__env, 'extra-werkzaamheden')
		console.log(error)
	}

	// samenvatting werkz.
	try {
		page.getByRole('heading', { name: '2. Kies werkzaamheden - overzicht' })
		await page.locator('#delete-all-button')

		performance.mark('werkzaamheden-overzicht')
		performance.measure('werkzaamheden-overzicht', 'extra-werkzaamheden', 'werkzaamheden-overzicht')

		// await page.locator(`${shadowRoot} .btn.dso-primary`).click()
		await page.getByTestId('next-button-bottom').click()

		await page.waitForResponse(permitcheckQuestionsAPI)

	} catch (error) {
		__isInflux && WriteFailure(__env, 'werkzaamheden-overzicht')
		console.log(error)
	}

	// next => finish werkz.
	try {
		performance.mark('werkzaamheden-end')
		performance.measure('werkzaamheden-end', 'werkzaamheden-overzicht', 'werkzaamheden-end')
	} catch (error) {
		__isInflux && WriteFailure(__env, 'werkzaamheden-end')
		console.log(error)
	}
})

Given('beantwoord ik de vragen', async ({ page }, env) => {
	// vragen beantwoorden
	try {
		await expect(page.locator(`${shadowRoot} h2#step-indicator`)).toContainText('Vragen beantwoorden')
		await page.waitForTimeout(timeout)

		let zijnErVragen = (page.locator(`${shadowRoot}`).locator("fieldset .sc-dso-selectable"))
		if (zijnErVragen) {
			await page.locator(`${shadowRoot}`).locator("fieldset[class='dso-radios'] .sc-dso-selectable input[value$='true']").first().click()
			if (omgeving !== 'acc') { await page.waitForResponse(permitcheckQuestionsAPI) }
			await page.getByTestId('next-button-bottom').click()
		}

		performance.mark('vragen-beantwoorden-end')
		performance.measure('vragen-beantwoorden', 'werkzaamheden-end', 'vragen-beantwoorden-end')
	} catch (error) {
		__isInflux && WriteFailure(__env, 'vragen-beantwoorden')
		console.log(error)
	}
})

Then('ik zie de resultaten pagina', async ({ page }, env) => {
	// resultaat
	try {
		await expect(page.locator('h2#step-indicator')).toContainText('4. Resultaat')

		performance.mark('resultaten-page-end')
		performance.measure('resultaten-page', 'vragen-beantwoorden-end', 'resultaten-page-end')
	} catch (error) {
		__isInflux && WriteFailure(__env, 'resultaten-page')
		console.log(error)
	}
})

Then('ik schrijf de performance meting uit naar {string} op {string}', async ({ }, isInflux: string, env) => {
	try {
		performance.measure('meetpunten_totaal', 'landing-page-start', 'resultaten-page-end')

		// Meetpunten toewijzen
		meetpunten_totaal = Number(performance.getEntriesByName('meetpunten_totaal')[0].duration.toFixed(3))
		landing_page = Number(performance.getEntriesByName('landing-page')[0].duration.toFixed(3))
		verguningcheck_click = Number(performance.getEntriesByName('verguningcheck-click')[0].duration.toFixed(3))
		zoek_locatie = Number(performance.getEntriesByName('zoek-locatie')[0].duration.toFixed(3))
		kies_werkzaamheden = Number(performance.getEntriesByName('kies-werkzaamheden')[0].duration.toFixed(3))
		werkzaamheden = Number(performance.getEntriesByName('werkzaamheden')[0].duration.toFixed(3))
		extra_werkzaamheden = Number(performance.getEntriesByName('extra-werkzaamheden')[0].duration.toFixed(3))
		werkzaamheden_overzicht = Number(performance.getEntriesByName('werkzaamheden-overzicht')[0].duration.toFixed(3))
		werkzaamheden_end = Number(performance.getEntriesByName('werkzaamheden-end')[0].duration.toFixed(3))
		vragen_beantwoorden = Number(performance.getEntriesByName('vragen-beantwoorden')[0].duration.toFixed(3))
		resultaten_page = Number(performance.getEntriesByName('resultaten-page')[0].duration.toFixed(3))

		console.log(`metpunten_totaal op ${__env}`, meetpunten_totaal)

		// influx DB
		if (isInflux.toLowerCase() == 'ja') {
			let point = new Point(`${__env}_perf_meting`)
				.tag('vergunningcheck', env)
				.floatField('meetpunt_meetpunten_totaal', meetpunten_totaal)
				.floatField('meetpunt_landing_page', landing_page)
				.floatField('meetpunt_verguningcheck_click', verguningcheck_click)
				.floatField('meetpunt_zoek_locatie', zoek_locatie)
				.floatField('meetpunt_kies_werkzaamheden', kies_werkzaamheden)
				.floatField('meetpunt_werkzaamheden', werkzaamheden)
				.floatField('meetpunt_extra_werkzaamheden', extra_werkzaamheden)
				.floatField('meetpunt_werkzaamheden_overzicht', werkzaamheden_overzicht)
				.floatField('meetpunt_werkzaamheden_end', werkzaamheden_end)
				.floatField('meetpunt_vragen_beantwoorden', vragen_beantwoorden)
				.floatField('meetpunt_resultaten_page', resultaten_page)
			console.log('point', point)
			writeClient.writePoint(point)
			writeClient.flush()
		}

		// reset stuff
		// performance.clearResourceTimings()
		// performance.clearMarks()
		// performance.clearMeasures()
	} catch (error) {
		__isInflux && WriteFailure(__env, 'meetpunten_totaal')
		console.log(error)
	}
})
