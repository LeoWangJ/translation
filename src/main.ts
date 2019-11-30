const translateAPI = require('@vitalets/google-translate-api');



export const translate = (word: string, from = 'zh-TW', to = 'en') => {
    return translateAPI(word, { from, to }).then((res: { text: string; }) => {
        console.log(res.text)
        return res.text
    }).catch((err: any) => {
        console.error(err);
    });
}