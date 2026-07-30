import { sanityClient } from './client'

// Shared fetch options — disable all caching so Sanity edits appear instantly
const NO_CACHE = { cache: 'no-store' as RequestCache }

// ─── Navigation ──────────────────────────────────────────────
export async function getNavigation() {
  return sanityClient.fetch(
    `*[_type == "navigation"][0]{
      headerLinks[]{label, href},
      footerLinks[]{label, href}
    }`,
    {},
    NO_CACHE
  )
}

// ─── Site Settings ───────────────────────────────────────────
export async function getSiteSettings() {
  return sanityClient.fetch(
    `*[_type == "siteSettings"][0]{
      title,
      description,
      logo
    }`,
    {},
    NO_CACHE
  )
}

// ─── Home Page ───────────────────────────────────────────────
export async function getHomePage() {
  return sanityClient.fetch(
    `*[_type == "homePage" && _id == "homePage"][0]{
      heroTitle,
      heroTitleLine2,
      heroHighlight,
      heroDescription,
      valuePropEyebrow,
      valuePropTitle,
      valueProps[]{title, description, iconName, image, imageUrl},
      featuredTopicsEyebrow,
      featuredTopicsTitle,
      featuredTopics[]{name, number, image, imageUrl, link},
      bannerTitle,
      bannerDescription,
      bannerImageUrl,
      bannerCta1Text,
      bannerCta1Link,
      bannerCta2Text,
      bannerCta2Link
    }`,
    {},
    NO_CACHE
  )
}

// ─── Subjects (Courses) ─────────────────────────────────────
export async function getSubjects() {
  return sanityClient.fetch(
    `*[_type == "subject"] | order(order asc){
      _id,
      name,
      "slug": slug.current,
      description,
      image,
      imageUrl,
      "moduleCount": count(modules),
      order
    }`,
    {},
    NO_CACHE
  )
}

export async function getSubjectBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "subject" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      description,
      image,
      imageUrl,
      modules[] | order(order asc){
        title,
        description,
        content[]{
          ...,
          _type == "image" => {
            ...,
            "asset": asset->{url}
          }
        },
        "fileUrl": file.asset->url,
        link,
        order
      }
    }`,
    { slug },
    NO_CACHE
  )
}

// ─── Research ────────────────────────────────────────────────
export async function getResearchArticles() {
  return sanityClient.fetch(
    `*[_type == "researchArticle"] | order(order asc, date desc){
      _id,
      title,
      "slug": slug.current,
      tag,
      author,
      date,
      image,
      imageUrl,
      body
    }`,
    {},
    NO_CACHE
  )
}

export async function getWebinar() {
  return sanityClient.fetch(
    `*[_type == "webinar" && isActive == true][0]{
      title,
      description,
      image,
      imageUrl,
      ctaText,
      ctaLink
    }`,
    {},
    NO_CACHE
  )
}

export async function getLearningTracks() {
  return sanityClient.fetch(
    `*[_type == "learningTrack"] | order(order asc){
      _id,
      title,
      description
    }`,
    {},
    NO_CACHE
  )
}

// ─── Research Page (New) ─────────────────────────────────────
export async function getResearchPage() {
  return sanityClient.fetch(
    `*[_type == "researchPage" && _id == "researchPage"][0]{
      heroTitle,
      heroSubtitle,
      roadmapTitle,
      roadmapDescription,
      roadmapImage,
      roadmapImageUrl,
      roadmapSteps[]{title, description, iconName, link},
      paperDbTitle,
      paperDbDescription,
      paperDbImage,
      paperDbImageUrl,
      paperDatabases[]{name, description, url, logo{asset->{url}}, imageUrl, color},
      forensicTitle,
      forensicDescription,
      forensicImage,
      forensicImageUrl,
      forensicResources[]{name, description, url, logo{asset->{url}}, imageUrl, color},
      aiToolsTitle,
      aiToolsDescription,
      aiToolsImage,
      aiToolsImageUrl,
      aiTools[]{name, description, url, logo{asset->{url}}, imageUrl, color},
      refManagerTitle,
      refManagerDescription,
      refManagerImage,
      refManagerImageUrl,
      referenceManagers[]{name, description, url, logo{asset->{url}}, imageUrl, color},
      citationTitle,
      citationDescription,
      citationImage,
      citationImageUrl,
      citationGenerators[]{name, description, url, logo{asset->{url}}, imageUrl, color, formats},
      writingGuideTitle,
      writingGuideDescription,
      writingGuideImage,
      writingGuideImageUrl,
      writingGuides[]{heading, explanation, tips, mistakes},
      templatesTitle,
      templatesDescription,
      templatesImage,
      templatesImageUrl,
      templates[]{name, description, downloadUrl, iconName},
      mentorshipTitle,
      mentorshipDescription,
      mentorshipImage,
      mentorshipImageUrl,
      mentorshipEmail,
      mentorshipPhone,
      mentorshipCtaText,
      mentorshipCtaLink
    }`,
    {},
    NO_CACHE
  )
}

// ─── About Page ──────────────────────────────────────────────
export async function getAboutPage() {
  return sanityClient.fetch(
    `*[_type == "aboutPage" && _id == "aboutPage"][0]{
      heroTitle,
      heroDescription,
      missionTitle,
      missionBody,
      missionBodySimple,
      missionImage,
      missionImageUrl,
      methodologyTitle,
      methodologyDescription,
      methodologyFeatures[]{title, description, iconName}
    }`,
    {},
    NO_CACHE
  )
}

// ─── Contact Page ────────────────────────────────────────────
export async function getContactPage() {
  return sanityClient.fetch(
    `*[_type == "contactPage" && _id == "contactPage"][0]{
      heroTitle,
      heroDescription,
      contactDescription,
      phone,
      email,
      socialLinks[]{platform, url, label},
      businessHours[]{days, hours},
      closedNote
    }`,
    {},
    NO_CACHE
  )
}

// ─── Quiz ────────────────────────────────────────────────────
// Get all subjects that have quiz questions
export async function getQuizSubjects() {
  return sanityClient.fetch(
    `*[_type == "quiz"] | order(order asc){
      _id,
      "name": subject->name,
      "slug": subject->slug.current,
      "image": subject->image,
      "imageUrl": subject->imageUrl,
      "questionCount": count(quizQuestions)
    }`,
    {},
    NO_CACHE
  )
}

// Get quiz questions for a specific subject
export async function getQuizBySubject(subjectId: string) {
  // We use the quiz document's _id as subjectId when clicking from the grid
  return sanityClient.fetch(
    `*[_type == "quiz" && _id == $subjectId][0].quizQuestions[]{
      "question": question,
      "options": options,
      "correctAnswer": correctAnswer,
      "explanation": explanation
    }`,
    { subjectId },
    NO_CACHE
  )
}

// ─── Legal Page ──────────────────────────────────────────────
export async function getLegalPage() {
  return sanityClient.fetch(
    `*[_type == "legalPage" && _id == "legalPage"][0]{
      heroTitle,
      heroDescription,
      sections[]{heading, content, contentSimple},
      contactEmail
    }`,
    {},
    NO_CACHE
  )
}

// ─── Notifications ───────────────────────────────────────────
export async function getNotifications() {
  return sanityClient.fetch(
    `*[_type == "notification"] | order(order asc){
      _id,
      title,
      "slug": slug.current,
      excerpt,
      isNew,
      timestamp,
      link,
      "fileUrl": file.asset->url
    }`,
    {},
    NO_CACHE
  )
}

export async function getNotificationBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "notification" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      content[]{
        ...,
        _type == "image" => {
          ...,
          "asset": asset->{url}
        }
      },
      isNew,
      timestamp,
      link,
      "fileUrl": file.asset->url
    }`,
    { slug },
    NO_CACHE
  )
}

// ─── Study Materials ─────────────────────────────────────────
export async function getStudyMaterials() {
  return sanityClient.fetch(
    `*[_type == "studyMaterial"] | order(order asc){
      _id,
      title,
      "slug": slug.current,
      description,
      order
    }`,
    {},
    NO_CACHE
  )
}

export async function getStudyMaterialBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "studyMaterial" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      description,
      introParagraphs,
      features[]{title, description, iconName},
      packages[]{id, title, subtitle, price, badge, featuresList}
    }`,
    { slug },
    NO_CACHE
  )
}

// ─── DFSS Vacancies ──────────────────────────────────────────
export async function getDfssVacancies() {
  return sanityClient.fetch(
    `*[_type == "dfssVacancy"] | order(scrapedAt desc){
      _id,
      title,
      date,
      notificationUrl,
      sourceUrl,
      scrapedAt,
      fingerprint
    }`,
    {},
    NO_CACHE
  )
}

// ─── Notification Page Settings ──────────────────────────────
export async function getNotificationPage() {
  return sanityClient.fetch(
    `*[_type == "notificationPage"][0]{
      title,
      description,
      rssFeeds[]{
        url,
        sourceName
      }
    }`,
    {},
    NO_CACHE
  )
}
