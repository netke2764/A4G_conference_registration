Purpose

The Dashboard provides administrators with a real-time summary of all conference registrations. It centralizes key metrics, allowing quick assessment of participation trends without manually checking the database or table view. The dashboard acts as the first point of visibility for overall system activity.

Live URL

Dashboard: <ADD LIVE URL HERE>

What the Dashboard Shows
1. Total Registrations

Displays the combined count of all users who have submitted the form.

Updates automatically whenever a new record is added to the database.

2. Student Registrations

Shows the count of all entries where registration_type = "student".

Helps admins track student engagement separately.

3. Professional Registrations

Shows the count of all entries where registration_type = "professional".

Useful for monitoring corporate or industry-side participation.

4. Real-Time Sync

Every metric is fetched directly from the backend API on page load.

No manual refresh required for updated stats.

How Data Is Fetched

The dashboard interacts with the backend through a dedicated stats API:

Method	Endpoint	Description
GET	/api/stats	Returns total, student, and professional counts as JSON

Example response:

{
  "total": 42,
  "students": 25,
  "professionals": 17
}

UI & Layout

Three metric cards arranged in a clean, responsive grid.

Each card includes:

Title (e.g., "Total Registrations")

Numeric value fetched from backend

Layout adjusts smoothly on mobile, tablet, and desktop.

Minimal design for fast scanning and clarity.

Tech Stack

React + Vite for fast rendering

TailwindCSS for styling

Fetch API / Axios (whichever you used) for API calls

Node.js + Express backend for stats

Local Setup
cd admin-portal
npm install
npm run dev
