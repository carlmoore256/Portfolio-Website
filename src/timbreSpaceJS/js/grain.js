import { Color, Vector2, Vector3 } from 'three';

export class GrainObject {
  constructor (object, buffer, position, color, features) {
    this.object = object;
    this.object.position.set(position.x, position.y, position.z);

    // this.buffer = buffer;
    this.position = position;
    this.color = color;
    this.features = features;

    this.object.userData = this;

    this.updateActive = true;

  }

  update () {

    // perform update routine
    if (this.updateActive)
    {
      
    }

  }

  playAudio(amplitude : number)
  {
    console.log(this.object.material);
    let color : Color = new Color(1,0,0);
    this.changeColor(color);
    // this.source.start();
  }

  changeColor(color : Color)
  {
    this.object.material.color = color;
  }
}



    // this.audioContext = audioContext;

    // this.audioBuffer = audioContext.createBuffer(1, this.buffer.length, audioContext.sampleRate);

    // console.log(this.buffer);

    // this.audioBuffer.getChannelData(0) = buffer;
    // var bufferData = this.audioBuffer.getChannelData(0);

    // for(let i = 0; i < this.audioBuffer.length; i++)
    // {
    //   bufferData[i] = buffer[i];
    // }

    // this.source = audioContext.createBufferSource();
    // this.source.buffer = this.audioBuffer;
    // this.source.connect(audioContext.destination);

    // just random values between -1.0 and 1.0
    // for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
    //   // This gives us the actual ArrayBuffer that contains the data
    //   var nowBuffering = myArrayBuffer.getChannelData(channel);
    //   for (var i = 0; i < myArrayBuffer.length; i++) {
    //     // Math.random() is in [0; 1.0]
    //     // audio needs to be in [-1.0; 1.0]
    //     nowBuffering[i] = Math.random() * 2 - 1;
    //   }
    // }
    // this.audioBuffer 