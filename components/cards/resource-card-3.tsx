import Link from "next/link";

const ResourceCard3 = ({ title, sub_title, link, tags }) => {
  return (
    <div>
      <Link href={link}>
        <article
          className="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]"
        >
          <div className="rounded-[10px] bg-white p-4  sm:p-6">
            <div className="block text-xs text-gray-500">
              {sub_title}
            </div>

            <div >
              <h3 className="mt-0.5 text-lg font-medium text-gray-900">
                {title}
              </h3>
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
              {tags.map((tag)=>(
                <span key={tag}
                className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600"
              >
                {tag}
              </span>
              ))}
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}

export default ResourceCard3;