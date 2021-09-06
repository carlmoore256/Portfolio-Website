import { ManagedScene } from './ManagedScene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { VRButton } from 'three/VRButton.js';
import { GrainObject } from './grain.js'

// import { Raycaster } from './three/three.module.js';
import { Object3D, Raycaster, Color, PerspectiveCamera, Vector, Vector2, Vector3, WebGLRenderer, Mesh, MeshBasicMaterial, SphereGeometry } from 'three';

import Meyda, { MeydaFeaturesObject, MeydaAnalyzer } from 'meyda';

import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
// import { GUI } from 'three/dat.gui.module'


export class TimbreSpace extends ManagedScene {

    private INTERSECTED : any;
    private raycaster : Raycaster;
    private pointer : Vector2 = new Vector2();
    private orbitControls : OrbitControls;
    private centerPos : Vector3;
    private guiData : any;
    private gui : any;

    private isXR : boolean;

    private audioContext : AudioContext;
    private currentSource : any;
    private audioElement : any;


    public soundFile = '../../media/audio/CISSA2.wav';
    public winSize = 2048;
    public hopSize = 512;
    public m_RadiusScl = 5;

    public m_AvgCenter : Vector3;
    private m_MainGrainModel : Object3D;
    private m_AllGrains : GrainObject[] = [];

    private document : Document;

    private features : any;
    private audioContextRunning : boolean;

    private outputBuffer : AudioBuffer;
    private outputSource : AudioBufferSourceNode;

    private normStats : any = {};

    constructor(width : number, height : number, isXR : boolean, document : Document, soundFile : string)
    {
        super(width, height);
        this.isXR = isXR;
        this.document = document;
        this.audioContextRunning = false;
        this.soundFile = soundFile;
        this.audioContext = new AudioContext();

        this.audioElement = this.document.getElementById("audio_src");
        this.m_AvgCenter = new Vector3(0,0,0);

        this.guiData = {
            xAxis : "mfcc_1",
            yAxis : "mfcc_2",
            zAxis : "mfcc_3",
            rColor : "mfcc_4",
            gColor : "mfcc_5",
            bColor : "mfcc_6",
            rotate : true,
            // xCenter : 140,
            // yCenter : 60,
            // zCenter : 32,
            maxGrains : 500,
        };

        this.createGUI();
    }

    _initRenderer(){
        this.renderer = new WebGLRenderer( { antialias: true, alpha: true });
        (this.renderer as WebGLRenderer).setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.width, this.height );
    }

	_initCamera(){
		this.camera = new PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
		this.camera.position.set( 180, 0, 300 );
	}

    _initScene(){
        // scene defined in ManagedScene
        // this.scene.background = new Color( 0x000000 );
        
		this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
		this.orbitControls.enableDamping = true;
		this.orbitControls.maxAzimuthAngle = Math.PI * 0.5;
		this.orbitControls.enablePan = true;
		this.orbitControls.screenSpacePanning = true;
        this.orbitControls.autoRotate = true;

		// window.addEventListener( 'resize', onWindowResize );

		this.raycaster = new Raycaster();
        
		this.renderer.domElement.addEventListener( 'mousemove', this.onPointerMove.bind(this) );
        
        window.addEventListener( 'resize', this.onWindowResize );
        this.raycaster = new Raycaster();
        this.document.addEventListener( 'mousemove', this.onPointerMove );
        
        // enable vr rendering if available
        // document.body.appendChild( VRButton.createButton( this.renderer ) );
        // if(this.isXR)
        // {
        //     this.renderer.xr.enabled = true;
        // }
    }


    createGUI() {
        if (this.gui) this.gui.destroy();

        this.gui = new GUI();

        this.guiData.ctrPos = new Vector3(140,60,32);
        const ctrPosFolder = this.gui.addFolder('Center Pos');
        ctrPosFolder.add(this.guiData.ctrPos, 'x', -360.0, 360.0);
        ctrPosFolder.add(this.guiData.ctrPos, 'y', -360.0, 360.0);
        ctrPosFolder.add(this.guiData.ctrPos, 'z', -360.0, 360.0);
        ctrPosFolder.open();

        
        this.guiData.maxGrains = 500;

        const grainModelFolder = this.gui.addFolder('Model Options');
        grainModelFolder.add(this.guiData, 'maxGrains', 0, 1000);
        grainModelFolder.open();

        const grainModelFeatures = {
            "mfcc_1" : 0,
            "mfcc_2" : 1,
            "mfcc_3" : 2,
            "mfcc_4" : 3,
            "mfcc_5" : 4,
            "mfcc_6" : 5,
            "mfcc_7" : 6,
            "mfcc_8" : 7,
            "mfcc_9" : 8,
            "mfcc_10" : 9,
            "loudness" : "loudness",
            "rms" : "rms"
        }

        this.gui.add(this.guiData, "xAxis", grainModelFeatures).name("x-axis feature").onChange( updateAxisOrder );
        this.gui.add(this.guiData, "yAxis", grainModelFeatures).name("y-axis feature").onChange( updateAxisOrder );
        this.gui.add(this.guiData, "zAxis", grainModelFeatures).name("z-axis feature").onChange( updateAxisOrder );

        // this.gui.add(this.guiData, grainModelFeatures).name("R feature").onChange( updateAxisOrder );
        // this.gui.add(this.guiData, grainModelFeatures).name("G feature").onChange( updateAxisOrder );
        // this.gui.add(this.guiData, grainModelFeatures).name("B feature").onChange( updateAxisOrder );

        function updateAxisOrder() {
            // update grains here somehow
        }

        function updateColorOrder() {
            // update grain colors
        }

    }

    updateGrainAxisOrder()
    {
    }

    startAudioContext()
    {
        this.audioContext = new AudioContext();
        this.audioContext.resume();
        // this.audioContext.connect(outputSource);
    }

    // loads an audio file into the context, returns a source
    loadAudioFile(soundFile : string)
    {
        // this.document.getElementById("audio_src")!.src = soundFile;
        // this.document.getElementById("audio_src").load();
        // const htmlAudioElement = this.document.getElementById("audio_src");
        // this.audioContext = new AudioContext();
        // this.audioContext.resume();
        // this.startAudioContext();
        // audioElement = this.document.getElementById("audio_src");
        this.audioElement.load();
        this.audioElement.autoplay = true;
        var source = this.audioContext.createMediaElementSource(this.audioElement);
        source.connect(this.audioContext.destination);
        return source
    }


    audioPlaybackEngine()
    {
        // let buffer : AudioBuffer = this.audioContext.createBuffer(1, 512, );
        let channels = 1;

        for (var channel = 0; channel < channels; channel++) {
            // This gives us the actual ArrayBuffer that contains the data
            var nowBuffering = myArrayBuffer.getChannelData(channel);
            for (var i = 0; i < frameCount; i++) {
                // Math.random() is in [0; 1.0]
                // audio needs to be in [-1.0; 1.0]
                nowBuffering[i] = Math.random() * 2 - 1;
            }
        }

        // Get an AudioBufferSourceNode.
        // This is the AudioNode to use when we want to play an AudioBuffer
        var source = audioCtx.createBufferSource();
        // set the buffer in the AudioBufferSourceNode
        source.buffer = myArrayBuffer;
        // connect the AudioBufferSourceNode to the
        // destination so we can hear the sound
        source.connect(audioCtx.destination);
        // start the source playing
        source.start();
    }

    // eventually make grain model its own class
    // returns an object containing all of the grains
    spawnGrainModel(soundFile : string)
    {
        let container = new Object3D();
        this.scene.add(container);
        // extract features
        this.feature_extractor(
            this.loadAudioFile(soundFile), 
            this.winSize, 
            this.hopSize, 
            this.m_RadiusScl, 
            container
        );
        this.scene.add(container);
        return container;
    }

    // get 3D axes from audio features
    feature_extractor(
        source : any,
        winSize : number, 
        hopSize : number, 
        scale : number, 
        container : Object3D) 
    {
        // let mfcc_coeffs = [];
        // let features : Partial<Meyda.MeydaFeaturesObject>;

        let normStat : any = {}; // normStat - dict containing min and max mfcc norm vals
        normStat.mfcc_max = [];
        normStat.mfcc_min = [];
        
        const analyzer = Meyda.createMeydaAnalyzer({
            "audioContext": this.audioContext,
            "source": source,
            "bufferSize": winSize,
            "hopSize": hopSize,
            "featureExtractors": [ "mfcc", "loudness", "buffer", "rms" ], //buffer returns raw audio
            "numberOfMFCCCoefficients": 6, //specify max mfcc coeffs
            "callback": features => this.analyzer_callback(features!, scale, container, normStat)
        });
        analyzer.start();
    }

    // MeydaFeaturesObject
    // features : Partial<Meyda.MeydaFeaturesObject>
    analyzer_callback(
        features : Partial<Meyda.MeydaFeaturesObject>, 
        scale : number, 
        container : Object3D, 
        normStat : any)
    {
        if (this.audioElement.paused) { return; }

        let rms = features.rms;
        let mfcc = features.mfcc;
        let buffer = features.buffer;

        // figure out a better way to do this
        mfcc = mfcc!;
        rms = rms!;
        buffer = buffer!;
        
        if ( rms > 0.001)
        {
            let posScalar = 1;
            let colScalar = 0.1;

            if(mfcc[0] == NaN) { return };

            // for (let i = 0; i < mfcc.length; i++)
            // {
            //     if (normStat.mfcc_max[i] > normStat.mfcc_max[i])
            //     {

            //     }
            //     normStat.mfcc_max[i] = Math.max(mfcc[i], normStat.mfcc_max[i]);
            //     normStat.mfcc_min[i] = Math.min(mfcc[i], normStat.mfcc_min[i]);
            // }

            const position = new Vector3(  mfcc[0]*posScalar,  mfcc[1]*posScalar,  mfcc[2]*posScalar );
            const color = new Color(  mfcc[3]*colScalar,  mfcc[4]*colScalar,  mfcc[5]*colScalar );
            const radius =  rms * scale;


            // console.log(max, min);
            // mfcc.map(value => isNaN(value) ? 0 : value);
            // console.log(Math.max(mfcc[0]));
            // console.log(Math.min(mfcc[0]));

            // console.log(mfcc);
            // for(let i = 0; i<mfcc.length; i++)
            // {
            //     console.log
            // }

            // remember to add scale eventually
            const geometry = new SphereGeometry( radius, 8, 8 );
            const material = new MeshBasicMaterial( {color: color} );
            var object = new Mesh( geometry, material );
            // object.parent = this.m_MainGrainModel;
            container.add(object);

            var grain = new GrainObject(
                object,
                buffer,
                position,
                color,
                features)
            

            if (isNaN(this.m_AvgCenter.x)) { 
                this.m_AvgCenter = new Vector3(0,0,0);
            }

            var newAvg = this.m_AvgCenter.clone().add(position);
            this.m_AvgCenter.set(newAvg.x, newAvg.y, newAvg.z);
            
            // this.m_AllGrains.push(grain);

            // this.m_AllGrains.length
            while (container.children.length > this.guiData.maxGrains)
            {
                this.deleteGrain(container, 0);
                // container.remove(container.children[0]);
                // this.deleteGrain(container, this.m_AllGrains.shift()!);
            }
        }
    }

    deleteGrain(container : Object3D, index : number)
    {
        container.remove(container.children[index]);
    }

    _animate() {

        this.raycastObjects();

        if (this.m_MainGrainModel != undefined)
        {
            // var centerTarget : Vector3 = this.m_AvgCenter.divideScalar(this.m_MainGrainModel.children.length);
            // var currentLoc = this.orbitControls.target;
            // var newLoc = currentLoc.lerp(centerTarget, 0.5);
            // this.orbitControls.target.set(centerTarget.x, centerTarget.y, centerTarget.z);

            this.orbitControls.target = this.guiData.ctrPos;
            this.orbitControls.update();
        }

        // this.renderer.setAnimationLoop( function () {
        //     this.renderer.render( this.scene, this.camera );
        // } );

        // // requestAnimationFrame( animate );
        // if (this.m_MainGrainModel != undefined)
            // this.m_MainGrainModel.rotation.x += 0.1;
        // this.render();
        // stats.update();
        // console.log(this.camera);
    }

    raycastObjects()
    {
        if (this.m_MainGrainModel != undefined)
        {
            // console.log(this.pointer);

            this.raycaster.setFromCamera( this.pointer, this.camera );

            const intersects = this.raycaster.intersectObjects( this.m_MainGrainModel.children );

            if ( intersects.length > 0 ) {

                if ( this.INTERSECTED != intersects[ 0 ].object ) {

                    this.INTERSECTED = intersects[ 0 ].object;

                    let grain : GrainObject  = this.INTERSECTED.userData;

                    grain.playAudio(1.0);
                }
            } else {

                this.INTERSECTED = null;
            }
        }
    }
	
    onPointerMove( event : any ) {

        if (this.pointer != undefined)
        {
            // this.audioPlaybackEngine();
            if(this.audioContext.state == "suspended")
            {
                this.startAudioContext();
                this.audioContextRunning = false;
            }

            if(this.audioContext.state == "running" && !this.audioContextRunning)
            {
                this.audioContextRunning = true;
                this.m_MainGrainModel = this.spawnGrainModel(this.soundFile);
            }

            this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        }
    }

    onWindowResize() {
        // if (this.renderer != undefined)
        // {
        //     this.renderer.setSize( window.innerWidth, window.innerHeight );
        // }
        // this.camera.aspect = window.innerWidth / window.innerHeight;
        // this.camera.updateProjectionMatrix();
        // this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    // Existing code unchanged.
    // window.onload = function() {
    //     let audioContext = new AudioContext();
    // }

    // One-liner to resume playback when user interacted with the page.
    // document.querySelector('audio').addEventListener('play', function() {
    //     this.audioContext.resume().then(() => {
    //         console.log('Playback resumed successfully');
    //     });
    // });
}