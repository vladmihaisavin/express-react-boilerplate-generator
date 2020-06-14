const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const { version } = require('../package.json')
const createDatabaseParser = require('../../../../databaseParser')
const generateProject = require('../../../../generators/projectGenerator')
const { getFilesToBeReplaced, getFilesToBeOmmitted } = require('../../../../helpers/constants')
const { removeDirectory, createFileManager } = require('../../../../helpers/fileSystem')
const createFileGenerator = require('../../../../generators/fileGenerator')
const createClientGenerators = require('../../../../generators/resources/clientGenerators')
const createServerGenerators = require('../../../../generators/resources/serverGenerators')
const { zipDirectory } = require('../../../../helpers/fileSystem')
const ROOT_DIR = path.join(process.cwd(), '../../../..')

module.exports = ({ config }) => {
  const app = new Router()

  app.get('/info', (req, res) => {
    res.json({ version })
  })
  app.post('/resources', async (req, res) => {
    const { databaseType, ...dbCredentials } = req.body
    try {
      const databaseParser = await createDatabaseParser({
        connectionData: dbCredentials,
        type: databaseType
      })
      resources = await databaseParser.gatherResources()
      return res.status(200).json(resources)
    } catch (err) {
      return res.status(500).json(err)
    }
  })

  app.post('/generate', async (req, res) => {
    const {
      projectName,
      authentication,
      databaseType,
      authenticableResourceTable,
      resources: resourcesFromClient
    } = req.body
    const outputPath = `${ROOT_DIR}/temp/${projectName}`
    const templatePath = path.join(ROOT_DIR, './express-react-boilerplate')
    const stubsPath = path.join(ROOT_DIR, './src/stubs')

    try {
      const hasAuthentication = authentication !== 'none'
      const hasDatabase = databaseType !== 'none'
      const filesToBeReplaced = getFilesToBeReplaced(templatePath)
      const filesToBeOmmitted = getFilesToBeOmmitted(templatePath, hasAuthentication)

      let resources = []
      if (hasDatabase) {
        resources = resourcesFromClient
        console.log(JSON.stringify(resources))
      }
      
      const fileManager = createFileManager({ stubsPath, outputPath })
      const generateFile = createFileGenerator({
        resourceGenerators: {
          client: createClientGenerators({
            projectName,
            hasAuthentication,
            resources,
            fileManager
          }),
          server: createServerGenerators({
            projectName,
            hasAuthentication,
            authenticableResourceTableName: authenticableResourceTable,
            databaseType: hasDatabase ? databaseType : '',
            resources,
            fileManager
          })
        }
      })

      fs.mkdirSync(outputPath)

      await generateProject({
        templatePath,
        scanPath: templatePath,
        outputPath,
        filesToBeReplaced,
        filesToBeOmmitted,
        generateFile
      })

      const zip = zipDirectory(outputPath)
      const downloadName = `${projectName}.zip`
      // const data = zip.toBuffer()
      const data = zip.writeZip(`${outputPath}.zip`)
      // res.set('Content-Type', 'application/octet-stream')
      // res.set('Content-Disposition', `attachment; filename=${downloadName}`)
      // res.set('Content-Length', data.length)
      // res.send(data)
      res.sendStatus(200)
    } catch (err) {
      removeDirectory(outputPath)
      return res.status(500).json(err)
    }
  })

  return app
}