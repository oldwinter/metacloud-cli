#!/usr/bin/env node

import { promisify } from "util";
const figlet = promisify(require("figlet"));
// const clear = require("clear");
const inquirer = require("inquirer");

// const { log } = require("../lib/api"); 

const chalk = require("chalk");
const { spawn ,execFile, exec} = require('child_process');
const open = require('open');

async (...args) => {

  return new Promise(resolve => {
    const proc = spawn(...args)
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
    proc.on('close', () => {
      resolve()
    })
  })
}

log = (msg, color='green', ...arg) => console.log(chalk[color](msg, arg));





// const opt = {
//   "dockerInDocker": "(Recommended) local, docker in docker, build everything in admin container." ,
//   "dockerFromDocker": "local, docker from docker, reuse env in my host.",
//   "remoteSSH": "remote, ssh a high performance server.",
//   "quit": "quit",
// };

const opt = {
  "dockerInDocker": "本机, 让接下来你感知到的一切, 都运行在一个管理容器内. (推荐)" ,
  "dockerFromDocker": "本机, 复用本机的容器和集群",
  "remoteSSH": "远程, 连接至一台高性能服务器开发",
  "quit": "quit",
};


const question = [
    {
      type: "rawlist" /* 选择框 */,
      message: "请选择开发模式: 😎😎😎",
      name: "operation",
      choices: Object.values(opt),
    }
  ];

const opt2 = {
    "devcontainerBuild": "是,~~将进行耗时分钟级的开发环境构建" ,
    "devcontainerPull": "否,~~但我愿意pull一个已经构建好的镜像",
  };

const question2 = [
    {
      type: "rawlist" /* 选择框 */,
      message: "请确认已科学上网,并配置全局代理: 😎😎😎",
      name: "operation",
      choices: Object.values(opt2),
    }
  ];

const opt3 = {
  "frontendDev": "只进行前端开发",
  "fullstackDev": "全栈开发",
  "devopsDev": "运维开发"
}

const question3 = [
  {
    type: "rawlist" /* 选择框 */,
    message: "请选择打开方式: 😎😎😎",
    name: "operation",
    choices: Object.values(opt3),
  }
];

// clear();


log(
  f.textSync("METACLOUD !", {
    horizontalLayout: "Isometric1",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  }), 'blue'
)

query();



async function query(){
  const answer = await inquirer.prompt(question);
  console.log("回答:  ", answer.operation);
  if (opt[answer.operation] === "quit") {
    console.log("welcome back") 
    return; 
  }
  
  if (opt["dockerInDocker"] === answer.operation) {
    
    const answer2 = await inquirer.prompt(question2);
    console.log("回答:  ", answer2);
    if (opt2["devcontainerBuild"] ===  answer2.operation) {
        // const child = execFile('node', ['--version'], (error, stdout, stderr) => {
        // if (error) {
        //     throw error;
        // }
        // console.log(stdout);
        // });

        const answer3 = await inquirer.prompt(question3);
        console.log("回答:  ", answer3);
        if (opt3["frontendDev"] === answer3.operation){
          console.log("waiting...")
          await exec('git clone https://github.com/oldwinter/MetaCloud.git')
          await exec('npm install -g @vscode/dev-container-cli')
          await exec('cd portal && devcontainer build')

        }
        if (opt3["fullstackDev"] === answer3.operation){

        }
        if (opt3["devopsDev"] === answer3.operation) {

        }

        // await open('/Users/cdd/Works/code/MetaCloud/MetaCloud.code-workspace')

        return
    }
    if (opt["devcontainerPull"] === answer2.operation ){
        console.log("coming soon")  
        return
    }

  }
  if (opt["dockerFromDocker"] === answer.operation) {
    console.log("coming soon")  
    return;
  }
  if (opt["remoteSSH"] === answer.operation) {
    console.log("coming soon")  
    return;
}
//   if (answer.operation === )

  return
}