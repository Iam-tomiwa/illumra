"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQ_QUERYResult } from "@/sanity.types";
import { sanitizeSanityData } from "@/sanity/lib/utils";
import PortableText from "@/components/portable-text";
import { PortableTextBlock } from "next-sanity";

type FaqSectionProps = {
  faq?: FAQ_QUERYResult;
  showHeading?: boolean;
};

export default function FaqSection({
  showHeading = true,
  faq,
}: FaqSectionProps) {
  const title = faq?.title;
  const description = faq?.description;
  const items = faq?.items;

  const gettingStartedFaqs =
    items?.filter(
      (item) => sanitizeSanityData(item?.group) === "gettingStarted"
    ) || [];
  const generalFaqs =
    items?.filter((item) => sanitizeSanityData(item?.group) === "faq") || [];

  const hasGettingStarted = gettingStartedFaqs.length > 0;
  const hasGeneralFaqs = generalFaqs.length > 0;

  // Don't render if no FAQs
  if (!hasGettingStarted && !hasGeneralFaqs) {
    return null;
  }

  return (
    <section id="faq" className="pt-16 pb-8 bg-background">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        {showHeading && (
          <>
            <h2 className="text-5xl font-bold mb-4">{title}</h2>
            <p className="text-muted-foreground mb-8">{description}</p>
          </>
        )}

        <Tabs
          defaultValue={hasGettingStarted ? "getting-started" : "faq"}
          className="w-full"
        >
          {/* Tabs Header */}
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            {hasGettingStarted && (
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            )}
            {hasGeneralFaqs && <TabsTrigger value="faq">FAQ</TabsTrigger>}
          </TabsList>

          {/* Getting Started Tab */}
          {hasGettingStarted && (
            <TabsContent value="getting-started">
              <Accordion type="single" collapsible className="w-full text-left">
                {gettingStartedFaqs.map((item, index) => (
                  <AccordionItem key={index} value={`getting-started-${index}`}>
                    <AccordionTrigger>{item?.question}</AccordionTrigger>
                    <AccordionContent>
                      <PortableText
                        value={item?.answer as PortableTextBlock[]}
                        className="text-sm text-foreground max-w-full"
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          )}

          {/* FAQ Tab */}
          {hasGeneralFaqs && (
            <TabsContent value="faq">
              <Accordion type="single" collapsible className="w-full text-left">
                {generalFaqs.map((item, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger>{item?.question}</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      <PortableText
                        className="text-sm text-foreground max-w-full"
                        value={item?.answer as PortableTextBlock[]}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </section>
  );
}
