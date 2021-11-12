# Ehrenamtskarten Authentication Concept

In this thesis I want to present one of the core concepts of the Ehrenamtskarten project.

## Stakeholder Goals

### Akzeptanzstelle

* Prevent misuse
* Works offline
* Ease of use
* Quick process


### Kommune

* Should be accepted by:
  * Ehrenamtliche
  * Akzeptanzstelle
* Ability to revoke cards
* Automatic expiration

### Ehrenamtliche

* Ease of use
* Quick process
* Controllable tracking
* Prevent stealing of personal data (by copying QR code)
* Prevent stealing of authentication card (QR code)

### Operator

* Adaptable for different muncipality
* Scalable to the moon!
* Avoid unauthorized card issuance

## Flow Concepts

### Issuance via Public-Private Keys

End-User Certificate:
* **Payload**
  * Names
  * Birthdate
  * ID/Serial
* **Public Keys** 
  * One signed by "Intermediate-Authority Certificate"
  * ...
* Signature over **Payload** and **Public Keys**


With the End-User certificate, users can sign the current time t. The Akzeptanzstelle can verify the signature and the time t by following the signature chain upwards:
End-User Certificate -> Intermediate-Authority Certificate -> Main-Authority Certificate


Intermediate-Authority Certificate:
* **Payload**
  * ...
* **Public Keys** 
  * One signed by "Root Certificate"
  * ...
* Signature over **Payload** and **Public Keys**

Root Certificate:
...

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgICBEaWdpdGFsZmFicmlrIC0tLT4gQihcIkVocmVuYW10c2thcnRlIEJheWVyblwiKTtcbiAgICBEaWdpdGFsZmFicmlrIC0tLT4gTihcIkVocmVuYW10c2thcnRlIE5SV1wiKTtcbiAgICBEaWdpdGFsZmFicmlrIC0tLT4gUyhTb3ppYWxwYXNzIE51ZXJuYmVyZyk7XG4gICAgIEIgLS0tPiBNdWVuY2hlbjtcbiAgICAgTiAtLS0-IER1ZXNzZWxkb3JmO1xuICAgIE11ZW5jaGVuIC0tLT4gTWFya2w7XG4gICAgTXVlbmNoZW4gLS0tPiBEYW5pZWw7XG4gICAgRHVlc3NlbGRvcmYgLS0tPiBNYXJrO1xuICAgIER1ZXNzZWxkb3JmIC0tLT4gU2FtO1xuICAgIFMgLS0tPiBDbGFyYTsiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOnRydWUsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)](https://mermaid-js.github.io/mermaid-live-editor/edit#eyJjb2RlIjoiZ3JhcGggVERcbiAgICBEaWdpdGFsZmFicmlrIC0tLT4gQihcIkVocmVuYW10c2thcnRlIEJheWVyblwiKTtcbiAgICBEaWdpdGFsZmFicmlrIC0tLT4gTihcIkVocmVuYW10c2thcnRlIE5SV1wiKTtcbiAgICBEaWdpdGFsZmFicmlrIC0tLT4gUyhTb3ppYWxwYXNzIE51ZXJuYmVyZyk7XG4gICAgIEIgLS0tPiBNdWVuY2hlbjtcbiAgICAgTiAtLS0-IER1ZXNzZWxkb3JmO1xuICAgIE11ZW5jaGVuIC0tLT4gTWFya2w7XG4gICAgTXVlbmNoZW4gLS0tPiBEYW5pZWw7XG4gICAgRHVlc3NlbGRvcmYgLS0tPiBNYXJrO1xuICAgIER1ZXNzZWxkb3JmIC0tLT4gU2FtO1xuICAgIFMgLS0tPiBDbGFyYTsiLCJtZXJtYWlkIjoie1xuICBcInRoZW1lXCI6IFwiZGVmYXVsdFwiXG59IiwidXBkYXRlRWRpdG9yIjp0cnVlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)


### Issuance via API and PSK instead of Initial Certificate

Instead of providing one initial certificate, we prove a pre-shared key. This secret allows the issue of at most n certificates. (Users can optionally revoke certificates or get new ones (up to n).)


Alternative: Register up to n devices per year?

### Fraud Detection via Metrics

The Akzeptanzstelle sends pings to the Operator which could include:
* Timestamp
* Location
* IP
* Device ID

After that we can do fancy statistical, mathematical, and scientific analysis to check for fraud.