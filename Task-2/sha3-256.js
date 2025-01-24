const crypto = require('crypto')
const fs = require('fs');
/* co

if(!args.length) args= [""]
const result = crypto.createHash('sha3-256').update(args[0]).digest('hex')
console.log(result) */

const path = './files-task-2'
const email = 'madrigal.saenz.alan@gmail.com'

 fs.readdir(path,(err,files)=>{
    if(err){
        console.log(err)
        return
    }
    const array = []
    for(const file of files){
        
        const fileRead = fs.readFileSync(`${path}/${file}`)
        array.push(crypto.createHash('sha3-256').update(fileRead).digest('hex'))
        


    }

    array.sort((a, b) => (a > b ? -1 : 1))
    const concatenatedString = array.join('') + email.toLowerCase();


    const finalHash = crypto.createHash('sha3-256').update(concatenatedString).digest('hex');

    console.log(finalHash);
    console.log(crypto.createHash('sha3-256').update(email).digest('hex'));
    
})


