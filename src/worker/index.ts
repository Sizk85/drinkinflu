import { Worker, Queue } from 'bullmq'
import { db } from '@/db'
import { applications, transactions, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Redis connection
const connection = {
  host: process.env.REDIS_URL?.replace('redis://', '') || 'localhost',
  port: 6379,
}

// Queues
export const verificationQueue = new Queue('verification', { connection })
export const paymentQueue = new Queue('payment', { connection })

/**
 * Verification Worker
 * Processes verification requests (calls AI service, updates status)
 */
const verificationWorker = new Worker(
  'verification',
  async (job) => {
    console.log(`Processing verification job ${job.id}`)
    const { applicationId } = job.data

    try {
      // TODO: In production, call actual AI service here
      // For now, we just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Update application status
      await db
        .update(applications)
        .set({
          verificationStatus: 'auto_pass',
          verifiedAt: new Date(),
        })
        .where(eq(applications.id, applicationId))

      console.log(`Verification completed for application ${applicationId}`)
    } catch (error) {
      console.error(`Verification failed for application ${applicationId}:`, error)
      throw error
    }
  },
  { connection }
)

/**
 * Payment Worker
 * Processes payments (transfers funds, records transactions)
 */
const paymentWorker = new Worker(
  'payment',
  async (job) => {
    console.log(`Processing payment job ${job.id}`)
    const { applicationId, amount, influencerId } = job.data

    try {
      // Get current balance
      const [influencer] = await db
        .select()
        .from(users)
        .where(eq(users.id, influencerId))
        .limit(1)

      if (!influencer) {
        throw new Error('Influencer not found')
      }

      const currentBalance = parseFloat(influencer.walletBalance || '0')
      const newBalance = currentBalance + amount

      // Update balance
      await db
        .update(users)
        .set({ walletBalance: newBalance.toFixed(2) })
        .where(eq(users.id, influencerId))

      // Create transaction
      await db.insert(transactions).values({
        userId: influencerId,
        type: 'job_received',
        amount: amount.toFixed(2),
        balanceBefore: currentBalance.toFixed(2),
        balanceAfter: newBalance.toFixed(2),
        relatedApplicationId: applicationId,
        description: 'รับเงินจากงานที่เสร็จสิ้น',
        status: 'completed',
      })

      // Update application payment status
      await db
        .update(applications)
        .set({
          paymentStatus: 'paid',
          paidAt: new Date(),
        })
        .where(eq(applications.id, applicationId))

      console.log(`Payment completed for application ${applicationId}`)
    } catch (error) {
      console.error(`Payment failed for application ${applicationId}:`, error)
      throw error
    }
  },
  { connection }
)

// Worker event listeners
verificationWorker.on('completed', (job) => {
  console.log(`✅ Verification job ${job.id} completed`)
})

verificationWorker.on('failed', (job, err) => {
  console.error(`❌ Verification job ${job?.id} failed:`, err)
})

paymentWorker.on('completed', (job) => {
  console.log(`✅ Payment job ${job.id} completed`)
})

paymentWorker.on('failed', (job, err) => {
  console.error(`❌ Payment job ${job?.id} failed:`, err)
})

console.log('[Worker] BullMQ workers started')
console.log('📋 Listening to queues: verification, payment')

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down workers...')
  await verificationWorker.close()
  await paymentWorker.close()
  process.exit(0)
})

