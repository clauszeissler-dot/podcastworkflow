import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/data/faqData';

const FAQ = () => {
  const { language, t } = useLanguage();

  return (
    <section id="faq" className="relative py-20">
      <div className="container px-4 max-w-3xl">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-12">
          <span className="text-gradient-secondary">{t('faq.title')}</span>
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`faq-${index}`}
              className="glass-card px-6 border-white/10 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left hover:text-primary transition-colors py-5 font-medium">
                {faq.question[language]}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                {faq.answer[language]}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
