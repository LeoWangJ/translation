#! /usr/bin/env node
import * as commander from 'commander'
import { translate } from './main'
import inquirer from 'inquirer'
const program = new commander.Command()
const pkg = require('../package.json')
let to: string, from: string
program
    .version(pkg.version)
program
    .command('fy')
    .description('直接使用翻譯功能, 必填一個單字')
    .action((...args) => {
        if (args.length == 1) {
            console.log('請輸入至少一個單字')
            return
        }
        let word: string = args.slice(-1)[0].join(' ')
        console.log(to, from)
        translate(word, to, from)
    })
// .name('translate')
// .usage('<Word>')
// .arguments('[Word]')
// .action((word) => {
//     console.log(word)
//     translate(word)
// })
program.parse(process.argv)

if (process.argv.length === 2) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'index',
                message: '請選擇您要的操作',
                choices: [
                    { name: '修改翻譯語言', value: '-2' },
                    { name: '退出', value: '-1' }
                ]
            }
        ]).then((answer: { index: string }) => {
            console.log(answer)
            let index: number = parseInt(answer.index)
            if (index === -2) {
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'to',
                            message: '請選擇您輸入的語言',
                            choices: [
                                { name: '簡體中文', value: '1' },
                                { name: '繁體中文', value: '2' },
                                { name: '英文', value: '3' },
                            ]
                        }
                    ]).then((answer1: { to: string }) => {
                        let index: number = parseInt(answer1.to)
                        if (index === 1) {
                            to = 'zh-CN'
                        } else if (index === 2) {
                            to = 'zh-TW'
                        } else if (index === 3) {
                            to = 'en'
                        }
                        inquirer
                            .prompt([
                                {
                                    type: 'list',
                                    name: 'from',
                                    message: '請選擇您將要翻譯的語言',
                                    choices: [
                                        { name: '簡體中文', value: '1' },
                                        { name: '繁體中文', value: '2' },
                                        { name: '英文', value: '3' },
                                    ]
                                }
                            ]).then((answer2: { from: string }) => {
                                let index: number = parseInt(answer2.from)
                                console.log(index)
                                if (index === 1) {
                                    from = 'zh-CN'
                                } else if (index === 2) {
                                    from = 'zh-TW'
                                } else if (index === 3) {
                                    from = 'en'
                                }
                            })

                    })
            }
        })
}