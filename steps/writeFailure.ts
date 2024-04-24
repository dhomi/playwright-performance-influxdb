import { InfluxDB, Point } from '@influxdata/influxdb-client';

// influxdb
const url = process.env.CI ? 'https://yourservername.org' : 'http://localhost:8086'
const token = process.env.CI ? 'yourserver-key' : 'cVFLEIJIfXSX8sBkQkCLcFFYaAnixihlctuIUVs22ewRqlz09hPUBMMpaiVsHBHDE8ExMNaDsBQNELSxpDeEXg=='
const client = new InfluxDB({ url, token })
let org = `dso-beheer`
let bucket = `tm_perf_meting`
let writeClient = client.getWriteApi(org, bucket, 'ns')

export const WriteFailure = (__env: string, __event: string) => {
	console.log('writeFailure')
	
	// influx DB vullen met waardeRood als teken dat de test is mislukt
	const waardeRood = 60000.123
	const meetpunten_totaal = Number(waardeRood)
	console.log(`failure on ${__env}`, meetpunten_totaal, ` event`, __event)

	let point = new Point(`${__env}_perf_meting`)
		.tag('vergunningcheck', __env)
		.floatField('meetpunt_meetpunten_totaal', waardeRood)
	// .floatField('meetpunt_landing_page', waardeRood)
	// .floatField('meetpunt_verguningcheck_click', waardeRood)
	// .floatField('meetpunt_zoek_locatie', waardeRood)
	// .floatField('meetpunt_kies_werkzaamheden', waardeRood)
	// .floatField('meetpunt_werkzaamheden', waardeRood)
	// .floatField('meetpunt_werkzaamheden_popup', waardeRood)
	// .floatField('meetpunt_extra_werkzaamheden', waardeRood)
	// .floatField('meetpunt_werkzaamheden_overzicht', waardeRood)
	// .floatField('meetpunt_werkzaamheden_end', waardeRood)
	// .floatField('meetpunt_vragen_beantwoorden', waardeRood)
	// .floatField('meetpunt_resultaten_page', waardeRood)
	console.log('point', point)
	writeClient.writePoint(point)
	writeClient.flush()

	// reset stuff
	performance.clearResourceTimings()
	performance.clearMarks()
	performance.clearMeasures()
}