# Assumptions & Trade-offs

Hi! Thanks for taking the time to review my submission. I wanted to include a few quick notes to explain some of the architectural choices and trade-offs I made while building this task manager.

## 1. Keeping it Vanilla (Frontend)
I decided to stick with standard Vanilla HTML, CSS, and JavaScript rather than spinning up a React or Vue project overhead. 
- **The Trade-off:** Managing state manually and updating the DOM directly via template strings is a bit more manual and verbose than using declarative JSX. 
- **The Reasoning:** Since the assignment emphasized keeping the solution intentionally small, I wanted to avoid dependency bloat and heavy build configurations entirely. Honestly, I think using vanilla JS for a small scope like this is a great way to demonstrate a solid grasp of core web fundamentals.

## 2. Deployment & Database
I set up the backend structure to be specifically deployed to Vercel using their serverless functions (`api/tasks.js`) and a PostgreSQL database.
- **The Trade-off:** Instead of using a heavier ORM like Prisma or TypeORM (which are great for type-safety), I opted for raw SQL queries using the `pg` driver. 
- **The Reasoning:** Keeping it raw helps minimize package size and trims down the serverless cold-start times. Plus, writing raw SQL for lightweight CRUD operations is usually pretty fast!

## 3. The Local Fallback Experience
I know how annoying it can be to clone a candidate's repo and then have to immediately spin up a local PostgreSQL instance just to see if it works. 
- **The Workaround:** I actually programmed `api/tasks.js` so that if it doesn't detect a `DATABASE_URL` environment variable, it gracefully fails safely and switches over to an ephemeral, in-memory mock array. The trade-off is that data won't actually persist locally out-of-the-box unless you tie in an env file, but it makes the immediate local test run completely frictionless.

## 4. Optimistic UI Updates
For the frontend, I wanted to make sure it felt like a modern, professional SaaS product rather than a typical boilerplate layout.
- **The Trade-off (Optimistic UI):** When you click a checkbox, the frontend checks it off instantly *before* it gets a successful response from the backend API. 
- **The Reasoning:** This UX trick makes the app feel incredibly fast and snappy to whoever is using it. I just added some simple catch-handling to revert the visual checkbox if the server happens to throw an error.

I had a lot of fun working on this and tried to strike a good balance between simplicity and a polished product. Looking forward to discussing it with you!
