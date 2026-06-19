import { useLanguage } from '@/contexts/LanguageContext';

export const Impressum = () => {
  const { language } = useLanguage();

  const content = {
    de: {
      title: 'Impressum',
      text: `
        <h3>Angaben gemäß § 5 DDG</h3>
        <p>KI AffAIrs - Claus Zeißler<br/>
        c/o Online-Impressum.de #5748<br/>
        Europaring 90<br/>
        53757 Sankt Augustin</p>
        
        <p><a href="https://mein.online-impressum.de/ki-affairs/" target="_blank" rel="noopener noreferrer">Vollständiges Impressum ansehen</a></p>
        
        <h3>Kontakt</h3>
        <p>E-Mail: <a href="mailto:info@kiaffairs-podcast.de">info@kiaffairs-podcast.de</a><br/>
        <a href="#contact">Kontaktformular</a></p>
        
        <h3>Zuständige Regulierungs- und Aufsichtsbehörde</h3>
        <p>Landesanstalt für Medien Nordrhein-Westfalen<br/>
        Sitz: Deutschland</p>
        
        <h3>Umsatzsteuer</h3>
        <p>Kein Umsatzsteuerausweis aufgrund Anwendung der Kleinunternehmerregelung gemäß § 19 UStG.</p>
        
        <h3>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h3>
        <p>Claus Zeißler<br/>
        c/o Online-Impressum.de #5748<br/>
        Europaring 90<br/>
        53757 Sankt Augustin</p>
        
        <h3>EU-Streitschlichtung</h3>
        <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>. 
        Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
        
        <h3>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h3>
        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      `,
    },
    en: {
      title: 'Legal Notice',
      text: `
        <h3>Legal Information pursuant to § 5 DDG (German Digital Services Act)</h3>
        <p>AI AffAIrs - Claus Zeißler<br/>
        c/o Online-Impressum.de #5748<br/>
        Europaring 90<br/>
        53757 Sankt Augustin, Germany</p>
        
        <p><a href="https://mein.online-impressum.de/ki-affairs/" target="_blank" rel="noopener noreferrer">View complete legal notice</a></p>
        
        <h3>Contact</h3>
        <p>Email: <a href="mailto:info@kiaffairs-podcast.de">info@kiaffairs-podcast.de</a><br/>
        <a href="#contact">Contact Form</a></p>
        
        <h3>Regulatory Authority</h3>
        <p>State Media Authority of North Rhine-Westphalia (Landesanstalt für Medien NRW)<br/>
        Location: Germany</p>
        
        <h3>VAT Information</h3>
        <p>No VAT is charged as we operate under the small business exemption according to § 19 UStG (German VAT Act).</p>
        
        <h3>Responsible for Content pursuant to § 18 para. 2 MStV (German Interstate Media Treaty)</h3>
        <p>Claus Zeißler<br/>
        c/o Online-Impressum.de #5748<br/>
        Europaring 90<br/>
        53757 Sankt Augustin, Germany</p>
        
        <h3>EU Online Dispute Resolution</h3>
        <p>The European Commission provides a platform for online dispute resolution (ODR): 
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>. 
        Our email address can be found in the contact section above.</p>
        
        <h3>Consumer Dispute Resolution</h3>
        <p>We are neither willing nor obligated to participate in dispute resolution proceedings before a consumer arbitration board.</p>
      `,
    },
    tl: {
      title: 'Legal Notice',
      text: `
        <h3>Impormasyon Pangkorporasyon ayon sa § 5 DDG (German Digital Services Act)</h3>
        <p>AI AffAIrs - Claus Zeißler<br/>
        c/o Online-Impressum.de #5748<br/>
        Europaring 90<br/>
        53757 Sankt Augustin, Germany</p>
        
        <p><a href="https://mein.online-impressum.de/ki-affairs/" target="_blank" rel="noopener noreferrer">Tingnan ang kumpletong legal notice</a></p>
        
        <h3>Makipag-ugnayan</h3>
        <p>Email: <a href="mailto:info@kiaffairs-podcast.de">info@kiaffairs-podcast.de</a><br/>
        <a href="#contact">Form ng Pakikipag-ugnayan</a></p>
        
        <h3>Awtoridad na Nangangasiwa</h3>
        <p>State Media Authority of North Rhine-Westphalia (Landesanstalt für Medien NRW)<br/>
        Lokasyon: Germany</p>
        
        <h3>Impormasyon tungkol sa VAT</h3>
        <p>Hindi sinisingil ang VAT dahil ang operasyon namin ay nasa ilalim ng small business exemption ayon sa § 19 UStG (German VAT Act).</p>
        
        <h3>Responsable sa Nilalaman ayon sa § 18 para. 2 MStV (German Interstate Media Treaty)</h3>
        <p>Claus Zeißler<br/>
        c/o Online-Impressum.de #5748<br/>
        Europaring 90<br/>
        53757 Sankt Augustin, Germany</p>
        
        <h3>EU Online Dispute Resolution</h3>
        <p>Nagbibigay ang European Commission ng platform para sa online dispute resolution (ODR): 
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>. 
        Makikita ang aming email address sa seksyon ng pakikipag-ugnayan sa itaas.</p>
        
        <h3>Resolusyon ng Hindi Pagkakasundo ng Consumer</h3>
        <p>Hindi kami handang lumahok o obligadong lumahok sa mga proseso ng pagresolba ng hindi pagkakasundo sa harap ng consumer arbitration board.</p>
      `,
    },
  };

  return (
    <section id="impressum" className="py-20 bg-muted/20">
      <div className="container px-4 max-w-3xl">
        <h2 className="font-display text-3xl font-bold mb-8 text-gradient-primary">
          {content[language].title}
        </h2>
        <div 
          className="glass-card p-8 prose prose-invert prose-sm max-w-none [&_h3]:text-primary [&_h3]:font-display [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:text-muted-foreground [&_ul]:text-muted-foreground [&_li]:mb-2 [&_a]:text-primary [&_a]:hover:underline"
          dangerouslySetInnerHTML={{ __html: content[language].text }}
        />
      </div>
    </section>
  );
};

export const Datenschutz = () => {
  const { language } = useLanguage();

  const content = {
    de: {
      title: 'Datenschutzerklärung',
      text: `
        <h3>1. Datenschutz auf einen Blick</h3>
        <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
        
        <h3>2. Verantwortliche Stelle</h3>
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br/>
        Claus Zeißler<br/>
        c/o Online-Impressum.de #5748<br/>
        Europaring 90<br/>
        53757 Sankt Augustin<br/>
        E-Mail: <a href="mailto:info@kiaffairs-podcast.de">info@kiaffairs-podcast.de</a></p>
        
        <h3>3. Hosting und Infrastruktur (Hostinger & Lovable)</h3>
        <p>Unsere Website nutzt die Dienste von Hostinger und Lovable zur Bereitstellung und Auslieferung der Inhalte.</p>
        <ul>
          <li><strong>Domain & DNS:</strong> Die Domain wird verwaltet durch die Hostinger International Ltd. (61 Lordou Vironos Street, 6023 Larnaca, Zypern). Hierbei werden technisch notwendige Logdaten (z. B. IP-Adressen) verarbeitet.</li>
          <li><strong>Plattform & Publishing:</strong> Die Erstellung und Veröffentlichung der Website erfolgt über Lovable (Lovable Labs AB, Stockholm, Schweden). Lovable stellt die technische Infrastruktur bereit.</li>
          <li><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse an einer sicheren Bereitstellung). Wir nutzen Standardvertragsklauseln für Datentransfers in Drittstaaten.</li>
        </ul>
        
        <h3>4. Analyse-Tools</h3>
        <h4>4.1 Plausible.io</h4>
        <p>Wir nutzen Plausible Analytics (Plausible Insights OÜ, Estland).</p>
        <ul>
          <li><strong>Zweck:</strong> Statistische Auswertung ohne Cookies. Es werden keine personenbezogenen Daten gespeichert; IP-Adressen werden vollständig anonymisiert.</li>
          <li><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.</li>
        </ul>
        
        <h4>4.2 Google Analytics 4</h4>
        <p>Wir nutzen Google Analytics 4 (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland).</p>
        <ul>
          <li><strong>Zweck:</strong> Analyse des Nutzerverhaltens zur Verbesserung unseres Angebots.</li>
          <li><strong>Datenverarbeitung:</strong> IP-Anonymisierung ist aktiviert. Daten werden auf Servern in der EU verarbeitet.</li>
          <li><strong>Cookies:</strong> Google Analytics setzt Cookies nur mit Ihrer ausdrücklichen Einwilligung über unseren Cookie-Banner.</li>
          <li><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).</li>
          <li><strong>Widerruf:</strong> Sie können Ihre Einwilligung jederzeit über den Cookie-Button unten rechts widerrufen.</li>
          <li><strong>Weitere Informationen:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Datenschutzerklärung</a></li>
        </ul>
        
        <h3>5. Newsletter (Resend)</h3>
        <p>Wenn Sie unseren Newsletter abonnieren, verwenden wir das Double-Opt-In-Verfahren.</p>
        <ul>
          <li><strong>Dienstleister:</strong> Wir nutzen Resend (Resend Labs Inc., USA). Ihre Daten werden auf Basis Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) verarbeitet.</li>
          <li><strong>Erfolgskontrolle:</strong> Die Newsletter enthalten einen „web-beacon" (Zählpixel). Dabei werden technische Informationen und Ihr Leseverhalten (Öffnung, Klicks) erfasst, um unser Angebot zu optimieren.</li>
          <li><strong>Widerruf:</strong> Die Abmeldung ist jederzeit über den Link im Newsletter möglich.</li>
        </ul>
        
        <h3>6. Social Media & Externe Plattformen</h3>
        <p>Wir unterhalten Profile auf Facebook, Instagram, YouTube, X, Spotify, Apple Podcasts und Amazon Music.</p>
        <ul>
          <li><strong>Gemeinsame Verantwortlichkeit:</strong> Bei Meta-Diensten (FB/IG) besteht eine gemeinsame Verantwortlichkeit nach Art. 26 DSGVO für Insights-Daten.</li>
          <li><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO bzw. Art. 6 Abs. 1 lit. a DSGVO bei Interaktion mit eingebetteten Inhalten (z. B. Playern).</li>
        </ul>
        
        <h3>7. SSL-/TLS-Verschlüsselung</h3>
        <p>Diese Seite nutzt eine SSL- bzw. TLS-Verschlüsselung, um die Übertragung vertraulicher Inhalte zu schützen.</p>
        
        <h3>8. Ihre Rechte</h3>
        <p>Sie haben jederzeit das Recht auf:</p>
        <ul>
          <li>Auskunft (Art. 15 DSGVO)</li>
          <li>Berichtigung (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Widerspruch (Art. 21 DSGVO)</li>
          <li>Beschwerde bei einer Aufsichtsbehörde</li>
        </ul>
      `,
    },
    en: {
      title: 'Privacy Policy',
      text: `
        <h3>1. Privacy at a Glance</h3>
        <p>The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to personally identify you.</p>
        
        <h3>2. Data Controller</h3>
        <p>The party responsible for data processing on this website is:<br/>
        Claus Zeißler<br/>
        c/o Online-Impressum.de #5748<br/>
        Europaring 90<br/>
        53757 Sankt Augustin, Germany<br/>
        Email: <a href="mailto:info@kiaffairs-podcast.de">info@kiaffairs-podcast.de</a></p>
        
        <h3>3. Hosting and Infrastructure (Hostinger & Lovable)</h3>
        <p>Our website uses services from Hostinger and Lovable for content delivery.</p>
        <ul>
          <li><strong>Domain & DNS:</strong> The domain is managed by Hostinger International Ltd. (61 Lordou Vironos Street, 6023 Larnaca, Cyprus). Technically necessary log data (e.g., IP addresses) is processed.</li>
          <li><strong>Platform & Publishing:</strong> Website creation and publication is done through Lovable (Lovable Labs AB, Stockholm, Sweden). Lovable provides the technical infrastructure.</li>
          <li><strong>Legal Basis:</strong> Art. 6 para. 1 lit. f GDPR (Legitimate interest in secure provision). We use Standard Contractual Clauses for data transfers to third countries.</li>
        </ul>
        
        <h3>4. Analytics Tools</h3>
        <h4>4.1 Plausible.io</h4>
        <p>We use Plausible Analytics (Plausible Insights OÜ, Estonia).</p>
        <ul>
          <li><strong>Purpose:</strong> Statistical analysis without cookies. No personal data is stored; IP addresses are fully anonymized.</li>
          <li><strong>Legal Basis:</strong> Art. 6 para. 1 lit. f GDPR.</li>
        </ul>
        
        <h4>4.2 Google Analytics 4</h4>
        <p>We use Google Analytics 4 (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland).</p>
        <ul>
          <li><strong>Purpose:</strong> Analysis of user behavior to improve our offering.</li>
          <li><strong>Data Processing:</strong> IP anonymization is enabled. Data is processed on servers in the EU.</li>
          <li><strong>Cookies:</strong> Google Analytics only sets cookies with your explicit consent via our cookie banner.</li>
          <li><strong>Legal Basis:</strong> Art. 6 para. 1 lit. a GDPR (Consent).</li>
          <li><strong>Revocation:</strong> You can revoke your consent at any time via the cookie button in the bottom right corner.</li>
          <li><strong>More Information:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
        </ul>
        
        <h3>5. Newsletter (Resend)</h3>
        <p>When you subscribe to our newsletter, we use the double opt-in procedure.</p>
        <ul>
          <li><strong>Service Provider:</strong> We use Resend (Resend Labs Inc., USA). Your data is processed based on your consent (Art. 6 para. 1 lit. a GDPR).</li>
          <li><strong>Performance Tracking:</strong> The newsletters contain a "web beacon" (tracking pixel). Technical information and your reading behavior (opens, clicks) are recorded to optimize our offering.</li>
          <li><strong>Revocation:</strong> Unsubscription is possible at any time via the link in the newsletter.</li>
        </ul>
        
        <h3>6. Social Media & External Platforms</h3>
        <p>We maintain profiles on Facebook, Instagram, YouTube, X, Spotify, Apple Podcasts, and Amazon Music.</p>
        <ul>
          <li><strong>Joint Responsibility:</strong> For Meta services (FB/IG), there is joint responsibility according to Art. 26 GDPR for Insights data.</li>
          <li><strong>Legal Basis:</strong> Art. 6 para. 1 lit. f GDPR or Art. 6 para. 1 lit. a GDPR for interaction with embedded content (e.g., players).</li>
        </ul>
        
        <h3>7. SSL/TLS Encryption</h3>
        <p>This site uses SSL or TLS encryption to protect the transmission of confidential content.</p>
        
        <h3>8. Your Rights</h3>
        <p>You have the right at any time to:</p>
        <ul>
          <li>Access (Art. 15 GDPR)</li>
          <li>Rectification (Art. 16 GDPR)</li>
          <li>Erasure (Art. 17 GDPR)</li>
          <li>Object (Art. 21 GDPR)</li>
          <li>Lodge a complaint with a supervisory authority</li>
        </ul>
      `,
    },
    tl: {
      title: 'Patakaran sa Privacy',
      text: `
        <h3>1. Privacy sa Isang Sulyap</h3>
        <p>Ang sumusunod na impormasyon ay nagbibigay ng simpleng pangkalahatang-ideya kung ano ang nangyayari sa iyong personal na data kapag binisita mo ang website na ito. Ang personal na data ay anumang data na maaaring gamitin upang personal na makilala ka.</p>
        
        <h3>2. Responsable sa Data</h3>
        <p>Ang responsable sa pagproseso ng data sa website na ito ay:<br/>
        Claus Zeißler<br/>
        c/o Online-Impressum.de #5748<br/>
        Europaring 90<br/>
        53757 Sankt Augustin, Germany<br/>
        Email: <a href="mailto:info@kiaffairs-podcast.de">info@kiaffairs-podcast.de</a></p>
        
        <h3>3. Hosting at Infrastructure (Hostinger & Lovable)</h3>
        <p>Ang aming website ay gumagamit ng mga serbisyo mula sa Hostinger at Lovable para sa paghahatid ng nilalaman.</p>
        <ul>
          <li><strong>Domain & DNS:</strong> Ang domain ay pinamamahalaan ng Hostinger International Ltd. (61 Lordou Vironos Street, 6023 Larnaca, Cyprus). Ang teknikal na kinakailangang log data (hal., IP addresses) ay pinoproseso.</li>
          <li><strong>Platform & Publishing:</strong> Ang paglikha at pag-publish ng website ay ginagawa sa pamamagitan ng Lovable (Lovable Labs AB, Stockholm, Sweden). Nagbibigay ang Lovable ng teknikal na imprastraktura.</li>
          <li><strong>Legal na Batayan:</strong> Art. 6 para. 1 lit. f GDPR (Lehitimong interes sa secure na pagbibigay). Gumagamit kami ng Standard Contractual Clauses para sa data transfers sa third countries.</li>
        </ul>
        
        <h3>4. Analytics Tools</h3>
        <h4>4.1 Plausible.io</h4>
        <p>Gumagamit kami ng Plausible Analytics (Plausible Insights OÜ, Estonia).</p>
        <ul>
          <li><strong>Layunin:</strong> Statistical analysis nang walang cookies. Walang personal na data na naka-imbak; ang mga IP address ay ganap na anonymized.</li>
          <li><strong>Legal na Batayan:</strong> Art. 6 para. 1 lit. f GDPR.</li>
        </ul>
        
        <h4>4.2 Google Analytics 4</h4>
        <p>Gumagamit kami ng Google Analytics 4 (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland).</p>
        <ul>
          <li><strong>Layunin:</strong> Pagsusuri ng user behavior upang mapabuti ang aming alok.</li>
          <li><strong>Data Processing:</strong> Ang IP anonymization ay naka-enable. Ang data ay pinoproseso sa mga server sa EU.</li>
          <li><strong>Cookies:</strong> Ang Google Analytics ay naglalagay lamang ng cookies sa iyong tahasang pahintulot sa pamamagitan ng aming cookie banner.</li>
          <li><strong>Legal na Batayan:</strong> Art. 6 para. 1 lit. a GDPR (Pahintulot).</li>
          <li><strong>Revocation:</strong> Maaari mong bawiin ang iyong pahintulot anumang oras sa pamamagitan ng cookie button sa kanang ibabang bahagi.</li>
          <li><strong>Karagdagang Impormasyon:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
        </ul>
        
        <h3>5. Newsletter (Resend)</h3>
        <p>Kapag nag-subscribe ka sa aming newsletter, gumagamit kami ng double opt-in procedure.</p>
        <ul>
          <li><strong>Service Provider:</strong> Gumagamit kami ng Resend (Resend Labs Inc., USA). Ang iyong data ay pinoproseso batay sa iyong pahintulot (Art. 6 para. 1 lit. a GDPR).</li>
          <li><strong>Performance Tracking:</strong> Ang mga newsletter ay naglalaman ng "web beacon" (tracking pixel). Ang teknikal na impormasyon at ang iyong reading behavior (opens, clicks) ay nire-record upang i-optimize ang aming alok.</li>
          <li><strong>Revocation:</strong> Ang pag-unsubscribe ay posible anumang oras sa pamamagitan ng link sa newsletter.</li>
        </ul>
        
        <h3>6. Social Media & External Platforms</h3>
        <p>Nagpapanatili kami ng mga profile sa Facebook, Instagram, YouTube, X, Spotify, Apple Podcasts, at Amazon Music.</p>
        <ul>
          <li><strong>Joint Responsibility:</strong> Para sa Meta services (FB/IG), mayroong joint responsibility ayon sa Art. 26 GDPR para sa Insights data.</li>
          <li><strong>Legal na Batayan:</strong> Art. 6 para. 1 lit. f GDPR o Art. 6 para. 1 lit. a GDPR para sa interaksyon sa naka-embed na nilalaman (hal., players).</li>
        </ul>
        
        <h3>7. SSL/TLS Encryption</h3>
        <p>Ang site na ito ay gumagamit ng SSL o TLS encryption upang protektahan ang transmission ng kumpidensyal na nilalaman.</p>
        
        <h3>8. Ang Iyong mga Karapatan</h3>
        <p>Mayroon kang karapatan anumang oras na:</p>
        <ul>
          <li>Access (Art. 15 GDPR)</li>
          <li>Rectification (Art. 16 GDPR)</li>
          <li>Erasure (Art. 17 GDPR)</li>
          <li>Object (Art. 21 GDPR)</li>
          <li>Mag-file ng reklamo sa isang supervisory authority</li>
        </ul>
      `,
    },
  };

  return (
    <section id="datenschutz" className="py-20">
      <div className="container px-4 max-w-3xl">
        <h2 className="font-display text-3xl font-bold mb-8 text-gradient-secondary">
          {content[language].title}
        </h2>
        <div 
          className="glass-card p-8 prose prose-invert prose-sm max-w-none [&_h3]:text-secondary [&_h3]:font-display [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:text-muted-foreground [&_ul]:text-muted-foreground [&_li]:mb-1 [&_a]:text-secondary [&_a]:hover:underline"
          dangerouslySetInnerHTML={{ __html: content[language].text }}
        />
      </div>
    </section>
  );
};

// Default export for lazy loading
const LegalPages = () => (
  <>
    <Impressum />
    <Datenschutz />
  </>
);

export default LegalPages;
