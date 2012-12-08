var argv = require('optimist')
      .usage('Arduino deploy button')
      .demand('d')
      .describe('d', 'project directory')
      .argv
var five = require("johnny-five")
var spawn = require('child_process').spawn
var board = new five.Board()

var DELAY_OFFSET = 11
var BEEP_PIN = 12

var dir = argv.d

function startDeploy(cb) {
  console.log("starting deploy")
  // Emulate a 10 second long, unsuccessful deploy
  /*
  setTimeout(function() {
    cb("deploy failed!", null)
  }, 10000)
  // Emulate a 10 second long, unsuccessful deploy
  setTimeout(function() {
    cb(null, true)
  }, 10000)
  */

 var sh = spawn("git", ["push", "heroku", "master"], {cwd:dir})
 sh.stdout.setEncoding('utf8')
 sh.stderr.setEncoding('utf8')

 sh.on('close', function(exitCode) {
   if (exitCode == 0) {
     cb(null, true)
   } else {
     cb("deploy failed, exit code: " + exitCode, true)
   }
 })

 sh.stdout.on('data', function(data) {
   console.log(data)
 })

 sh.stderr.on('data', function(data) {
   console.log(data)
 })
}

board.on("ready", function() {

  var redLed = new five.Led(13)
  var greenLed = new five.Led(12)
  var button = new five.Button(8)
  var bumper = new five.Button(7);
  var inProgress = false

  function go() {
    if (inProgress) {
      console.log("deploy already in progress")
      return
    }

    inProgress = true
    redLed.strobe()
    greenLed.stop().off()
    startDeploy(function(err) {
      inProgress = false
      if (err) {
        console.log("deploy failed!")
        redLed.stop()
        redLed.on()
        greenLed.stop().off()
        return
      }
      console.log("deploy success!")
      redLed.stop().off()
      greenLed.on()
    })

  }


  // Start deploy when bumper is hit
  bumper.on('hit', function() {
    go()
  })

  // Start deploy when button is released
  button.on("up", function() {
    go()
  })

})
