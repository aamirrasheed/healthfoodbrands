
import { sql } from "@vercel/postgres"

import { NextResponse } from 'next/server'

import { serverFormSchema } from "@/utils/formValidationSchema"


export async function POST(req) {
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
      console.error('Submission error:', error)
      return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
  }
}