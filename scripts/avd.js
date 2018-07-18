#!/usr/bin/env node

const showAvdMenu = require('./helpers/showAvdMenu')
const runEmulator = require('./helpers/runEmulator')
const checkForDevice = require('./helpers/checkForDevice')
const argv = require('yargs')
  .option('wait', {
    alias: 'w',
    defalt: false
  })
  .argv

main()

function main() {
  checkForSuppliedAvdName().then(cont => {
    if(cont){
      return checkForDevice().then(on => !on)
    } else {
      console.log('Launching AVD...')
    }
  }).then(cont => {
    if(cont){
      return showAvdMenu(avd => runEmulator(avd.name, true, argv.wait))
    } else {
      console.log('AVD discovered')
    }
  }).catch(err => {
    console.error('An error occurred', err)
    process.exit(2)
  })
}

function checkForSuppliedAvdName() {
  var avdName = argv._[0]
  if(avdName){
    runEmulator(avdName)
  }
  return Promise.resolve(!avdName)
}

function tryRunningDevice(){
  return checkForDevice()
}
