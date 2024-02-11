import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionUI({title,body}) {
    return (
        <Accordion defaultValue="item-1" type="single"  className="w-full" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger className="lg:text-2xl md:text-xl font-bold text-lg text-left hover:no-underline hover:text-indigo-600">{title}</AccordionTrigger>
                <AccordionContent>
                    {body}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
