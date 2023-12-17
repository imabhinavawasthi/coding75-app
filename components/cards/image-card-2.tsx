import { Button } from "../ui/button";

const ImageCard2 = ({title, link, image_link, button_text}) => {
    return (
        <div>
            {/* outline outline-indigo-600 p-3 rounded-lg outline-2 hover:outline-dashed */}
            <article className="group outline outline-slate-200 p-3 rounded-lg outline-2 hover:outline-dashed">
            <a href={link}>
                {image_link&&<img
                    alt={title}
                    src={image_link}
                    className="p-3 object-fill h-48 w-full rounded-xl shadow-xl"
                />}
                

                <div className="p-4 flex justify-center">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    
                    <Button className="ml-3 bg-indigo-600 hover:bg-indigo-700">{button_text}</Button>
                    
                    

                    {/* <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus
                        pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis quidem,
                        mollitia itaque minus soluta, voluptates neque explicabo tempora nisi culpa eius atque
                        dignissimos. Molestias explicabo corporis voluptatem?
                    </p> */}
                </div>
                </a>
            </article>
        </div>
    );
}

export default ImageCard2;