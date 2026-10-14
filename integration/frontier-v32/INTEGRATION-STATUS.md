# Frontier V3.2 - geïntegreerde updateketen (SHADOW)

Status: SHADOW PASS op Android (15 oktober 2026); productieactivatie: HOLD.

## Bewezen in geïsoleerde Cloudflare Pages-test
- Release A en B geïnstalleerd met Ed25519-handtekening en SHA-256 voor negen bestanden.
- Service Worker serveert de actieve release B.
- Vervalste handtekening geweigerd.
- Rollback B naar A en Service Worker serveert A.
- Bewaarde release A na opnieuw openen gevalideerd: handtekening, negen SHA-256-hashes en Service Worker.

## Veilige integratie
- Deze branch is een afzonderlijke integratiestap; bestaande productie en main blijven ongewijzigd.
- Geen private signing key in de repository, browsercode of manifest.
- De gebruikte SHADOW-publieke sleutel is geen productie-root of trust.
- Geen automatische productiedownload of installatie zonder afzonderlijke sleutelprovisioning, herstelscenario's en expliciete releasegoedkeuring.
- Geen export van Meta Veld of Global Intelligence Fusion-privégegevens.

## Werkende testomgeving
- https://frontier-v32-integrated-shadow-20261015.pages.dev/?autorun=1
- https://frontier-v32-integrated-shadow-20261015.pages.dev/resume?autorun=1

## Nog te testen voor productie
1. Onderbroken download, staging en herstel na herstart.
2. Downgrade/replay en gemanipuleerde control-state.
3. Duurzame productie-ondertekening met gescheiden privésleutel, rotatie en herstelprocedure.
4. Onafhankelijke validatie en gecontroleerde rollout.
