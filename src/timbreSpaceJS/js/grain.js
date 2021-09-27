import { throws } from 'assert';
import { Color, Vector2, Vector3 } from 'three';

export class GrainObject {
  constructor (object, buffer, position, scale, color, features) {
    this.object = object;
    this.features = features;

    this.object.position.set(position.x, position.y, position.z);
    this.object.targetPosition = position;

    this.targetColor = color;
    this.targetScale = scale;
    
    this.buffer = buffer;

    this.object.userData = this;
    this.updateActive = true;

  }

  update () {

    // perform update routine
    if (this.updateActive && this.targetPosition != undefined)
    {
      let dist = this.object.position.distanceTo(this.targetPosition);
      if(dist > 0.0001)
      {
        let lerp = this.object.position.lerp(this.targetPosition, 0.1);
        this.object.position.set(lerp.x, lerp.y, lerp.z);
      } else {
        this.updateActive = false;
        this.object.position.set(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z);
      }
    }

  }

  playAudio(amplitude)
  {
    console.log(this.object.material);
    let color = new Color(1,0,0);
    this.changeColor(color);
    // this.source.start();
  }

  changeColor(color)
  {
    this.object.material.color = color;
  }

  updateOrdering(keyX, keyY, keyZ, keyR, keyG, keyB)
  {
    this.updateActive = true;
    this.targetPosition = new Vector3(
      this.features[keyX],
      this.features[keyY],
      this.features[keyZ]);

    this.targetColor = new Color(
      this.features[keyR],
      this.features[keyG],
      this.features[keyB]);
  }

  // removes buffer geometry and materials
  deleteGrain()
  {
    // console.log(this.object);
    this.object.material.dispose();
    this.object.geometry.dispose();
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