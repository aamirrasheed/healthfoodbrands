
# Overview
This project can be found at [healthfoodbrands.vercel.app](https://healthfoodbrands.vercel.app/).
It's a website that features "healthy" D2C food brands. Users can log in and submit their own brands to contribute to the shared knowledge repository.

![Homepage Screenshot](https://your-image-hosting-url.com/homepage-screenshot.png)

I built this project to practice the basics of building a modern web app with NextJS.
Hopefully, this can also serve as a template for future NextJS projects.

# How to run the web app locally
1. Configure your own Vercel project. Add postgres storage and blob storage. Then, run `vercel link` and `vercel env pull` to get the correct env vars. Make sure you have all the correct postgres and blob vars available.
2. Run `npm install` to install all of the necessary node packages.
1. Run `npm run dev` to run the web app.

# Tech Stack
- Frontend: [Next.js 14](https://nextjs.org/docs). It's popular, comes with a lot out of the box, and a good first choice to better understand modern React frameworks.
- Backend: [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers). See above. Didn't have to implement a separate Express server.
- Database: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres). I chose to deploy on Vercel, so this made it easy to just say all on the same platform.
- Object Storage: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob). See above.
- Authentication: [NextAuth.js](https://next-auth.js.org/). I wanted to use a flexible auth solution so that in the future if I did want to build an app with SSO, social sign on, or email, I could use a similar setup.
- Components: [shadcn/ui](https://ui.shadcn.com/). They have a lightweight approach to components. Instead of installing all of the components and only using part of them, this library copies the components' raw code to `app/components/ui` and you can use it directly from the project. There are theming and styling options as well, which keep this framework flexible enough to use for more advanced projects as well.
- Styling: [Tailwind CSS](https://tailwindcss.com/). I personally find it much easier to read and implement Tailwind, but I let AI write most of it for me regardless.
- Icons: [Lucide](https://lucide.dev/). Free, beautiful icons so you can avoid the hassle of harvesting icons from one-off repositories here and there.
- Deployment: [Vercel](https://vercel.com/). Vercel is the easiest deployment environment for NextJS applications. A great choice for a simple hobby project.

# Anatomy of this web app
There are three main features to this web app: 
1. User can see all health brands at `/`.
2. User can login at `/login` or register at `/register`
3. User (logged-in only) can post a new brand at `/post`

Let's go through how each of the features are implemented in detail.

## User can see all health brands at `/`
With Next.js App Router, the root route is pulled from `app/page.jsx`. Here, we define a skeleton and implement the bulk of the logic in `app/components/BrandGrid.jsx`.

```
useEffect(() => {
        const getData = async () => {
            const response = await fetch('/api/brands/data');
            if (!response.ok) {
                throw new Error('Failed to fetch brand data');
            }
            const fields = await response.json();
            setBrandData(fields);
            setLoading(false)
        }
        try{
            getData()
        }
        catch (error) {
            console.error('Error fetching brand data:', error);
            setBrandData([]);
        }

    }, [])
```



# Future development
1. This project doesn't do a great job with form validation. For example, users can submit bogus data for brands, including tags that don't yet have colors mapped to them in `app/components/BrandCard.jsx`. 