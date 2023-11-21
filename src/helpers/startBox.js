
import boxen from 'boxen';
import dotenv from 'dotenv';
dotenv.config();

let env = process.env.Environment || 'development';
let PORT = process.env.PORT || 8000;
let dbEnv = "local";

if(env ==="production"){
dbEnv = 'cloud';
}else{
    dbEnv = "local";
}

let startBox = boxen(`\xa0\x1b[0m Environment : ${env.charAt(0).toUpperCase() + env.slice(1)}  \n  Port : ${PORT} \n  Connected to \x1b[32m${dbEnv}\x1b[0m db \n  Server is started!`
, {title: '\x1b[1;36mRuntime Details\x1b[0m', titleAlignment: 'center'});

export default startBox;