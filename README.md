# Step 1. Install dependencies

```bash
npm install
```

# Step 2. Set up environment variables
```bash
cp .env.example .env
```
Set the `NEXT_PUBLIC_API_URL` environment variable to the URL of your API server.
Example:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

# Step 3. Run the development server

```bash
npm run dev
```