# BDD DSO [e2e,smoke,test,api,visual]
## Inhoud
- Installatie
- Test uitvoeren
- Ontwikkeling
  - WIP: Work in progress
- Pipeline
- Testtypes
  - BDD
  - Api test
  - Landingpage
  - Visual pixel perfect
  - Performance meting
    - Grafana Dashboarding & InfluxDB
- Docker test runs
- Todo

# Installatie
Ten eerste deze repository verkrijgen door het 
- zip bestand te downloaden 
- of door het Pull-en met git, installeer dus Git eerst: https://git-scm.com/downloads
   - Lees verder ```Optie 2. Lokaal installeren```

## Optie 1. Docker 
- Installeer Docker: https://docs.docker.com/desktop/

### Docker container bouwen
Het is mogelijk om een docker container te builden dmv. de ```Dockerfile``` en daarin de tests te kopieeren en runnen

- Bouwen van de Container: ```docker build -t playwright-docker .```
- Test uitvoeren in deze container: ```docker run -it playwright-docker:latest npm run api```

## Optie 2. Lokaal installeren
- NodeJS: https://nodejs.org/en/download 
 ```
   git clone https://gitlab.cicd.s15m.nl/rws/dso/projecten/tm.git
   cd tm
   npm install
   npx playwright install
```

# Test uitvoeren
Er zijn twee manieren van het runnen van de tests:

## Optie 1. Ze in Docker te runnen. 
Dan heb je geen lokale NodeJS en Playwright nodig. 
- Test uitvoeren in deze container: ```docker run -it playwright-docker:latest npm run api```

#### Optie 2
In een lokale installatie waar NodeJS en Playwright geinstaleerd zijn
- Api test uitvoeren ```npm run api```
- WorkInProgress (tag: wip) tests uitvoeren ```npm run test:wip```
- Vergunningcheck uitvoeren. Deze functie zit in de performance meting test ```npm run performance```
- Inloggen en aanvraag indienen / Algemene Set test uitvoeren```npm run inloggen```

Zie verder het package.json bestand om te begrijpen welke ```scripts``` er zijn en hoe deze zijn opgebouwd

# Ontwikkeling

### Settings van Playwright aanpassen
zie het bestand: ```playwright.config.ts```

### DSO test Tags
Belangrijke tags zijn de capabilities zoals genoemd in: https://jira.team-dso.nl/confluence/pages/viewpage.action?spaceKey=TEST&title=Capabilities

### Wip: Work in progress
De tests met het tag: ```@wip``` kan je runnen door commando (in package.json is dat een script): ```npm run wip``` 

# Pipeline
de .gitlab-ci.yml is onze pipeline yaml script. Daarin zijn twee jobs aangemaakt:
- ```performance:on-schedule``` runt als de scheduler deze aftrapt
- ```playwright``` runt normaal met elke andere run bv. commit, merge ezv.

# Testtypes

### BDD
- ```./features/``` map: Scenarios zijn in de 'features' map in het Nederlands
- ```./steps/``` map: Stappen in typescript & playwright

Als je en feature file maakt en deze uitvoert zonder de benodigde steps, dan faalt ie maar er is ook goed nieuws:
playwright geeft je de inhoud van de benodigde steps bestand in de log ;)

### API
de ```./features/api.feature``` is een voorbeeld voor een API endpoint testje

### Landingpages
de ```./features/landing.feature``` ...zoals de naam al doet vermoeden ;)

### Visual pixel perfect
Playwright eigen snapshot visual test gebruikt hiervoor
Steps file ```./steps/snapshots.ts```

- ```./snapshots``` map: bevat de localhost en gitlab snapshots
- Configuratie zit in de ```./steps/fixtures.ts``` file. Voorbeeld: ```testInfo.snapshotSuffix = ''```

**Let wel op**: snapshots op server (via pipieline) en lokaal gedraaide tests hebben meestal een andere resulutie hebben.

Het genereren van de **golden snapshot** voor de **Gitlab Pipeline**:
- Dmv. de docker kan je de npm run api vervangen met ```npm run update-snapshots```
- Gemaakte snapshots in de docker container kopieer je dan naar de betreffende snapshots map hier in de repository
- Push nu de nieuwe bestanden naar de reposotiry

## Performance meting
Wordt via de ```npm run performance``` uitgevoerd. De feature file bevat voor het gemak ook Bewaar in influx kolom die je met nee kan vullen om lokaal te draaien als test. 
**Tip**: Mocht je geen influx willen gebruiken (bv. voor lokale test) zet dan de **bewaarInflux** op nee

#### Grafana Dashboarding & InfluxDB
Op de pipeline draait deze meting via de Scheduler Run elke 1,5 uur. De metingen worden opgeslagen in de Influx database en zijn te zien in de 

Grafana url: https://grafana.rws-dso-tst-man.test8.s15m.nl/d/QUnJDOFSk/tm-performance-meting?orgId=1&from=now-2d&to=now

# TODO
Credentials opslaan in de gitlab vault ipv. repository