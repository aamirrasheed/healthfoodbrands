import { Badge } from "@/components/ui/badge"

const tagColorMap = {
  seafood: 'bg-orange-500',
  venison: 'bg-red-800',
  beef: 'bg-red-600',
  chicken: 'bg-amber-700',
  'protein powder': 'bg-green-500',
  snacks: 'bg-blue-400',
  'bone broth': 'bg-yellow-600',
  'infant formula': 'bg-purple-300'
};

export default function BrandCard({ name, imageUrl, tags, description, url }) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full h-60 bg-cover bg-center rounded-md relative p-2 group" style={{backgroundImage: `url(${imageUrl})`}}>
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-75 transition-opacity duration-300"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-3xl text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] z-10 group-hover:opacity-0">{name}</span>
        </div>
        <div className="absolute bottom-2 right-2 flex flex-wrap gap-2 justify-end z-10 group-hover:opacity-0">
          {tags.map((tag) => (
            <Badge key={tag} className={`${tagColorMap[tag]} text-sm px-2 py-1 rounded-full`}>{tag}</Badge>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-white text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{description}</p>
        </div>
      </a>
    );
  }