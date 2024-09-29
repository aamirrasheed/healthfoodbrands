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