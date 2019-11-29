const homedir = require('os').homedir()
import fs from 'fs';
import path, { resolve } from 'path';

console.log(homedir)
const dbPath:string = path.join(homedir,'.translation')

export const db = {
  read:(path = dbPath)=>{
    return new Promise((resolve,reject)=>{
      fs.readFile(path,{
        flag: 'a+'
      },(err,data)=>{
        if(err) return reject(err);
        let obj = {}
        try{
          obj = JSON.parse(data.toString())
        }catch(e){
          obj = {
            to:'en',
            from:'zh-TW'
          }
        }
        resolve(obj)
      })
    })
  },
  write:(data:object, path = dbPath) =>{
    return new Promise((resolve,reject)=>{
      fs.writeFile(path,JSON.stringify(data),(err)=>{
      if(err) return reject(err);
        resolve()
      })
    })
  }
}

