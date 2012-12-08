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
     console.log("deploy success!")
   } else {
     cb("deploy failed, exit code: " + exitCode, true)
     console.log("deploy failed!")
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

  board.repl.inject({
    button: button
  })

  // Start deploy when button is released
  button.on("up", function() {
    redLed.strobe()
    greenLed.stop().off()
    startDeploy(function(err) {
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
  })

})
