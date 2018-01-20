'use strict'

var path = require('path')
var expect = require('chai').expect
var JasperNode = require('../index')
var JasperError = require('../JasperError')

describe('JasperNodeTest', function() {
    it('should error JasperError (file not found)', async function() {
        const inputFile = path.join(__dirname, 'tmp', 'fakeFile.jasper')
        const jasper = new JasperNode()
        try {
            const params = await jasper.listParameters(inputFile).execute()
        } catch (e) {
            expect(e).to.be.an('error')
        }
    })

    it('listParameters output test', async function() {
        const inputFile = path.join(__dirname, 'tmp', 'params.jasper')
        const jasper = new JasperNode()
        const command = await jasper.listParameters(inputFile).output()

        expect(command).to.be.a('string')
        expect(command).to.have.string('list_parameters')
    })
    
    it('listParameters execute test', async function() {
        const inputFile = path.join(__dirname, 'tmp', 'params.jasper')
        const jasper = new JasperNode()
        const params = await jasper.listParameters(inputFile).execute()

        expect(params).to.be.a('string')
        expect(params).to.have.string('P myString java.lang.String')
        expect(params).to.have.string('P myInt    java.lang.Integer')
        expect(params).to.have.string('P myDate   java.util.Date')
        expect(params).to.have.string('P myImage  java.lang.String  This is the description of parameter myImage')
    })
    
    it('process output test', async function() {
        const resourceDir = path.join(__dirname, 'tmp')
        const inputFile = path.join(__dirname, 'tmp', 'params.jasper')
        const outputFile = path.join(__dirname, 'tmp', 'output')
        
        const jasper = new JasperNode(resourceDir)
        const params = {
            myString: jasper.quotes('My String'),
            myInt: 100,
            myImage: jasper.quotes('sample.jpg')
        }
        const command = await jasper.process(inputFile, outputFile, params).output()

        expect(command).to.be.a('string')
        expect(command).to.have.string('process')
        expect(command).to.have.string('-o')
        expect(command).to.have.string('-f')
        expect(command).to.have.string('-r')
        expect(command).to.have.string('-P')
    })

    it('process execute test', async function() {
        const inputFile = path.join(__dirname, 'tmp', 'params.jasper')
        const outputFile = path.join(__dirname, 'tmp', 'output')
        const format = 'pdf' // list of format -> 'pdf', 'rtf', 'xls', 'xlsx', 'docx', 'odt', 'ods', 'pptx', 'csv', 'html', 'xhtml', 'xml', 'jrprint'
        
        const jasper = new JasperNode() // by default resourceDir is equal with inputFile directory
        const params = {
            myString: jasper.quotes('My String'),
            myInt: 100,
            myImage: jasper.quotes('sample.jpg')
        }
        const filePath = await jasper.process(inputFile, outputFile, params, format).execute()
        
        expect(filePath).to.be.a('string')
        expect(filePath).to.have.string(path.join('tmp', 'output.pdf'))
    }).timeout(5000)
})