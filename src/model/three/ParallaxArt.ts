import { Box3, Camera, Color, FrontSide, GridHelper, Group, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Raycaster, Renderer, Scene, ShapeGeometry, Vector2, Vector3, WebGLRenderer } from 'three'

// import Stats from './stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { render } from '@testing-library/react';
import { ManagedScene } from './ManagedScene';
import { forEach } from 'lodash';
// import { VRButton } from './VRButton.js';

export class ParallaxArt extends ManagedScene {

	private INTERSECTED : any;
	private raycaster : Raycaster;
	private pointer : Vector2 = new Vector2();
	private orbitControls : OrbitControls;
	
	private guiData = {
		drawFillShapes: true,
		drawStrokes: true,
		fillShapesWireframe: false,
		strokesWireframe: false
	};

	private orientationControls : DeviceOrientationControls;
	private SVGmeshes : Mesh[][] = [];
	
	public movementSpd = 0.1;
	public movementMult = 0.1;

	// this.init();
	// animate();

	constructor(width : number, height : number, private linksToSVG : string[], private layerSpacing : number)
	{
		super(width, height);
	}

	_initRenderer(){
		this.renderer = new WebGLRenderer( { antialias: true, alpha: true } );
		(this.renderer as WebGLRenderer).setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.width, this.height );
	}
	
	_initCamera(){
		this.camera = new PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
		this.camera.position.set( 0, 0, 200 );
	}


	_initScene(){
		this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
		this.orbitControls.enableDamping = true;
		this.orbitControls.maxAzimuthAngle = Math.PI * 0.5;
		this.orbitControls.enablePan = false;
		this.orbitControls.screenSpacePanning = true;

		// window.addEventListener( 'resize', onWindowResize );

		this.raycaster = new Raycaster();
		
		this.renderer.domElement.addEventListener( 'mousemove', this.onPointerMove.bind(this) );
		// let bgColor = new Color("rgb")
		// this.scene.background = new Color(0xffffff);
		// this.scene
		
		this.linksToSVG.forEach((item, index) => {
			this.loadSVG(item, index * this.layerSpacing, (this.linksToSVG.length-index) * 0.1 + 1);
		});
	};
	
	onPointerMove( event : any ) {	
	  this.pointer.x = ( event.clientX / this.width ) * 2 - 1;
	  this.pointer.y = - ( event.clientY / this.height ) * 2 + 1;
	}
	
	
	loadSVG( url : string, z_ofs : number, layerScale : number ) {
	
		const loader = new SVGLoader();
	
		loader.load( url, ( data ) => {
	
			const paths = data.paths;
			const group = new Group();
			group.scale.multiplyScalar( 0.18 );
			group.position.x = -61;
			group.position.y = 75;
			group.scale.y *= - 1;
	
			let meshes = [];

			for ( let i = 0; i < paths.length; i ++ ) {
	
				const path : any = paths[ i ];
	
				const fillColor = path.userData.style.fill;
				if ( this.guiData.drawFillShapes && fillColor !== undefined && fillColor !== 'none' ) {
	
					const material = new MeshBasicMaterial( {
						color: new Color().setStyle( fillColor ),
						opacity: path.userData.style.fillOpacity,
						transparent: path.userData.style.fillOpacity < 1,
						side: FrontSide,
						depthWrite: false,
						wireframe: this.guiData.fillShapesWireframe
					} );
	
					const shapes = SVGLoader.createShapes( path );

					
					for ( let j = 0; j < shapes.length; j ++ ) {
	
						const shape = shapes[ j ];
	
						const geometry = new ShapeGeometry( shape );
						const mesh = new Mesh( geometry, material );
						// mesh.translateZ(-shape.curves.length/30);
						mesh.translateZ(Math.random() * 100);
						// mesh.translateZ(Math.random() * 100);
						group.add( mesh );
						meshes.push(mesh);
					}
				}
			}
			group.translateZ(z_ofs);
			// let scaleGroup = new Vector3 (layerScale, layerScale, layerScale);
			// (group as Object3D).scale(scaleGroup));
			// group.scale.set(group.scale.x * layerScale, group.scale.y * layerScale, group.scale.z * layerScale);
			this.scene.add( group );
			this.SVGmeshes.push(meshes);
	
		} );
	
	}

	_animate() 
	{
		// this.raycastObjects();
		this.movement();
		this.orbitControls.update();
		this.renderer.render( this.scene, this.camera );
	}
	
	// onWindowResize() {
	
	// 	camera.aspect = window.innerWidth / window.innerHeight;
	// 	camera.updateProjectionMatrix();
	
	// 	renderer.setSize( window.innerWidth, window.innerHeight );
	
	// }
	
	movement() {
	
		for(const meshes of this.SVGmeshes)
		{
			meshes.forEach((mesh, index) => {
				let frame = (this.renderer as WebGLRenderer).info.render.frame;
		
				let pos_x = Math.cos(((index/meshes.length)*Math.PI*2.) + (frame * this.movementSpd));
				let pos_y = Math.sin(((index/meshes.length)*Math.PI*2.) + (frame * this.movementSpd));
				let pos_z = Math.sin(((index/meshes.length)*Math.PI*2.) + (frame * this.movementSpd));
				mesh.translateX(pos_x * this.movementMult);
				mesh.translateY(pos_y * this.movementMult);
				mesh.translateZ(pos_z * this.movementMult);

				// (mesh.material as MeshBasicMaterial).color.setHSL(Math.sin((frame + index) * this.movementSpd), (1-(index/meshes.length)) * 0.3, 0.5 );
				// let scale = new Vector3(Math.cos((Math.sin((frame + index), Math.sin((frame + index), Math.sin(frame + index));
				// (mesh.geometry as ShapeGeometry).scale(scale.x, scale.y, scale.z);
			})
		}
	}
	

	
	raycastObjects()
	{
	  this.raycaster.setFromCamera( this.pointer, this.camera );


	  for(const meshes of this.SVGmeshes)
	  {
		const intersects = this.raycaster.intersectObjects( meshes );
	
		if ( intersects.length > 0 ) {
	  
		  if ( this.INTERSECTED != intersects[ 0 ].object ) {
	  
			  this.INTERSECTED = intersects[ 0 ].object;
	  
			// INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
				  // color.setHSL(Math.random(), 0.5, 0.9);
			// INTERSECTED.material.color.setHex( Math.random() * 0xffffff );
		  }
		} else {
	  
		  // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
	  
		  this.INTERSECTED = null;
	  
		}
	  }
	}
	
} 
