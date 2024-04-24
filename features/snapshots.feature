			# language: nl
			Functionaliteit: Visual snapshot testing

			@visualtest @snapshots
			@BC1.5-A.01 @BC1.5-A.02 @BC1.5-A.03 @BC1.5-A.04
			Abstract Scenario: Visual snapshot testing @BC1.5-A.01 @BC1.5-A.02 @BC1.5-A.03 @BC1.5-A.04
			Stel dat een visuele test wil doen op de landingpagina van 'perf'
			Dan klik ik de popup weg
			Als ik op de link "<link>" klik
			Dan zie ik "<title>" en "<heading>"

			Voorbeelden:
			| link                | title                        | heading                                  |
			| Home                | Welkom op het Omgevingsloket | Check of u een vergunning nodig heeft    |
			| Vergunningcheck     | Vergunningcheck              | Check gedaan? Direct door naar aanvragen |
			| Aanvragen           | Aanvraag of melding indienen | Vul uw aanvraag zo volledig mogelijk in  |
			| Maatregelen op maat | Maatregelen op maat          | Maatregelen op maat                      |
			| Mijn Omgevingsloket | Inloggen                     | Inloggen                                 |
