This is the Plutor app that we want to build. Due to limited time, we’re pivoting to create a demo-first app for Colosseum. The app should be clean and presentable, without deep crypto integration (i.e., no smart contract interactions).

The goal is to simulate on-chain behavior off-chain using PostgreSQL and standard web/backend technologies. You already have the full context of the idea, but now you need to adapt it to the current requirements.

Crypto-related features

The only blockchain-related features will be:

Connecting a wallet

The payer will pay an invoice and sign the transaction with their private key

Functional requirements

All other features and entities will be stored in a PostgreSQL database for now.
The most important features are DID creation and Invoice CRUD with PDF generation.

DID feature

When a user connects their wallet, the site will redirect them to an onboarding page where they will verify their email and enter company/business details.
The app will then generate a DID in the following format:
did:solana:<randomHashThatLooksLikeSOL>.

After that, the user will be able to issue invoices and view, sort, search, and filter them.
When creating an invoice, the user will enter the DID of another user, and the platform will automatically populate all information related to the target user.

Invoice flow

When one user/company issues a new invoice, the target user will receive an email notification.
The app will show the newly created invoice as unpaid, allowing the recipient to preview the PDF and proceed with payment.
When paying an invoice, the user will be prompted with a wallet pop-up to sign the transaction.
The payment will then be transferred to the issuer’s account, and the Plutor admin wallet will receive a 2% transaction fee.

Libraries to use

Next.js

react-pdf

react-email

PostgreSQL extensions (e.g., pg_trgm, etc.)

Drizzle orm

Any other necessary supporting libraries