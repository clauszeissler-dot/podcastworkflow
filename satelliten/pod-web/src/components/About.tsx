import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Briefcase, GraduationCap } from 'lucide-react';
import portraitImage from '@/assets/claus-zeissler-portrait-small.webp';
import speakingImage from '@/assets/speaking-ai-training-institute-small.webp';

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 relative" aria-labelledby="about-title">
      <div className="container mx-auto px-4">
        <h2 id="about-title" className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-gradient-primary">
          {t('about.title')}
        </h2>

        <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-2xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-2 ring-primary/50 shadow-glow flex-shrink-0">
              <img
                src={portraitImage}
                alt="Claus Zeißler"
                className="w-full h-full object-cover object-top"
                width={128}
                height={128}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-display font-bold text-foreground">
                Claus Zeißler
              </h3>
              <p className="text-primary font-medium mt-1">
                {t('about.role')}
              </p>
              <p className="text-muted-foreground mt-2">
                {t('about.tagline')}
              </p>
            </div>
          </div>

          {/* Origin Story */}
          <div className="mb-8">
            <p className="text-foreground/90 leading-relaxed">
              {t('about.origin')}
            </p>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <p className="text-foreground/90 leading-relaxed">
              {t('about.bio')}
            </p>
          </div>

          {/* Speaking Journey */}
          <div className="mb-8 overflow-hidden">
            <figure className="float-left mr-6 mb-2 mt-1 w-48 md:w-64 overflow-hidden rounded-xl">
              <img
                src={speakingImage}
                alt="Claus Zeißler beim NotebookLM Vortrag, AI Training Institute Hamburg"
                className="w-full h-auto object-cover rounded-xl"
                width={256}
                height={192}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mt-2 text-xs text-muted-foreground text-center">
                {t('about.speakingCaption')}
              </figcaption>
            </figure>
            <p className="text-foreground/90 leading-relaxed">
              {t('about.speakingIntro')} {t('about.speakingEvent1')}
            </p>
          </div>

          {/* Credentials */}
          <div className="border-t border-white/10 pt-8">
            <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              {t('about.credentialsTitle')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Award className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <span className="text-foreground/80">{t('about.credential1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <span className="text-foreground/80">{t('about.credential2')}</span>
              </li>
              <li className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <span className="text-foreground/80">{t('about.credential3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
