import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function grantAccess() {
  const userId = process.argv[2] || 'user_3HDRMwR23gC0gjoYEL0jYPyNoMG'
  const courseSlug = process.argv[3] || 'ugc-net-jrf'
  const courseName = process.argv[4] || 'UGC NET JRF - Forensic Science Study Material'
  const examType = process.argv[5] || 'UGC NET'

  const manualId = `manual_grant_${Date.now()}`

  try {
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        courseId: courseSlug,
        courseSlug,
        courseName,
        examType,
        packageId: 'manual',
        packageName: courseName,
        amount: 0,
        orderId: manualId,
        paymentId: manualId,
        status: 'paid',
      },
    })
    console.log('✅ Successfully granted premium access!')
    console.log(purchase)
  } catch (error) {
    console.error('❌ Error granting access:', error)
  }
}

grantAccess()
