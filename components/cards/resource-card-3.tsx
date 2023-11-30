const ResourceCard3 = () => {
  return (
    <div>

      <article
        className="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]"
      >
        <div className="rounded-[10px] bg-white p-4  sm:p-6">
          <time dateTime="2022-10-10" className="block text-xs text-gray-500">
            10th Oct 2022
          </time>

          <a href="#">
            <h3 className="mt-0.5 text-lg font-medium text-gray-900">
              How to center an element using JavaScript and jQuery
            </h3>
          </a>

          <div className="mt-4 flex flex-wrap gap-1">
            <span
              className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600"
            >
              Snippet
            </span>

            <span
              className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600"
            >
              JavaScript
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ResourceCard3;