import figlet from 'figlet'
import standard from 'figlet/importable-fonts/Standard.js'
figlet.parseFont('Standard', standard);

import prompts from 'prompts'
import ora from 'ora';
import chalk from 'chalk';

import {exec, execSync } from 'child_process'
import boxen from 'boxen';
import clear from 'clear';

async function init() {
  async function banner() {
    figlet.text('METACLOUD ', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    },
      (err,data) => {
        if(err){
          console.log(err);
        }
        console.log(data);
      }
    )
    
  }

  async function question() {
    let questions = [
      {
        type: "select",
        name: "localOrRemote",
        message: 'Develop locally or remotely',
        choices: [
          { title: 'locally (recommended)',description: 'your vscode open locally', value: 'locally' },
          { title: 'remotely',description: 'your vscode ssh remote', value: 'remotely',disabled: true  }
        ],
        initial: 0,
      },
      {
        type: "select",
        name: "dindOrDfromD",
        message: 'DinD(docker in docker) or DfromD(docker from docker)',
        choices: [
          { title: 'DinD (recommended)',description: 'create a container including new docker and k8s', value: 'DinD' },
          { title: 'DfromD',description: 'create a container reuse your host resource like docker and k8s', value: 'DfromD' ,disabled: true  }
        ],
        initial: 0,
      },
      {
        type: "select",
        name: "devRole",
        message: 'frontend or fullstack or both+devops',
        choices: [
          { title: 'frontend',description: 'quick start a browser to see what is this thing', value: 'frontend' },
          { title: 'fullstack',description: 'slow start to create some containers', value: 'fullstack' },
          { title: 'both+devops(recommended)', description: 'feeling project whole feature',value: 'devops' }
        ],
        initial: 0,
      }
    ]
    let res = prompts(questions)
    return res
  }

  clear()
  await banner()
  let result = await question()
  console.log("your choice: ")
  console.log(result)
  const {
    localOrRemote,
    dindOrDfromD,
    devRole
  } = result
  

  console.log(boxen('Scaffolding project ...', {padding: 1}));
  /*
  ┌─────────────┐
  │             │
  │   unicorn   │
  │             │
  └─────────────┘
  */
  
  // const spinner = ora('cleaning ...').start()
  execSync('rm -rf metacloud')

  const spinnerCloneCode = ora('git clone ...').start()
  let child = exec('git clone https://github.com/oldwinter/metacloud.git',
    (error, stdout, stderr)=> {
      // spinner.succeed('git clone done')
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    }
  )

  child.on('close', function(code) {
    spinnerCloneCode.succeed('git clone done\n')

    const spinnerNpmInstall = ora('npm install ...').start()
    let child = exec('npm install -g devcontainer')
    child.on('close', function(code){
      spinnerNpmInstall.succeed('npm install done')
      if (localOrRemote ==='locally' && dindOrDfromD === 'DinD'){
        if (devRole === "frontend"){
          // spinner.succeed('Done. Now run:\n')
          // 等微软修复devcontainer的open功能

          console.log(`${chalk.bold.green('cd metacloud/portal')}`)
          console.log(`${chalk.bold.green('npm install')}`)
          console.log(`${chalk.bold.green('npm run dev')}`)
        }
        if (devRole === "backend"){
          console.log(`${chalk.bold.green('cd metacloud')}`)
          console.log(`${chalk.bold.green('docker compose up')}`)
        }
        if (devRole === "devops"){
          const spinnerDockerBuild = ora('devcontainer build ...').start()
          let child = exec('devcontainer build ./metacloud')
          child.on('close', function(code){
            spinnerDockerBuild.succeed('devcontainer build done')
          })
          console.log(`${chalk.bold.green('open vscode')}`)
          console.log(`${chalk.bold.green('open folder in container')}`)
    
        }
      }
    })



    

    console.log()

  });



  
  


}

init().catch((e) => {
  console.error(e)
})