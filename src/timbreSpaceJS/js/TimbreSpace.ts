import { ManagedScene } from './ManagedScene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { VRButton } from 'three/VRButton.js';
import { GrainObject } from './grain.js'

// import { Raycaster } from './three/three.module.js';
import { Object3D, Raycaster, Color, PerspectiveCamera, Vector, Vector2, Vector3, WebGLRenderer, Mesh, MeshBasicMaterial, SphereGeometry, ImageLoader, TextureLoader, SpriteMaterial, Sprite } from 'three';
// import {createMeydaAnalyzer} from './meyda/'
import Meyda, { MeydaFeaturesObject, MeydaAnalyzer } from 'meyda';
// import {createMeydaAnalyzer} from Meyda

export class TimbreSpace extends ManagedScene {

    private INTERSECTED : any;
    private raycaster : Raycaster;
    private pointer : Vector2 = new Vector2;
    private orbitControls : OrbitControls;

    private isXR : boolean;

    private audioContext : AudioContext;
    private currentSource : any;
    // private source : 

    // let audioContext, source;

    public m_MaxGrains = 10;
    public m_RadiusScl = 5;

    public soundFile = '../../media/audio/CISSA2.wav';
    public winSize = 2048;
    public hopSize = 512;

    public m_AvgCenter : Vector3;
    private m_MainGrainModel : Object3D;

    private document : Document;

    private features : any;
    private audioContextRunning : boolean;
    private m_GrainModels : any;

    // let m_AvgCenter = new THREE.Vector3();

    // let m_Grains = [];

    // init();
    // animate();

    constructor(width : number, height : number, isXR : boolean, document : Document, soundFile : string)
    {
        super(width, height);
        this.isXR = isXR;
        this.document = document;
        this.audioContextRunning = false;
        this.soundFile = soundFile;
        this.audioContext = new AudioContext();

    }

    _initRenderer(){
        this.renderer = new WebGLRenderer( { antialias: true, alpha: true });
        (this.renderer as WebGLRenderer).setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.width, this.height );
    }

	_initCamera(){
		this.camera = new PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
		this.camera.position.set( 0, 0, 200 );
	}

    _initScene(){
        // scene defined in ManagedScene
        this.scene.background = new Color( 0x000000 );
        
		this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
		this.orbitControls.enableDamping = true;
		this.orbitControls.maxAzimuthAngle = Math.PI * 0.5;
		this.orbitControls.enablePan = false;
		this.orbitControls.screenSpacePanning = true;

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

        // initialize objects
        // this.m_GrainParent = new Object3D();
        // this.scene.add(this.m_GrainParent)
        
        // // extract features
        // this.feature_extractor(
        //     this.loadAudioFile(this.soundFile), 
        //     this.winSize, 
        //     this.hopSize, 
        //     this.m_RadiusScl, 
        //     this.m_GrainParent
        // );
    }

    startAudioContext()
    {
        this.audioContext = new AudioContext();
        this.audioContext.resume();
        // this.audioContextRunning = true;
    }

    // loads an audio file into the context, returns a source
    loadAudioFile(soundFile : string)
    {
        // this.document.getElementById("audio_src")!.src = soundFile;
        // this.document.getElementById("audio_src").load();
        // const htmlAudioElement = this.document.getElementById("audio_src");
        // this.audioContext = new AudioContext();
        // trying to overcome audio playback issues
        // this.audioContext.resume();

        // instantiate a loader
        const loader = new ImageLoader();


        // this.startAudioContext();
        // var audioElement = new Audio(soundFile);
        // var audioElement = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
        // var audioElement = new Audio('../../media/audio/piano2.wav');


        console.log(soundFile);
        // audio context
        // audioContext
        // let audioElement : HTMLAudioElement;
        let audioElement : any;
        audioElement = this.document.getElementById("audio_src");
        console.log("TESTT!!!");

        console.log(audioElement.src);
        // audioElement.crossOrigin = "anonymous";
        // audioElement.src = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";
        audioElement.load();
        // var audioElement = new Audio("https://www.kozco.com/tech/piano2.wav");
        audioElement.autoplay = true;
        // audioElement.crossOrigin = "anonymous";
        // console.log(this.audioContext)
        // console.log(audioElement);
        
        var loc = window.location.pathname;
        console.log(loc);
        var source = this.audioContext.createMediaElementSource(audioElement);
        source.connect(this.audioContext.destination);

        // console.log(source);
        return source
    }

    // eventually make grain model its own class
    // returns an object containing all of the grains
    spawnGrainModel(soundFile : string)
    {
        console.log("SPAWNING GRAIN MODEL!");
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
        
        console.log(container);
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
        let mfcc_coeffs = [];
        let features : Partial<Meyda.MeydaFeaturesObject>;
        
        console.log(source);
        const analyzer = Meyda.createMeydaAnalyzer({
            "audioContext": this.audioContext,
            "source": source,
            "bufferSize": winSize,
            "hopSize": hopSize,
            "featureExtractors": [ "mfcc", "loudness", "buffer", "rms" ], //buffer returns raw audio
            "numberOfMFCCCoefficients": 6, //specify max mfcc coeffs
            "callback": features => this.analyzer_callback(features!, scale, container)
        });
        analyzer.start();
    }

    // MeydaFeaturesObject
    // features : Partial<Meyda.MeydaFeaturesObject>
    analyzer_callback(features : Partial<Meyda.MeydaFeaturesObject>, scale : number, container : Object3D)
    {
        let rms = features.rms;
        let mfcc = features.mfcc;

        // figure out a better way to do this
        mfcc = mfcc!;
        rms = rms!;
        
        if ( rms > 0.001)
        {
            let posScalar = 1;
            let colScalar = 0.1;

            const position = new Vector3(  mfcc[0]*posScalar,  mfcc[1]*posScalar,  mfcc[2]*posScalar );
            const color = new Color(  mfcc[3]*colScalar,  mfcc[4]*colScalar,  mfcc[5]*colScalar );

            const radius =  rms * scale;

            // color.setHex(0x44aa88);
            console.log(color);

            // remember to add scale eventually
            const geometry = new SphereGeometry( radius, 8, 8 );
            const material = new MeshBasicMaterial( {color: color} );
            var object = new Mesh( geometry, material );
            object.parent = container;
            // object.position.set(position.x, position.y, position.z);

            var grain = new GrainObject(
                object,
                this.features.buffer,
                position,
                color,
                this.features
            )
            
            // CONSIDER REMOVING!
            this.scene.add(object);
            // all grains can be referenced by the container.children variable
            // m_Grains.push(grain);
        }
    }

    _animate() {

        // this.renderer.setAnimationLoop( function () {
        //     this.renderer.render( this.scene, this.camera );
        // } );

        // // requestAnimationFrame( animate );

        // render();


        // stats.update();
        // let index = m_Grains.length-1;
        // while (m_Grains.length > m_MaxGrains)
        // {
        // 	m_Scene.remove(m_Grains[m_Grains.length-1].object);
        // 	m_Grains.splice(0, 1)
        // }

    }

    render() {
        // raycastObjects();
        this.renderer.render( this.scene, this.camera );
        // console.log("TESST!");
    }

    raycastObjects()
    {
        // this.raycaster.setFromCamera( this.pointer, this.camera );

        // const intersects = this.raycaster.intersectObjects( components );

        // if ( intersects.length > 0 ) {

        //     if ( INTERSECTED != intersects[ 0 ].object ) {

        //     INTERSECTED = intersects[ 0 ].object;
        //     }
        // } else {

        //     INTERSECTED = null;

        // }
    }
	
    onPointerMove( event : any ) {

        if (this.audioContext != undefined)
        {

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
        }

        // if (this.startAudioContext != undefined && !this.audioContextStart)
        // {
        //     this.startAudioContext();
        // }

        // if (this.spawnGrainModel != undefined)
        // {

        //     // console.log(this.audioContext);
        //     // creates a new grain model, this could also be added to a list of grain models
        //     this.m_MainGrainModel = this.spawnGrainModel(this.soundFile);

        //     console.log(this.m_MainGrainModel);

        // }
        // this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        // this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    onWindowResize() {
        // this.camera.aspect = window.innerWidth / window.innerHeight;
        // this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
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