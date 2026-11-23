# Security

## Reporting a vulnerability

Please do not open a public issue. Use GitHub's
[private vulnerability reporting](https://github.com/roei10101/Smart-Stock/security/advisories/new)
and include steps to reproduce. You can expect a first response within a few days.

## How secrets are handled

- No credential is stored in the repository. Everything is read from the environment
  (`.env.example` lists the variables) and the application refuses to start without them.
- Passwords are hashed with bcrypt; API access uses signed JWTs.
- Self-registration always creates a regular user; a role sent by the client is ignored.
- Earlier commits contained a development database password and JWT signing key. They were local defaults, have been
  removed from the code, and must not be reused anywhere.
