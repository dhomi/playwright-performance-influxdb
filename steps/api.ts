import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test';
const { Given, When, Then } = createBdd()

let apiURL: string = 'https://reqres.in/api'
let response: any = {}
let body: any = {}

// reqres api
Given(`ik {string} ophaal`, async ({ request }, endpoint: string) => {
	response = await request.get(`${apiURL}${endpoint}`)
	body = await response.json()
})

Given(`de reactie was succesvol`, async () => {
	expect(response.ok()).toBeTruthy()
})

Then(`is de antwoordstatuscode {string}`, ({ request }, statusCode: any) => {
	expect(response.status()).toBe(Number(statusCode))
})

Then(`de body bevat {string} en {string}`, async ({ request }, id: any, last_name: string) => {
	expect(body.data.id).toBe(Number(id));
	expect(body.data.last_name).toBe(last_name);
})
