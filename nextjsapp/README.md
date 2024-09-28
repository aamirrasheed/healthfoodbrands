# Prereqs
1. Install `ngrok` (for image upload functionality)
2. Configure your own vercel project with postgres and blob storage, then run `vercel env pull` to get the correct vars, make sure you have all the correct postgres and blob vars available.

# Run the app
1. Run `npm run dev`
2. In a separate terminal window, run `ngrok http 3000` (for image upload functionality to work)
