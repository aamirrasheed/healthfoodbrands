
# Overview
This project can be found at [healthfoodbrands.vercel.app](https://healthfoodbrands.vercel.app/).
It's a website that features "healthy" D2C food brands. Users can log in and submit their own brands to contribute to the shared knowledge repository.

![Homepage Screenshot](https://your-image-hosting-url.com/homepage-screenshot.png)

I built this project to practice the basics of building a modern web app with NextJS.
Hopefully, this can also serve as a template for future NextJS projects.

# How to run the web app locally
1. Create a [Vercel](https://vercel.com/) project. Add Vercel Postgres storage and Vercel Blob to the project.
2. You'll need to create two tables in Vercel Postgres. Navigate to your project's Postgres query interface and run the following two commands to create the necessary tables:
    1. ```
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        ```
    2.  ```
        CREATE TABLE brands (
            id SERIAL PRIMARY KEY,
            brand_name VARCHAR(255) NOT NULL,
            brand_url VARCHAR(255) NOT NULL,
            brand_tags TEXT,
            brand_description TEXT,
            brand_image_url VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
3. Then, run `vercel link` and `vercel env pull` to get the correct env vars. Make sure you have all the correct postgres and blob vars available.
4. Run `npm install` to install all of the necessary node packages.
5. Run `npm run dev` to run the web app.
6. You won't see any data on the page to start off with. Add a few brands by logging in and posting brands yourself. (Limitation: When submitting a brand, you can only use the tags found in `components/BrandCard.jsx`).


# Tech Stack
- **Frontend**: [Next.js 14](https://nextjs.org/docs). It's popular. A good first choice to understand modern React frameworks.
- **Backend**: [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers). See above. Using Next means I don't have to implement a separate Express server.
- **Database**: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres). I chose to deploy on Vercel, so using Vercel's Postgres solution made it easy to keep everything on the same platform.
- **Image Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob). Same as previous.
- **Authentication**: [NextAuth.js](https://next-auth.js.org/). I wanted to use an auth solution that could support SSO, social sign on, or email, so that I could use a similar setup in the future.
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/). `shadcn/ui` utilizes a lightweight approach to components. With most component libraries, you install all components and but only use some of them. With `shadcn/ui`, it copies only the components (into `components/ui/`) that you actually use, which makes it far more lightweight. There are theming and styling options as well, so it can be flexible for nicer looking projects as well.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/). I personally find it much easier to read Tailwind over raw CSS, but I let AI write most of it for me regardless.
- **Icons**: [Lucide](https://lucide.dev/). Free, beautiful icons so I can avoid the hassle of harvesting icons from one-off repositories here and there.
- **Deployment**: [Vercel](https://vercel.com/). Vercel is the easiest deployment environment for NextJS applications. A great choice for this project given the tech stack above.

# Anatomy of this web app
Let's break down how this app works, feature by feature. 

I highly recommend you keep this document open on one part of the screen and the codebase open on the other, and follow along. Much of the intuition of how the project is laid out comes from exploring the folder structure on your own.

## 1. User can see all health brands at `/`
With Next.js App Router, `app/page.jsx` is responsible for rendering the root route. I define a simple skeleton there and implement the bulk of the logic in `components/BrandGrid.jsx`.

We want to pull the brands data when the page loads, which we implement with the `useEffect()` hook. Since this page requires state change and dynamic rendering, it has to be marked as a client component (`'use client'` at the top of the file). This means the page is rendered on the client instead of the server! In Next.js, components are by default rendered on the server which makes page loads fast. Even cooler is that client/server components can be composed together seamlessly. Definitely one of the cooler features of the framework. Read more [here](https://nextjs.org/learn/react-foundations/server-and-client-components).)

Anyways, let's see how `components/BrandGrid.jsx` implements the home page.

```
// components/BrandGrid.jsx
'use client'
...
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
...

```

Our API fetches data about the health food brands from the Vercel Postgres DB, which returns an array of objects (`rows`) with the following fields: `brand_name`, `brand_url`, `brand_tags`, `brand_description`, `brand_image_url`. `brand_image_url` points to our images hosted publicly in Vercel Blob storage.

```
// app/api/brands/data/route.js

// setting this removes caching, otherwise returns stale data for the GET request
export const revalidate = 0;

// Get all brands data, public
export async function GET() {
    try {
        const { rows } = await sql`SELECT * FROM brands LIMIT 100`;
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching brands:', error);
        return NextResponse.json({ message: 'Error fetching brands' }, { status: 500 });
    } 
}
```
Back in the `components/BrandGrid.jsx` component, we receive the rows and save it to the `BrandData` state variable, which allows us to populate our `components/BrandCard.jsx` component. 

```
// components/BrandGrid.jsx
...
    return (
        <div className="container mx-auto px-20 mt-10">
          {loading ? 
            <div className="block w-full h-60 rounded-lg relative p-2 items-center justify-center">
              <Spinner size="large" />
            </div>
            :
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {brandData.map((brand) => (
                <BrandCard key={brand.id} {...brand} />
              ))}
            </div>
          }
            
        </div>
    )
...
```
The rest is styling. Feel free to poke around `components/BrandCard.jsx` to see how the styling was implemented with `shadcn/ui` and Tailwind.


## 2. User can login at `/login` or register at `/register`
How do users login or logout? With the button on the navigation bar, of course. 

It starts in `app/layout.js`. We put the navigation bar in here and not in `app/page.js` because we want to avoid re-rendering the navigation bar every time the user changes routes (ie from `/` to `/login`). By keeping the navigation bar in `app/layout.js` we allow it to only change depending on the authentication status of the user. `{children}` is where the rest of the app ( `app/page.js`, etc) gets rendered.

We're using [NextAuth](https://next-auth.js.org/) (more on how exactly that's implemented in a minute), and we can get the [authentication status of the user in a server component](https://next-auth.js.org/tutorials/securing-pages-and-api-routes#server-side) with `getServerSession()`, which we pass to the `NavBar` component. 
```
// app/layout.js
import { getServerSession } from "next-auth";
...
export default async function RootLayout({ children }) {
  const session = await getServerSession()
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar loggedInSession={session} />
        {children}
      </body>
    </html>
  );
}
```
In `components/NavBar.jsx`, we supply the user with the logout or login button, depending on whether they're logged in or logged out. The login button navigates the user to the `/login` page, where they can login. 

```
// components/NavBar.jsx
...
export default function NavBar({loggedInSession}) {
    return (
     <nav className="flex justify-between items-center p-4 shadow-md shadow-gray-500/50">
        <Link href="/">
            <div className="text-2xl font-bold">Healthy D2C Brands</div>
        </Link>
        {loggedInSession ? (
            <div className="flex justify-between space-x-2">
                <Link href="/post">
                    <Button className="ml-auto">Post Brand</Button>
                </Link>
                <LogoutButton/>
            </div>
        ) : (
        
            <Link href="/login">
                <Button className="ml-auto">Login</Button>
            </Link>
        )}
      </nav>
    )
...
}
```

The logout button is a separate component because it implements an `onClick()` handler and therefore must be marked as a client component. The `signOut` function provided by NextAuth utlizes the endpoint exposed by `api/auth/[...nextauth]/route.js` - more on that later.
```
// components/LogoutButton.jsx
'use client'
import {Button} from '@/components/ui/button'
import { signOut } from 'next-auth/react'
export default function LogoutButton() {

    return (
        <Button onClick={() => {
            signOut()
        }} className="ml-auto">
            Logout
        </Button>
    )
}
```
NextAuth takes care of logging out for us (essentially deleting the JSON web token that keeps us logged in).

Let's take a look at the `/login` route, which is implemented by `app/login/page.jsx`. This is essentially a skeleton that passes through the `components/LoginForm.jsx` component. 

```
// app/login/page.jsx
import LoginForm from "@/components/LoginForm"

export default async function Login() {

    return (<LoginForm />)
}
```
Note: I could have implemented the login form directly in `app/login/page.jsx`, but as a standard throughout this project, I attempted to separate logic around routes (the `page.jsx`'s that determine whether a route exists at that path or not) from UI (everything in `components`). 

Before we get to the details of how login is done, let's learn about how to register first. There's a link to register beneath the login form, so we'll assume the user clicked that and landed on the register page at `/register`. Similarly to the Login form, we've implemented the skeleton of the route at `app/register/page.jsx` and the actual form in `components/RegisterForm.jsx`.
```
// components/RegisterForm.jsx
'use client'

import Link from 'next/link'
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterForm() { 
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const email = formData.get("email")
        const password = formData.get("password")
        const registerResponse = await fetch("/api/auth/register", {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        })

        if (!registerResponse.ok) {
            console.error('Registration failed');
            return
            // TODO You might want to add some state to show an error message to the user
        }
        const signInResponse = await signIn("credentials", {
            email,
            password,
            redirect: false
        })
        
        if(signInResponse.error){
            console.error('Sign in failed');
            return
            // TODO You might want to add some state to show an error message to the user
        }
        
        // redirect to home page
        router.push("/")
        router.refresh()
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-auto mt-5">
            <Input type="email" name="email" placeholder="Email" />
            <Input type="password" name="password" placeholder="Password" />
            <Button type="submit">Register</Button>
        </form>
        <p className="mt-2">Already have an account? <Link className="text-blue-400" href="/login">Login</Link> instead</p>
        </div>
    )
}

```

You can see that I implement a basic register form that takes an email and password. It has to be a client component because we're using a client-side event handler (onSubmit) that can't be implemented on the server. (I'll stop pointing out the `use client`'s from now on haha)

The form passes the user credentials (email/pass) to `app/api/auth/register/route.jsx`, which validates the data, hashes the password with `bcrypt` then stores it in our Vercel Postgres database.

```
// app/api/auth/register/route.js

import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { sql } from "@vercel/postgres"

export async function POST(req) {
    try{
        const { email, password } = await req.json()
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email address" },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 10)

        await sql`
            INSERT INTO users (email, password)
            VALUES (${email}, ${hashedPassword})
        `

        return NextResponse.json({message: "User registered successfully"})
    }
    catch (error) { 
        console.log({error})
        return NextResponse.json({message: "User registration failed"}, {status: 500})
    }

}
```


Then, back in `components/RegisterForm.jsx`, we call `signIn()`, which uses NextAuth to exchange the credentials for a JWT (JSON web token) that represents the user's login status. It does this by routing the credentials to `api/auth/[...nextauth]/route.js`. (The "`[...nextauth]`" means that it's a catch-all route that captures every route not explicitly declared in the project)

Let's take a look at this `api/auth/[...nextauth]/route.js` API route now...

```
// app/api/[...nextauth]/route.js
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {compare} from "bcrypt"
import {sql} from "@vercel/postgres"

export const authOptions = {
    session:  {
        strategy: "jwt"
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {  },
                password: {  },
            },
            async authorize(credentials, req) {

                const response = await sql`
                    SELECT * FROM users WHERE email = ${credentials.email}
                `
                const user = response.rows[0]

                const passwordCorrect = await compare(credentials.password, user.password)
                
                if (passwordCorrect) {
                    return {
                        id: user.id,
                        email: user.email,
                    }
                } else {
                    return null
                }
            }
        }),
    ], 
}
const handler = NextAuth(authOptions)
    

export { handler as GET, handler as POST }
```

Most of this is provided to us out of the box by NextAuth. Essentially, we're
1. Using the JWT strategy instead of the server session strategy (which requires storing sessions on a database using a NextAuth [database adapter](https://next-auth.js.org/configuration/databases) - just different security/complexity tradeoffs with that method)
2. Overriding NextAuth's default login page with our own
3. Specifying that we're using email/password (with CredentialsProvider)
4. Implementing basic logic to check whether a user exists. 

Since the user exists (we just created the user in earlier using the `app/api/register/route.js` endpoint), we'll get back a JWT. Then, in `components/RegisterForm.jsx` we redirect the user back to `/` to get back to the homepage.

The sign-in workflow for existing users is almost identical, implemented in `app/login/page.js` and `components/LoginForm.jsx`, also utilizing the `api/auth/[...nextauth]/route.js`route.

## 3. User can post a new brand at `/post`

Only logged-in users can submit brands. See the feature numero 4 below for details on how that is implemented.

To submit a brand, the logged-in user must navigate to `/post`, input the data into the form, and click submit. Behind the scenes, we validate the user input, upload the data to Vercel Blob storage, get the URL where it's hosted, and put that URL + the other brand data into the `brands` table in our Vercel Postgres database. 

Let's take a look at `components/PostForm.jsx` (imported and used in `app/post/page.jsx`) to see how that's implemented. The file is pretty long, so we'll just take a look at the form logic first.

```
// components/PostForm.jsx

...
import { useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { upload } from '@vercel/blob/client';
import { clientFormSchema } from '@/lib/formValidationSchema'

...

export default function PostForm() {

    ...

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Create Post</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mx-auto mt-5">
                    <FormLabel>Brand Name</FormLabel>
                    <FormField
                        control={form.control}
                        name="brandName"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Brand Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormLabel>Website</FormLabel>
                    <FormField
                        control={form.control}
                        name="brandUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Brand URL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormLabel>Tags</FormLabel>
                    <FormField
                        control={form.control}
                        name="brandTags"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Comma separated list, ie tag1,tag2,tag3" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormLabel>Description</FormLabel>
                    <FormField
                        control={form.control}
                        name="brandDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder="Brand Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="brandImage"
                        render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        type="file" 
                                        onChange={async (e) => {
                                            const file = e.target.files[0]
                                            if(file){
                                                onChange(file)
                                            }
                                        }} 
                                        {...rest} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">{submittingData ? <Spinner/> : "Submit"}</Button>
                </form>
            </Form>
        </div>
    )
}
```
We're using `shadcn/ui` forms to create the form UI, along with `react-hook-forms` and `yup` to validate the input. We've defined the schema for valid input in `lib/formValidationSchema.js`.

```
// lib/formValidationSchema.js
import {object, string, required, url, mixed} from 'yup'

const FILE_SIZE = 4 * 1024 * 1024; // 4MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

const baseSchema = {
    brandName: string().required("Brand name is required"),
    brandUrl: string().required("Brand url is required").url(),
    brandTags: string().required("At least one brand tag is required")
        .test("isValidArray", "Must be a comma-separated list of tags", function(value) {
            if (!value) return false;
            const tags = value.split(',').map(tag => tag.trim());
            return tags.length > 0 && tags.every(tag => tag.length > 0);
        }),
    brandDescription: string().required("Brand description is required"),
}

export const clientFormSchema = object().shape({
    ...baseSchema,
    brandImage: mixed().required("Brand image is required")
        .test("fileSize", "File size is too large", (value) => {
            if (!value) return true;
            return value.size <= FILE_SIZE;
        })
        .test("fileType", "Unsupported file format", (value) => {
            if (!value) return true;
            return SUPPORTED_FORMATS.includes(value.type);
        }),
})

export const serverFormSchema = object().shape({
    ...baseSchema,
    brandImageUrl: string().required("Brand image URL is required").url(),
})
```

We're using the `clientFormSchema` in `app/components/PostForm.jsx` because we want to validate the data the user is entering. Later, we'll use `serverFormSchema` to validate the data we're saving to our Postgres database, which includes the image url instead of the raw image data.

Back in `app/components/PostForm.jsx`, once the user has entered valid input for each of the fields and hit submit, we begin the data validation and saving process in `onSubmit`. 

```
// app/components/PostForm.jsx

...

const onSubmit = async (data) => {
        try {
            setSubmittingData(true)
            const uploadedImageURL = await uploadBrandImage(data.brandImage)
            setSubmittingData(false)

            const formData = new FormData()
            formData.append('brandName', data.brandName)
            formData.append('brandUrl', data.brandUrl)
            formData.append('brandTags', data.brandTags.toLowerCase().split(','))
            formData.append('brandDescription', data.brandDescription)
            formData.append('brandImageUrl', uploadedImageURL)

            const response = await fetch('/api/brands/data', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const result = await response.json()
                // Handle server-side validation errors
                if(result.errors){
                    for (const [key, value] of Object.entries(result.errors)) {
                        form.setError(key, { type: "server", message: value })
                    }
                }
            } else {
                router.push('/')
            }
        } catch (error) {
            setSubmittingData(false)
        } finally {
            setSubmittingData(false)
        }
    
    }

    const uploadBrandImage = async (file) => {
          const newBlob = await upload('brandImages/'+file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/brands/image',
          });

          return newBlob.url

    }

...

```

First, we upload the brandImage to Vercel Blob storage by POSTing to the `api/brands/image` API route...

```
// app/api/brands/image/route.js

import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

// submit a new image
export async function POST(request) {
  const body = await request.json();
  
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
        };
      },
      onUploadCompleted: async ({ blob }) => {
        
        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });
 
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }, // The webhook will retry 5 times waiting for a status 200
    );
  }
}
```

(most of this was provided out of the box by Vercel)

Back in `app/components/PostForm.jsx`, we receive the public blob storage URL and save it to the Postgres database by POSTing to `app/api/brands/data/route.js`:

```
// app/api/brands/data/route.js
import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"
import { serverFormSchema } from "@/lib/formValidationSchema"
import { getToken } from "next-auth/jwt"

...

// Submit a new brand, requires auth
export async function POST(req) {
  
    const token = await getToken({ req })
    
    if (!token) {
        return NextResponse.json({message: 'Unauthorized req'}, {status: 401})
    } 
   
    try {
      // Parse the multipart form data
      const data = await req.formData()
      
      // Extract fields and file
      const formData = {
        brandName: data.get('brandName'),
        brandUrl:  data.get('brandUrl'),
        brandTags:  data.get('brandTags'),
        brandDescription: data.get('brandDescription'),
        brandImageUrl: data.get('brandImageUrl')
      }
  
      // Validate the data
      await serverFormSchema.validate(formData, { abortEarly: false })
      
      await sql`INSERT INTO brands (brand_name, brand_url, brand_tags, brand_description, brand_image_url) 
                VALUES (${formData.brandName}, ${formData.brandUrl}, ${formData.brandTags}, ${formData.brandDescription}, ${formData.brandImageUrl})`
      
  
      return NextResponse.json({ message: "Form submitted successfully" }, { status: 200 })
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = error.inner.reduce((acc, err) => {
          acc[err.path] = err.message
          return acc
        }, {})
        return NextResponse.json({ errors }, { status: 400 })
      } else {
        console.log('Submission error:', error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
      }
    }
  }
```

And that completes the brand submission process!

## 4. Logged out users cannot access `/post`, logged in users cannot access `/login` and `/register`.

We implement access control to each of our routes (including API routes) through `middleware.js`. The logic runs on every request and allows us to determine whether a user is logged in or not and whether they have access to a particular route:

```
// middleware.js
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server";

export default async function middleware(request){

    // user is logged in if this is valid
    const token = await getToken({req: request, secret: process.env.NEXTAUTH_SECRET})
    
    const pathname = request.nextUrl.pathname

    // routes that require authentication
    const protectedRoutes = {
        "/api/brands/data": "POST",
        "/api/brands/image": "POST"
    }

    // Paths that logged-in users shouldn't access
    const publicPaths = ["/login", "/register", "/api/register", "/api/login"];
    
    // Paths that require authentication
    const protectedPaths = ["/post"];

    // protect API routes that require login with 401s
    if(!token && Object.keys(protectedRoutes).some(path => pathname.startsWith(path)) && protectedRoutes[pathname] === request.method){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); 
    }
    
    // protect pages from logged-out users
    if (!token && protectedPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // protect pages from logged in users
    if (token && publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // let the request to continue for all other cases
    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register", "/post/:path*", "/api/brands/:path*"]
}
```

As you can see, we match for all routes in `config` that we want to potentially restrict. Then in the main function we restrict authenticated users from accessing unauthenticated-only routes such as `/login` and `api/auth/*`, and unauthenticated users from accessing authenicated-only routes such as `/post/*`.

# Future development
1. This project doesn't do a great job with form validation. For example, users can submit bogus data for brands, including tags that don't yet have colors mapped to them in `components/BrandCard.jsx`. 
2. The tags/colors mapping in `components/BrandCard.jsx` should probably be saved to a database so we can add new user tags.
3. No user feedback on invalid register/login forms right now.