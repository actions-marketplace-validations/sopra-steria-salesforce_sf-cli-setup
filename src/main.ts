import { SalesforceCLI } from './main/install.js'
import { SalesforceAuth } from './main/auth.js'

export async function run(): Promise<void> {
  const cli = new SalesforceCLI()
  await cli.install()

  const sf = new SalesforceAuth()
  await sf.auth()
}
