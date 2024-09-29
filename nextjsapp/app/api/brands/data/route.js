import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"
import { serverFormSchema } from "@/lib/formValidationSchema"
import { getToken } from "next-auth/jwt"

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