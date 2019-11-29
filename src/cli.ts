#! /usr/bin/env node
import * as commander from 'commander'
import { translate } from './main'
import inquirer from 'inquirer'
import { db } from './db'
const program = new commander.Command()
const pkg = require('../package.json')
let to: string, from: string
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

        let languageObj:any= await db.read()

        let word: string = args.slice(-1)[0].join(' ')
        translate(word, languageObj.from, languageObj.to)
    })
// .name('translate')
// .usage('<Word>')
// .arguments('[Word]')
// .action((word) => {
//     console.log(word)
//     translate(word)
// })
program.parse(process.argv)

type languageMapType = {
    [key:string]:string;
    'zh-TW':string;
    'zh-CN':string;
    'en': string;
}
const languageMap:languageMapType = {
    'zh-TW':'繁體中文',
    'zh-CN':'簡體中文',
    'en': '英文'
}
if (process.argv.length === 2) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'index',
                message: '請選擇您要的操作',
                choices: [
                    {name:'查看當前翻譯語言', value:'-3'},
                    { name: '修改翻譯語言', value: '-2' },
                    { name: '退出', value: '-1' }
                ]
            }
        ]).then(async (answer: { index: string }) => {
            let index: number = parseInt(answer.index)
            if (index === -2) {
                let languageObj = {
                    to:'en',
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
                    ]).then((answer1: { from: string }) => {
                        languageObj.from = answer1.from
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
                            ]).then(async (answer2: { to: string }) => {
                                languageObj.to = answer2.to
                                await db.write(languageObj)
                                console.log('編輯成功！')
                                
                            })

                    })
            } else if(index === -3){
                let data:any= await db.read()
                console.log(`輸入語言: ${languageMap[data.from]} , 輸出語言: ${languageMap[data.to]}`)
                process.exit(1)
            }
        })
}