import { siteSettings } from './siteSettings'
import { navigation } from './navigation'
import { homePage } from './homePage'
import { subject } from './subject'
import { researchArticle } from './researchArticle'
import { webinar } from './webinar'
import { learningTrack } from './learningTrack'
import { aboutPage } from './aboutPage'
import { contactPage } from './contactPage'
import { legalPage } from './legalPage'
import { quiz } from './quiz'
import { notification } from './notification'
import { researchPage } from './researchPage'
import { studyMaterial } from './studyMaterial'
import { dfssVacancy } from './dfssVacancy'
import { notificationPage } from './notificationPage'

export const schemaTypes = [
  // Singletons
  siteSettings,
  navigation,
  homePage,
  aboutPage,
  contactPage,
  legalPage,
  researchPage,
  notificationPage,

  // Documents
  subject,
  researchArticle,
  webinar,
  learningTrack,
  quiz,
  notification,
  studyMaterial,
  dfssVacancy,
]
