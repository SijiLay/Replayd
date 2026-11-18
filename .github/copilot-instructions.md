# Replayd Copilot Instructions

Replayd is a full-stack sports diary, prediction, and community platform.

## Stack

Backend:
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- Maven

Frontend:
- React
- TypeScript
- Vite
- React Router

Deployment:
- Render
- PostgreSQL
- Docker

## Backend Architecture

Follow this structure:

Controller  
→ Service  
→ Repository  
→ PostgreSQL

Keep business logic in services, not controllers.

Use constructor injection.

Use DTOs for API request and response objects when appropriate.

## Existing V1 Features

Do not break:

- NFL game browsing
- live scores
- scheduled sports data refresh
- GameLogs
- Full Game / Highlights
- ratings and reviews
- per-user history
- signup/login
- JWT authentication
- USER and ADMIN roles
- admin sports data tools
- responsive frontend
- Render deployment

Authentication already exists. Do not rebuild it.

## Authentication

Protected backend actions should use the authenticated user from Spring Security.

Current roles:

- USER
- ADMIN

Never expose password hashes.

Never hard-code:
- JWT secrets
- database passwords
- API keys

Use environment variables.

## V2 Direction

V2 adds:

- profiles and privacy
- structured prediction questions
- predefined prediction options
- permanent UserPicks
- community percentages
- comments
- prediction resolution
- prediction accuracy/history
- follows
- social feed
- debate questions

Only Replayd/admin creates prediction questions in V2.

Prediction questions should support 2–4 predefined options and should not be hard-coded around Yes/No.

## UserPick Rules

A UserPick:

- belongs to one user
- belongs to one PredictionQuestion
- selects one PredictionOption
- allows only one pick per user per question
- becomes permanently locked after submission
- cannot be edited by a normal user
- cannot be deleted by a normal user
- cannot be submitted after the question closes
- remains public

## Comments

A user must submit a pick before commenting on that prediction question.

Do not duplicate the selected option inside Comment if it can be retrieved from UserPick.

## Privacy

Users can eventually make profiles private.

Private profiles should hide diary/history and private reviews.

Locked prediction picks remain public even if the profile is private.

## Development Style

Build vertically and incrementally.

Prefer:

Entity  
→ Repository  
→ Service  
→ Controller  
→ Tests  
→ Frontend integration

Do not build speculative infrastructure.

Do not add:
- Redis
- Kafka
- microservices
- mobile app
- algorithmic feed
- recommendation engine

unless explicitly requested.

## Testing

Backend:

```bash
mvn test
```

Frontend:

```bash
cd frontend
npm run build
```

Update or add tests when backend behavior changes.