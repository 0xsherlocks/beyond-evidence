import { siteSettings } from './siteSettings'
import { navigation } from './navigation'
import { homePage } from './homePage'
import { topic } from './topic'
import { researchArticle } from './researchArticle'
import { webinar } from './webinar'
import { learningTrack } from './learningTrack'
import { aboutPage } from './aboutPage'
import { contactPage } from './contactPage'
import { quizQuestion } from './quizQuestion'
import { legalPage } from './legalPage'
import { notification } from './notification'
import { researchPage } from './researchPage'

export const schemaTypes = [
  // Singletons
  siteSettings,
  navigation,
  homePage,
  aboutPage,
  contactPage,
  legalPage,
  researchPage,

  // Documents
  topic,
  researchArticle,
  webinar,
  learningTrack,
  quizQuestion,
  notification,
]

