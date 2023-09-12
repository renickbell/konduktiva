// --------------------------------------------------------------------------
// -- installer.js
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

const { spawn } = require('node:child_process');

// let packages = ['easymidi', 'osc', 'path', 'perf_hooks', 'ramda', 'tasktimer', 'tonal', 'socket.io', 'socket.io-client', 'http-server']

let packages = ['easymidi', 'osc', 'ramda', 'tasktimer', 'tonal', 'socket.io', 'socket.io-client', 'http-server', 'array-toolkit']

let currentInstallingIndex = 0
function installPackages(packages) {
  if (currentInstallingIndex >=  packages.length - 1) {
    console.log('Packages installation completed.');
    return;
  }
  let currentPackage = packages[currentInstallingIndex];
  console.log(`Installing ${currentPackage}...`);
  let installProcess = spawn('npm', ['install', currentPackage]);
  installProcess.on('close', () => {
    currentInstallingIndex += 1;
    installPackages(packages);
  });
  installProcess.on('error', (error) => {
    console.error(`Error installing ${currentPackage}: ${error.message}`);
    currentInstallingIndex += 1;
    installPackages(packages);
  });
}
//Helped by chatgpt

installPackages(packages)
