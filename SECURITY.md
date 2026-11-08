# Security policy

## Reporting a vulnerability

Please do not publish suspected security vulnerabilities, exposed credentials, or personal data in a public issue.

Use GitHub's Private vulnerability reporting feature in the repository Security tab when it is enabled. Include the affected URL or file, impact, reproduction steps, and a suggested mitigation. Do not include real user data.

If private reporting is not enabled, contact the project maintainer privately before publishing technical details. A public disclosure should allow reasonable time for a fix.

## Scope

The project includes a static frontend, Cloudflare Pages configuration, a Pages Function for optional feedback, and an optional Supabase feedback table.

The feedback endpoint must remain disabled until the privacy notice and all production secrets are configured. The Supabase secret key must never be shipped to browsers or committed to this repository.
