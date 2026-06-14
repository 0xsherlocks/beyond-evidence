import { getResearchPage } from '@/src/sanity/queries';
import { getImageUrl } from '@/src/sanity/client';
import ResearchClient from './ResearchClient';

const FALLBACK = {
  heroTitle: 'Research',
  heroSubtitle: 'Everything students need to find, read, organize, write, and publish research papers.',
  roadmapTitle: 'Research Roadmap',
  roadmapDescription: 'Follow this proven workflow from topic selection to publication.',
  roadmapImageUrl: '',
  roadmapSteps: [
    { title: 'Choose Topic', description: 'Identify a focused, researchable question in your area of interest.', iconName: 'Lightbulb', link: '#writing-guides' },
    { title: 'Literature Review', description: 'Survey existing research to understand the current state of knowledge.', iconName: 'BookOpen', link: '#find-papers' },
    { title: 'Find Papers', description: 'Use academic databases and search engines to locate relevant studies.', iconName: 'Search', link: '#find-papers' },
    { title: 'Read & Annotate', description: 'Critically read papers, highlight key findings, and take structured notes.', iconName: 'Highlighter', link: '#ai-tools' },
    { title: 'Organize References', description: 'Use reference managers to catalog and tag your sources systematically.', iconName: 'FolderOpen', link: '#reference-mgmt' },
    { title: 'Write Paper', description: 'Draft your research following the standard IMRaD structure.', iconName: 'PenTool', link: '#writing-guides' },
    { title: 'Citation Check', description: 'Ensure every claim is properly cited in your chosen citation style.', iconName: 'CheckSquare', link: '#citation-tools' },
    { title: 'Journal Selection', description: 'Find the right journal that matches your topic and scope.', iconName: 'Target', link: '#forensic-resources' },
    { title: 'Publication', description: 'Submit your manuscript and navigate the peer-review process.', iconName: 'Send', link: '#mentorship' },
  ],
  paperDbTitle: 'Find Research Papers',
  paperDbDescription: 'Access millions of academic papers through these trusted databases and search engines.',
  paperDbImageUrl: '',
  paperDatabases: [
    { name: 'Google Scholar', description: 'The largest free academic search engine. Best for broad initial searches across all disciplines.', url: 'https://scholar.google.com', color: '#4285F4' },
    { name: 'Semantic Scholar', description: 'AI-powered academic search with citation context and influential citations. Great for finding key papers.', url: 'https://www.semanticscholar.org', color: '#1857B6' },
    { name: 'Scopus', description: 'Premium abstract and citation database by Elsevier. Best for systematic reviews and bibliometrics.', url: 'https://www.scopus.com', color: '#E9711C' },
    { name: 'PubMed', description: 'Essential for biomedical and life sciences research. Covers 35M+ citations from MEDLINE and NLM.', url: 'https://pubmed.ncbi.nlm.nih.gov', color: '#326599' },
    { name: 'BASE', description: 'Bielefeld Academic Search Engine indexes 300M+ documents from 10,000+ open access sources.', url: 'https://www.base-search.net', color: '#00457C' },
    { name: 'CORE', description: 'Aggregates open access research outputs from repositories worldwide. 200M+ papers.', url: 'https://core.ac.uk', color: '#FF6B35' },
    { name: 'OpenAlex', description: 'Free, open catalog of the global research system with 250M+ works. Great for data analysis.', url: 'https://openalex.org', color: '#A855F7' },
    { name: 'Dimensions', description: 'Links publications, grants, patents, clinical trials, and policy documents in one platform.', url: 'https://www.dimensions.ai', color: '#5E60CE' },
  ],
  forensicTitle: 'Forensic Science Resources',
  forensicDescription: 'Authoritative sources specifically for forensic science research and standards.',
  forensicImageUrl: '',
  forensicResources: [
    { name: 'NIST Forensics', description: 'National standards, reference materials, and research programs for forensic science disciplines.', url: 'https://www.nist.gov/forensic-science', color: '#003366' },
    { name: 'NIJ Forensics', description: 'National Institute of Justice research, funding opportunities, and forensic science publications.', url: 'https://nij.ojp.gov/topics/forensics', color: '#1B365D' },
    { name: 'INTERPOL Forensics', description: 'International forensic science resources, best practices, and digital forensics guidelines.', url: 'https://www.interpol.int/How-we-work/Forensics', color: '#003DA5' },
    { name: 'FBI Publications', description: 'FBI Laboratory reports, forensic examination guidelines, and criminal justice research.', url: 'https://www.fbi.gov/investigate', color: '#003366' },
    { name: 'Forensic Science International', description: 'Premier peer-reviewed journal covering all areas of forensic science practice and research.', url: 'https://www.sciencedirect.com/journal/forensic-science-international', color: '#FF6900' },
    { name: 'Journal of Forensic Sciences', description: 'Official publication of the American Academy of Forensic Sciences. Leading forensic research.', url: 'https://onlinelibrary.wiley.com/journal/15564029', color: '#642F8E' },
    { name: 'NCBI Bookshelf', description: 'Free online archive of biomedical and forensic science textbooks and reference works.', url: 'https://www.ncbi.nlm.nih.gov/books', color: '#20603D' },
    { name: 'HathiTrust', description: 'Digital library with millions of titles from major research libraries worldwide.', url: 'https://www.hathitrust.org', color: '#862633' },
  ],
  aiToolsTitle: 'AI Tools for Research',
  aiToolsDescription: 'Leverage artificial intelligence to accelerate literature reviews, summarize papers, and discover connections.',
  aiToolsImageUrl: '',
  aiTools: [
    { name: 'Elicit', description: 'AI research assistant that finds relevant papers, extracts key claims, and summarizes findings.', url: 'https://elicit.com', color: '#6366F1' },
    { name: 'SciSpace', description: 'Read, understand, and extract data from research papers with AI-powered explanations.', url: 'https://typeset.io', color: '#3B82F6' },
    { name: 'Consensus', description: 'Search engine that uses AI to extract findings from scientific research papers.', url: 'https://consensus.app', color: '#2563EB' },
    { name: 'Connected Papers', description: 'Visual tool to explore academic papers in a graph and find related work efficiently.', url: 'https://www.connectedpapers.com', color: '#10B981' },
    { name: 'Research Rabbit', description: 'Discover related papers, visualize research networks, and get personalized recommendations.', url: 'https://www.researchrabbit.ai', color: '#F59E0B' },
    { name: 'Perplexity', description: 'AI-powered answer engine that provides sourced, up-to-date academic research summaries.', url: 'https://www.perplexity.ai', color: '#22D3EE' },
    { name: 'NotebookLM', description: 'Google AI tool that helps you analyze documents, take notes, and generate insights.', url: 'https://notebooklm.google.com', color: '#4285F4' },
  ],
  refManagerTitle: 'Reference Management',
  refManagerDescription: 'Save papers, generate citations, and manage your bibliography with these essential tools.',
  refManagerImageUrl: '',
  referenceManagers: [
    { name: 'Zotero', description: 'Free, open-source reference manager. Best browser integration and group collaboration features.', url: 'https://www.zotero.org', color: '#CC2936' },
    { name: 'Mendeley', description: 'Reference manager with built-in PDF reader, annotation tools, and academic social network.', url: 'https://www.mendeley.com', color: '#B71C1C' },
    { name: 'EndNote', description: 'Industry-standard reference manager for large research projects and institutional use.', url: 'https://endnote.com', color: '#2196F3' },
    { name: 'JabRef', description: 'Free, open-source manager specialized for BibTeX/LaTeX users. Great for computer science papers.', url: 'https://www.jabref.org', color: '#2E7D32' },
  ],
  citationTitle: 'Citation Generators',
  citationDescription: 'Generate accurate citations instantly in APA, MLA, Chicago, Harvard, and more.',
  citationImageUrl: '',
  citationGenerators: [
    { name: 'Scribbr', description: 'Highly accurate citation generator with plagiarism checker. Supports 20+ styles.', url: 'https://www.scribbr.com/citation/generator/', color: '#1E88E5', formats: ['APA', 'MLA', 'Chicago', 'Harvard'] },
    { name: 'MyBib', description: 'Fast, free citation generator. Clean interface with auto-cite from URL or DOI.', url: 'https://www.mybib.com', color: '#00BCD4', formats: ['APA', 'MLA', 'Chicago', 'Harvard'] },
    { name: 'CiteThisForMe', description: 'Comprehensive citation tool by Chegg. Supports books, websites, and journals.', url: 'https://www.citethisforme.com', color: '#FF7043', formats: ['APA', 'MLA', 'Chicago', 'Harvard'] },
  ],
  writingGuideTitle: 'Research Writing Guides',
  writingGuideDescription: 'Master each section of a research paper with expert guidance, tips, and common pitfalls to avoid.',
  writingGuideImageUrl: '',
  writingGuides: [
    { heading: 'How to Write an Abstract', explanation: 'An abstract is a concise summary (150-300 words) of your entire paper. It should state the purpose, methods, key findings, and conclusion. Write it last, after finishing your paper.', tips: ['Keep it under 300 words', 'Include keywords for searchability', 'Write in past tense for completed research', 'Avoid citations and abbreviations'], mistakes: ['Writing it before the paper is done', 'Including information not in the paper', 'Making it too vague or too detailed'] },
    { heading: 'How to Write an Introduction', explanation: 'The introduction moves from general context to your specific research question. It should establish the topic importance, review key literature briefly, identify the research gap, and state your objectives.', tips: ['Use the funnel approach: broad to specific', 'Clearly state your research question', 'End with a brief outline of the paper structure'], mistakes: ['Making it too long or too short', 'Not clearly stating the research gap', 'Including results or conclusions'] },
    { heading: 'How to Write a Literature Review', explanation: 'A literature review synthesizes existing research on your topic. It identifies patterns, themes, debates, and gaps. Organize thematically rather than chronologically for stronger analysis.', tips: ['Group sources by themes, not authors', 'Be critical, not just descriptive', 'Show how your work fills a gap', 'Use recent sources (last 5-10 years)'], mistakes: ['Simply summarizing each paper', 'Ignoring contradicting studies', 'Not connecting to your research question'] },
    { heading: 'How to Write Methodology', explanation: 'The methodology section explains exactly how you conducted your research. It should be detailed enough for someone to replicate your study. Include research design, sampling, data collection, and analysis methods.', tips: ['Justify your chosen methods', 'Address ethical considerations', 'Be specific about tools and procedures', 'Explain any limitations'], mistakes: ['Being too vague about procedures', 'Not justifying methodology choices', 'Omitting ethical approval details'] },
    { heading: 'How to Write Results', explanation: 'Present your findings objectively without interpretation. Use tables, figures, and statistical analysis. Report all results, including negative or unexpected findings.', tips: ['Use tables and figures for complex data', 'Report statistical significance values', 'Present findings in logical order', 'Avoid interpreting results here'], mistakes: ['Mixing results with discussion', 'Only reporting positive findings', 'Presenting raw data without summarization'] },
    { heading: 'How to Write Discussion', explanation: 'Interpret your results in the context of existing research. Explain what the findings mean, how they compare to previous studies, and what implications they have.', tips: ['Start with your most important finding', 'Compare with existing literature', 'Discuss practical and theoretical implications', 'Acknowledge limitations honestly'], mistakes: ['Repeating results without interpretation', 'Overstating the significance of findings', 'Ignoring contradictory evidence'] },
    { heading: 'How to Write a Conclusion', explanation: 'Summarize the key findings and their significance. Restate how the research addresses the initial question. Suggest future research directions.', tips: ['Keep it concise and focused', 'Highlight the contribution of your research', 'Suggest specific future research directions', 'End with a strong closing statement'], mistakes: ['Introducing new information or data', 'Simply repeating the abstract', 'Being overly speculative'] },
  ],
  templatesTitle: 'Downloadable Templates',
  templatesDescription: 'Download professionally structured templates to kickstart your research projects.',
  templatesImageUrl: '',
  templates: [
    { name: 'Research Proposal Template', description: 'Structured template for writing a compelling research proposal with all essential sections.', iconName: 'FileText' },
    { name: 'Literature Review Template', description: 'Organized framework for conducting and writing a systematic literature review.', iconName: 'BookOpen' },
    { name: 'Research Paper Template', description: 'Complete IMRaD format template with section guidelines and formatting tips.', iconName: 'File' },
    { name: 'Journal Tracking Sheet', description: 'Spreadsheet to track journal submissions, reviewer feedback, and revision deadlines.', iconName: 'Table2' },
    { name: 'Citation Checklist', description: 'Pre-submission checklist to verify all citations, references, and formatting are correct.', iconName: 'CheckSquare' },
  ],
  mentorshipTitle: 'Need Research Guidance?',
  mentorshipDescription: 'Our mentors can guide you through topic selection, literature review, paper writing, and journal submission. Get personalized one-on-one support for your research journey.',
  mentorshipImageUrl: '',
  mentorshipEmail: 'beyondevidence7@gmail.com',
  mentorshipPhone: '8429492976',
  mentorshipCtaText: 'Book a Mentorship Session',
  mentorshipCtaLink: '/contact',
};

export default async function ResearchPage() {
  let data;
  try {
    data = await getResearchPage();
  } catch (e) {
    data = null;
  }

  const p = data || FALLBACK;

  const resImg = (image: any, imageUrl: any, fallback: string) => getImageUrl({ image, imageUrl }, fallback);

  return (
    <ResearchClient
      heroTitle={p.heroTitle || FALLBACK.heroTitle}
      heroSubtitle={p.heroSubtitle || FALLBACK.heroSubtitle}

      roadmapTitle={p.roadmapTitle || FALLBACK.roadmapTitle}
      roadmapDescription={p.roadmapDescription || FALLBACK.roadmapDescription}
      roadmapImageUrl={resImg(p.roadmapImage, p.roadmapImageUrl, FALLBACK.roadmapImageUrl)}
      roadmapSteps={p.roadmapSteps?.length ? p.roadmapSteps : FALLBACK.roadmapSteps}

      paperDbTitle={p.paperDbTitle || FALLBACK.paperDbTitle}
      paperDbDescription={p.paperDbDescription || FALLBACK.paperDbDescription}
      paperDbImageUrl={resImg(p.paperDbImage, p.paperDbImageUrl, FALLBACK.paperDbImageUrl)}
      paperDatabases={p.paperDatabases?.length ? p.paperDatabases : FALLBACK.paperDatabases}

      forensicTitle={p.forensicTitle || FALLBACK.forensicTitle}
      forensicDescription={p.forensicDescription || FALLBACK.forensicDescription}
      forensicImageUrl={resImg(p.forensicImage, p.forensicImageUrl, FALLBACK.forensicImageUrl)}
      forensicResources={p.forensicResources?.length ? p.forensicResources : FALLBACK.forensicResources}

      aiToolsTitle={p.aiToolsTitle || FALLBACK.aiToolsTitle}
      aiToolsDescription={p.aiToolsDescription || FALLBACK.aiToolsDescription}
      aiToolsImageUrl={resImg(p.aiToolsImage, p.aiToolsImageUrl, FALLBACK.aiToolsImageUrl)}
      aiTools={p.aiTools?.length ? p.aiTools : FALLBACK.aiTools}

      refManagerTitle={p.refManagerTitle || FALLBACK.refManagerTitle}
      refManagerDescription={p.refManagerDescription || FALLBACK.refManagerDescription}
      refManagerImageUrl={resImg(p.refManagerImage, p.refManagerImageUrl, FALLBACK.refManagerImageUrl)}
      referenceManagers={p.referenceManagers?.length ? p.referenceManagers : FALLBACK.referenceManagers}

      citationTitle={p.citationTitle || FALLBACK.citationTitle}
      citationDescription={p.citationDescription || FALLBACK.citationDescription}
      citationImageUrl={resImg(p.citationImage, p.citationImageUrl, FALLBACK.citationImageUrl)}
      citationGenerators={p.citationGenerators?.length ? p.citationGenerators : FALLBACK.citationGenerators}

      writingGuideTitle={p.writingGuideTitle || FALLBACK.writingGuideTitle}
      writingGuideDescription={p.writingGuideDescription || FALLBACK.writingGuideDescription}
      writingGuideImageUrl={resImg(p.writingGuideImage, p.writingGuideImageUrl, FALLBACK.writingGuideImageUrl)}
      writingGuides={p.writingGuides?.length ? p.writingGuides : FALLBACK.writingGuides}

      templatesTitle={p.templatesTitle || FALLBACK.templatesTitle}
      templatesDescription={p.templatesDescription || FALLBACK.templatesDescription}
      templatesImageUrl={resImg(p.templatesImage, p.templatesImageUrl, FALLBACK.templatesImageUrl)}
      templates={p.templates?.length ? p.templates : FALLBACK.templates}

      mentorshipTitle={p.mentorshipTitle || FALLBACK.mentorshipTitle}
      mentorshipDescription={p.mentorshipDescription || FALLBACK.mentorshipDescription}
      mentorshipImageUrl={resImg(p.mentorshipImage, p.mentorshipImageUrl, FALLBACK.mentorshipImageUrl)}
      mentorshipEmail={p.mentorshipEmail || FALLBACK.mentorshipEmail}
      mentorshipPhone={p.mentorshipPhone || FALLBACK.mentorshipPhone}
      mentorshipCtaText={p.mentorshipCtaText || FALLBACK.mentorshipCtaText}
      mentorshipCtaLink={p.mentorshipCtaLink || FALLBACK.mentorshipCtaLink}
    />
  );
}
