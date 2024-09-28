'use client'
import { useState } from "react"

import { useForm} from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { upload } from '@vercel/blob/client';

import { Input } from "@/components/ui/input"
import { clientFormSchema } from '@/utils/formValidationSchema'
import { Button } from "@/components/ui/button"
import  {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner";


export default function PostForm() {
    const [submittingData, setSubmittingData] = useState(false)
    const form = useForm({
        resolver: yupResolver(clientFormSchema),
        defaultValues: {
            brandName: "",
            brandUrl: "",
            brandTags: "",
            brandDescription: "",
            brandImage: null,
        }
    })


    const onSubmit = async (data) => {
        try {
            setSubmittingData(true)
            const uploadedImageURL = await uploadBrandImage(data.brandImage)
            console.log("brand image url is ", uploadedImageURL)
            setSubmittingData(false)

            const formData = new FormData()
            formData.append('brandName', data.brandName)
            formData.append('brandUrl', data.brandUrl)
            formData.append('brandTags', data.brandTags.split(','))
            formData.append('brandDescription', data.brandDescription)
            formData.append('brandImageUrl', uploadedImageURL)

            const response = await fetch('/api/submitBrand', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const result = await response.json()
                // Handle server-side validation errors
                for (const [key, value] of Object.entries(result.errors)) {
                    form.setError(key, { type: "server", message: value })
                }
            } else {
                // Handle successful submission
                console.log("Form submitted successfully")
            }
        } catch (error) {
            console.error("Submission error", error)
        }
    }

    const uploadBrandImage = async (file) => {
          const newBlob = await upload('brandImages/'+file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/brandImageUpload',
          });

          console.log("new brand image URL: ")
          return newBlob.url

    }
    
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