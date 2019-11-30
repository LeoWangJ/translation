#! /usr/bin/env node
import commander from 'commander'
import { translate } from './main'
import inquirer from 'inquirer'
import { db } from './db'
const program = new commander.Command()
const pkg = require('../package.json')

program
    .version(pkg.version)
program
    .command('fy')
    .description('直接使用翻譯功能, 必填一個單字')
    .action(async (...args) => {
        if (args.length == 1) {
            console.log('請輸入至少一個單字')
            return
        }

        let languageObj: any = await db.read()

        let word: string = args.slice(-1)[0].join(' ')
        translate(word, languageObj.from, languageObj.to)
    })

program.parse(process.argv)


const programStart = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'index',
                message: '請選擇您要的操作',
                choices: [
                    { name: '查看當前翻譯語言', value: '-3' },
                    { name: '修改翻譯語言', value: '-2' },
                    { name: '退出', value: '-1' }
                ]
            }
        ]).then(async (answer: { index: string }) => {
            let index: number = parseInt(answer.index)
            if (index === -2) {
                translateFromLanguage()
            } else if (index === -3) {
                readLanguage()
            }
        })
}

const translateFromLanguage = () => {
    let languageObj = {
        to: 'en',
        from: 'zh-TW'
    }
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'from',
                message: '請選擇您輸入的語言',
                choices: [
                    { name: '簡體中文', value: 'zh-CN' },
                    { name: '繁體中文', value: 'zh-TW' },
                    { name: '英文', value: 'en' },
                ]
            }
        ]).then((language: { from: string }) => {
            languageObj.from = language.from
            translateToLanguage(languageObj)
        })
}

type LanguageDefault = {
    to: string;
    from: string
}

const translateToLanguage = (languageObj: LanguageDefault) => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'to',
                message: '請選擇您將要翻譯的語言',
                choices: [
                    { name: '簡體中文', value: 'zh-CN' },
                    { name: '繁體中文', value: 'zh-TW' },
                    { name: '英文', value: 'en' },
                ]
            }
        ]).then(async (language: { to: string }) => {
            languageObj.to = language.to
            await db.write(languageObj)
            process.exit(1)
        })
}

type languageMapType = {
    [key: string]: string;
    'zh-TW': string;
    'zh-CN': string;
    'en': string;
}
const languageMap: languageMapType = {
    'zh-TW': '繁體中文',
    'zh-CN': '簡體中文',
    'en': '英文'
}

const readLanguage = async () => {
    let language: any = await db.read()
    console.log(`輸入語言: ${languageMap[language.from]} , 輸出語言: ${languageMap[language.to]}`)
}

if (process.argv.length === 2) {
    programStart()
}