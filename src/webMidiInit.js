import { WebMidi } from "webmidi";


export function webMidiInit() {
  WebMidi
      .enable()
      .then(onEnabled)
      .catch(err => alert(err));
}

function onEnabled() {
  if (WebMidi.inputs.length < 1) {
      console.log("no inputs")
  } else {
      let output = WebMidi.outputs[0]; // or
      console.log(`ENABLED`)
  }
}