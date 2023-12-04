// add user to blocklist

import mongoose from "mongoose";
import Blocklist from "./models/blocklist.js";
import yargs from "yargs";
import { hideBin } from 'yargs/helpers';

// Connect to db 
import connectToDb from './src/config/dbConnect.js';



connectToDb()
  .then(async() => {
    console.log('\x1b[34m Commands:\x1b[0m \n -u :username -e :email -c :clear list \n e.g -e email@fu.com')
    console.log('\n Connected to db ');
    
    const argv = await yargs(hideBin(process.argv))
      .option('username', {
        alias: 'u',
        description: 'Specify the username',
        type: 'string',
        demandOption: false,
      })
      .option('email', {
        alias: 'e',
        description: 'Specify the email',
        type: 'string',
        demandOption: false,
      }).option('clear', {
        alias: 'c',
        description: 'clear list',
        type: 'string',
        demandOption: false,
      })
      .argv;
if(argv.clear === ''){
   //clear Collection
   return await clearCollection()
}
    // Access the values
    const username = argv.username;
    const email = argv.email;

    const handleError = (error) => {
      if (error.name && error.name === 'ValidationError') {
      if(error.message.includes('email') && error.message.includes('username')){
        console.log(' \x1b[0m \x1b[31m Error: \x1b[34m both \x1b[32m username \x1b[34m and \x1b[32m email \x1b[34m must be unique \x1b[0m')
      }else if(error.message.includes('email')){
        console.log(' \x1b[0m \x1b[31m Error: \x1b[32m email \x1b[34m must be unique \x1b[0m')
      }else{
        console.log(' \x1b[0m \x1b[31m Error: \x1b[32m username \x1b[34m must be unique \x1b[0m')
      }
      } else {
        console.log(error.message)
      }
    };

    if (username && email) {
      Blocklist.create({ username, email })
        .then(result => {
          console.log(`\x1b[32m Success: \x1b[34m  { username: '${result.username}', email: '${result.email}' }\x1b[0m`);

        })
        .catch(handleError)
        .finally(() => {
          mongoose.disconnect();
          console.log('Disconnected from db \n');
        });
    } else if (email) {
      Blocklist.create({ email })
        .then(result => {
          console.log(`\x1b[32m Success: \x1b[34m  { email: '${result.email}' }\x1b[0m`);
        })
        .catch(handleError)
        .finally(() => {
          mongoose.disconnect();
          console.log('Disconnected from db \n');
        });
    } else if (username) {
      Blocklist.create({ username })
        .then(result => {
          console.log(`\x1b[32m Success: \x1b[34m  { username: '${result.username}' }\x1b[0m`);
        })
        .catch(handleError)
        .finally(() => {
          mongoose.disconnect();
          console.log('Disconnected from db \n');
        });
    } else {
      console.log('No Input');
      mongoose.disconnect();
      console.log('Disconnected from db \n');
    }
  })
  .catch((err) => {
    console.log(err, 'error connecting to db \n');
  });


  const clearCollection = async()=>{
    try {
      const deleteResult = await Blocklist.deleteMany({});
      console.log(` \x1b[0m \x1b[34m Deleted ${deleteResult.deletedCount} documents successfully. \x1b[0m`);
      mongoose.disconnect();
      console.log('Disconnected from db \n');

    } catch (error) {
      console.error('Error deleting documents:', error.message);
      mongoose.disconnect();
      console.log('Disconnected from db \n');
  
    }
  }
