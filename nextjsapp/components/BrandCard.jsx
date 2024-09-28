import { Badge } from "@/components/ui/badge"
// import { tagColorMap } from '@/utils/tagColorMap';

const tagColorMap = {
  'seafood': { bg: 'bg-orange-500', text: 'text-white' },
  'venison': { bg: 'bg-red-800', text: 'text-white' },
  'beef': { bg: 'bg-red-600', text: 'text-white' },
  'chicken': { bg: 'bg-amber-700', text: 'text-white' },
  'protein powder': { bg: 'bg-green-500', text: 'text-white' },
  'snacks': { bg: 'bg-blue-400', text: 'text-white' },
  'bone broth': { bg: 'bg-yellow-600', text: 'text-white' },
  'infant formula': { bg: 'bg-purple-300', text: 'text-white' },
  'dairy': { bg: 'bg-amber-100', text: 'text-black' },
  'meats': { bg: 'bg-red-600', text: 'text-white' },
  'bread': { bg: 'bg-amber-500', text: 'text-white' },
};

export default function BrandCard({ brand_name, brand_url, brand_tags, brand_description, brand_image_url }) {
    return (
      <>
          <div className="relative w-full h-60 rounded-lg overflow-hidden">
            <img
              src={brand_image_url}
              alt={brand_name}
              className="absolute inset-0 w-full h-full object-cover"
            />
              <a 
                href={brand_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block absolute inset-0 p-2 group"
              >
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-75 transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-3xl text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] z-10 group-hover:opacity-0">{brand_name}</span>
            </div>
            <div className="absolute bottom-2 right-2 flex flex-wrap gap-2 justify-end z-10 group-hover:opacity-0">
              {brand_tags.split(',').map((tag) => (
                <Badge key={tag} className={`${tagColorMap[tag].bg} ${tagColorMap[tag].text} text-sm px-2 py-1 rounded-full`}>{tag}</Badge>
                )
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-white text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{brand_description}</p>
            </div>
          </a>
          </div>
      </>
    );
  }