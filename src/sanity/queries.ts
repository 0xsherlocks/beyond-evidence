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

// ─── Topics ──────────────────────────────────────────────────
export async function getTopics() {
  return sanityClient.fetch(
    `*[_type == "topic"] | order(order asc){
      _id,
      name,
      "slug": slug.current,
      description,
      image,
      imageUrl,
      moduleCount,
      order
    }`,
    {},
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
export async function getQuizQuestions() {
  return sanityClient.fetch(
    `*[_type == "quizQuestion"] | order(order asc){
      _id,
      question,
      options,
      correctAnswer
    }`,
    {},
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
      message,
      isNew,
      timestamp
    }`,
    {},
    NO_CACHE
  )
}

