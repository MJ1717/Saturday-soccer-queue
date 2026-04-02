# Soccer Queue Website Overview

## Project Summary
This website is a simple queue system for Saturday soccer where players type their name, join the list, and receive a queue position in order. The first 24 players are confirmed spots, and anyone after position 24 is shown as part of the waiting list.

The public page should stay minimal: one name input, one add button, and a queue list that shows positions from 1 to `n`. An admin page should provide a reset action so the organizer can clear the queue for the next week.

## Main Requirements
- Public page at `/` with a name input and add button.
- Queue list shown below the form, ordered from 1 upward.
- Queue items from 1 to 24 shown with a green background.
- Queue items from 25 onward shown with a yellow background to indicate the waiting list.
- Admin page with a reset button to clear the queue for the next session.
- Basic support for multiple people opening the site and joining around the same time.

## Recommended Stack
The recommended starter stack is Next.js for the web app, Supabase for the database, and Vercel for deployment.[1][2] This is a good fit because it matches existing React and Node.js learning, keeps the app simple, and avoids managing a traditional server manually.[2]

### Why this stack fits
- **Next.js** handles the frontend pages and backend API routes in one project, which keeps the codebase small and easy to understand.
- **Supabase** provides a hosted Postgres database, which is useful because queue state must be stored centrally rather than only in each user's browser.[1]
- **Vercel** hosts the Next.js app and offers a free Hobby tier for personal projects, which is enough for an initial version.[2]
- **Supabase** also has a free tier, though free projects can pause after inactivity, which is worth remembering for a weekly-use app.[1]

## Suggested Architecture
The website should have three main parts:

1. **Public UI**: form to enter a name and view the queue.
2. **Server routes**: backend endpoints that safely add users and reset the queue.
3. **Database**: stores queue entries and session state so everyone sees the same list.

The important rule is that queue positions should be assigned on the server side, not in browser code, so two people clicking at the same time do not get the same number. PostgreSQL supports locking and transactional behavior that helps prevent those race conditions.[3]

## Data Model
A minimal first version can use one main table.

### `queue_entries`
| Column | Type | Purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `session_id` | UUID or text | Identifies the current week/session |
| `name` | text | Player name |
| `position` | integer | Queue number assigned by the server |
| `created_at` | timestamp | Join time |

This app can also use a small `sessions` table if weekly history is needed later, but the first version can stay simple with only current active entries.

## Main Pages and Routes
### Public page
- Route: `/`
- Features: name input, add button, queue list, confirmed count, waiting list label

### Admin page
- Route: `/admin`
- Features: one large reset button, optional admin password later

### API routes
- `POST /api/join` — adds a player to the queue
- `GET /api/queue` — returns the latest queue
- `POST /api/reset` — clears the current queue or starts a new session

## Implementation Steps
### 1. Create the project
- Create a Next.js app.
- Push it to GitHub.
- Create a Vercel account and connect the repository for deployment.[2]

### 2. Create the database
- Create a Supabase project.[1]
- Add the `queue_entries` table.
- Copy the Supabase project URL and API keys into environment variables.

### 3. Build the public page
- Add a text input for the player name.
- Add an **Add** button.
- Render the queue below the form.
- Apply green styling for positions 1 to 24 and yellow styling for 25+.

### 4. Build the join API
- Create `POST /api/join`.
- Validate the input name.
- Start a database transaction.
- Find the next available position.
- Insert the new row and return the assigned number.

This is the most important backend step because concurrency should be handled here, not only in the frontend. The host helps with scaling requests, but correct queue order depends on safe database writes.[2][3]

### 5. Build the queue fetch logic
- Create `GET /api/queue`.
- Return all queue entries sorted by position ascending.
- Refresh the list after a successful add.

A simple first version can refresh manually after each join. A nicer later version can use Supabase Realtime so the queue updates live for everyone viewing the page.[1]

### 6. Build the admin reset page
- Create `/admin`.
- Add one large reset button.
- Connect it to `POST /api/reset`.
- Reset by deleting current entries or by starting a fresh `session_id`.

Using a new `session_id` is cleaner if weekly history might matter later.

### 7. Protect admin actions
- First version: protect `/admin` with a simple password check on the server.
- Later version: add real authentication if needed.

Admin reset should stay server-side so sensitive credentials are never exposed in client code.[1]

### 8. Deploy
- Deploy the app on Vercel.[2]
- Put the Supabase environment variables into the Vercel project settings.[1][2]
- Test the full flow: add user, view queue, cross 24 players, reset queue.

## Concurrency and Stability
Ten people visiting at once is a small load for modern hosted platforms, so the bigger concern is not crashing the server but preventing duplicate queue numbers.[2][3] The safe approach is to let the backend assign positions inside a transaction and store the result in Postgres.[3]

In other words, hosting and autoscaling help the app stay available, but correct queue order is mainly an application and database design problem.[2][3]

## Simple Version First
The first version should avoid overbuilding. The best first milestone is:

- One public page
- One admin page
- One table in the database
- Three API routes
- Clean color-coded queue display

That version is enough to prove the main workflow before adding extras like live updates, duplicate-name checks, mobile polish, login, or weekly history.

## Possible Future Features
- Prevent the same name from joining twice
- Show number of confirmed players vs waiting list
- Add live queue updates with Supabase Realtime.[1]
- Add Saturday session history
- Add an organizer-only login system
- Add a remove-player action for the admin

## Build Order Recommendation
A practical build order is:

1. Static UI mockup
2. Supabase table
3. `GET /api/queue`
4. `POST /api/join`
5. Queue rendering with colors
6. `/admin` reset page
7. Deployment on Vercel
8. Concurrency cleanup and polish

This order keeps the project small and lets each layer be tested before adding more complexity.