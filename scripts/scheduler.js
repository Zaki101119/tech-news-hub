// scripts/scheduler.js
const cron = require('node-cron')
const { exec } = require('child_process')

// Run news generation daily at 8:00 AM, 2:00 PM, and 8:00 PM
// These times are in UTC - adjust to your timezone

// Morning run at 8:00 UTC (adjust hour in cron expression)
cron.schedule('0 8 * * *', () => {
  console.log('🚀 Running morning news fetch...')
  exec('node scripts/generateNews.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return
    }
    console.log(stdout)
  })
})

// Afternoon run at 14:00 UTC
cron.schedule('0 14 * * *', () => {
  console.log('🚀 Running afternoon news fetch...')
  exec('node scripts/generateNews.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return
    }
    console.log(stdout)
  })
})

// Evening run at 20:00 UTC
cron.schedule('0 20 * * *', () => {
  console.log('🚀 Running evening news fetch...')
  exec('node scripts/generateNews.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return
    }
    console.log(stdout)
  })
})

console.log('📅 Scheduler started - News will auto-publish 3 times daily')
console.log('⏰ Schedule: 8:00 AM, 2:00 PM, 8:00 PM (UTC)')
