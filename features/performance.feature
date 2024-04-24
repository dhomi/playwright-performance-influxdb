			# language: nl
			Functionaliteit: Performance meting op productie

			@performance @productie
			@BC1.5-A.01 @BC1.5-A.02 @BC1.5-A.03 @BC1.5-A.04
			Abstract Scenario: Performance meting @BC1.5-A.01 @BC1.5-A.02 @BC1.5-A.03 @BC1.5-A.04
			Stel ik de "<omgeving>" kies met initiele gegevens met '<bewaarInflux>'
			Dan dat ik de performance meting doe op "<omgeving>"
			Dan kies ik voor de vergunningcheck
			En zoek de locatie met "<adres>" door <timeout>
			Dan gebruik ik werkzamheid met <timeout>
			Dan beantwoord ik de vragen
			En ik zie de resultaten pagina
			En ik schrijf de performance meting uit naar '<bewaarInflux>' op "<omgeving>"

			Voorbeelden:
			| omgeving | adres               | timeout | bewaarInflux |
			| prod     | Kerkstraat 2, Breda | 1500    | ja           |
			| pre      | De Ekers 2, Joure   | 1500    | ja           |
# | dmo      | De Ekers 2, Joure   | 500     | nee           |
# | perf     | De Ekers 2, Joure   | 1500    | nee          |
# | acc      | De Ekers 2, Joure   | 500     | nee           |
