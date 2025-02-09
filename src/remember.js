import chalk from 'chalk'
import ora from 'ora'
import 'dotenv/config'
import { connect, disconnect } from './infra/db.js'
import Thing from './models/Thing.js'

async function main() {
  const { MONGO_URL } = process.env
  console.log(process.env)
  const spinner = ora(chalk.blue('remembering')).start()
  const args = process.argv.slice(2)
  if (args.length === 2) {
    const thing = new Thing({ key: args[0], value: args[1]})
    try {
      await connect(url=MONGO_URL)
      await thing.save()
      await disconnect()
      console.log(chalk.blue(`\nThing "${thing.key}" will be remembered`))
    }
    catch(err) {
      console.log(err)
      console.log(chalk.redBright('\nThings go wrong...'))
    }
  }
  spinner.stop()
  process.exit()
}

await main()
