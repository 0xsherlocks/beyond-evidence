import type { StructureResolver } from 'sanity/structure'

// Singletons are document types that should only have one instance
const singletonTypes = new Set(['siteSettings', 'navigation', 'homePage', 'aboutPage', 'contactPage', 'legalPage', 'researchPage', 'notificationPage'])

// Defines the custom desk structure for the Sanity Studio
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton items — displayed as direct document editors
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      S.listItem()
        .title('Navigation')
        .id('navigation')
        .child(S.document().schemaType('navigation').documentId('navigation')),

      S.divider(),

      // Page singletons
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),

      S.listItem()
        .title('Research Page')
        .id('researchPage')
        .child(S.document().schemaType('researchPage').documentId('researchPage')),

      S.listItem()
        .title('About Page')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),

      S.listItem()
        .title('Contact Page')
        .id('contactPage')
        .child(S.document().schemaType('contactPage').documentId('contactPage')),

      S.listItem()
        .title('Legal Page')
        .id('legalPage')
        .child(S.document().schemaType('legalPage').documentId('legalPage')),

      S.listItem()
        .title('Notification Page & RSS')
        .id('notificationPage')
        .child(S.document().schemaType('notificationPage').documentId('notificationPage')),

      S.divider(),

      // Document collections
      S.documentTypeListItem('studyMaterial').title('Study Materials / Exams'),
      S.documentTypeListItem('subject').title('Subjects (Courses)'),
      S.documentTypeListItem('quiz').title('Quizzes'),
      S.documentTypeListItem('notification').title('Official Announcements (Alerts)'),
      S.documentTypeListItem('dfssVacancy').title('DFSS Vacancies (Scraped)'),

      S.divider(),

      // CRM — Newsletter subscribers collected from the homepage form
      S.documentTypeListItem('newsletterSubscriber').title('Newsletter Subscribers'),
    ])
