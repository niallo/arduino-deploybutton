var five = require("johnny-five")
var spawn = require('child_process').spawn
var board = new five.Board()

var DELAY_OFFSET = 11
var BEEP_PIN = 12

function startDeploy(cb) {
  // Emulate a 10 second long, successful deploy
  setTimeout(function() {
    cb(null, true)
  }, 10000)
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
    console.log("up")
    redLed.strobe()
    greenLed.stop().off()
    startDeploy(function(err) {
      if (err) {
        redLed.on()
        greenLed.stop().off()
      }
      redLed.stop().off()
      greenLed.on()


    })
  })

})
