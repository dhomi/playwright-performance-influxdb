# language: nl
Functionaliteit: Als API kan ik berichten ophalen
 Ik kan alle berichten ophalen

@api
# reqres api
Abstract Scenario: Haal berichten van ReqRes.in
 Gegeven ik "<endpoint>" ophaal
 En de reactie was succesvol
 Dan is de antwoordstatuscode "<status>"
 En de body bevat "<id>" en "<last_name>"

Voorbeelden:
| endpoint | status | id | last_name |
| /users/1 | 200    | 1  | Bluth     |
| /users/2 | 200    | 2  | Weaver    |
