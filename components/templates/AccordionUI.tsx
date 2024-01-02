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
                <AccordionTrigger className="text-xl text-left">{title}</AccordionTrigger>
                <AccordionContent className="text-md">
                    {body}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
