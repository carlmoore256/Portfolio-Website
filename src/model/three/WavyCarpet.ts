import { ManagedScene } from "./ManagedScene";
import {
    BoxGeometry, BufferGeometry,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Vector3, VideoTexture
} from "three";

import SimplexNoise from "simplex-noise";

class WaveTile {
    constructor(
        public coord: { x: number, z: number },
        public height: number,
        public mesh: Mesh) {
    }

    updateY(frame: number, noiseGenerator: SimplexNoise) {
        const f = frame / 250;
        const sampleX = this.coord.x / 100 + f;
        const sampleY = this.coord.z / 100 + f;
        const n = noiseGenerator.noise2D(sampleX, sampleY);
        this.mesh.position.y = n * this.height;
    }

    updateColor(frame: number = 0) {
        const f = frame / 500;
        const x = this.coord.x + f * 2;
        const z = this.coord.z + f;
        const color = Math.floor(f + (Math.sin(x / 250) * 0xFFFFFF) +
            (Math.cos(z / 250) * 0xFFFFFF)) % 0xFFFFFF;
        const mat = this.mesh.material as MeshBasicMaterial;
        mat.color.setHex(color);
    }
}

function change_uvs(geometry: BufferGeometry,
                    unitx: number, unity: number,
                    offsetx: number, offsety: number) {
    const uvs = geometry.attributes.uv.array as number[];
    for (let i = 0; i < uvs.length; i += 2) {
        uvs[i] = (uvs[i] + offsetx) * unitx;
        uvs[i + 1] = (uvs[i + 1] + offsety) * unity;
    }
}

/** manages a threejs scene which renders a wavy carpet */
export class WavyCarpet extends ManagedScene {
    private particles: WaveTile[] = [];
    private noiseGenerator: SimplexNoise;

    constructor(width: number, height: number, private videoSource: HTMLVideoElement) {
        super(width, height);
    }

    protected _initCamera() {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.y = 14;
        this.camera.lookAt(new Vector3(0, 0, 0));
    }

    protected _initScene() {
        this.noiseGenerator = new SimplexNoise();

        /*
        const light = new PointLight( 0xffffff );
        light.position.set( 0, 10, 0 );
        this.scene.add( light );*/

        const halfSideLength = 10;
        const minPoint = new Vector3(-halfSideLength, 0, -halfSideLength);
        const maxPoint = new Vector3(halfSideLength, 2, halfSideLength);
        const stepSize = 0.4;

        const boxSize = maxPoint.sub(minPoint);
        const steps = boxSize.divideScalar(stepSize).floor();
        this.particles = [];

        const ux = 1 / steps.x;
        const uz = 1 / steps.z;

        const texture = new VideoTexture(this.videoSource);
        const matParams = { color: 0xffffff, map: texture };

        for (let x = 0; x < steps.x; x++) {
            for (let z = 0; z < steps.z; z++) {
                const cubeGeom = new BoxGeometry(stepSize, stepSize, stepSize);

                change_uvs(cubeGeom, ux, uz, x, steps.z-z);
                const material = new MeshBasicMaterial(matParams);
                const cube = new Mesh(cubeGeom, material);
                cube.position.x = minPoint.x + x * stepSize;
                cube.position.z = minPoint.z + z * stepSize;
                const particle = new WaveTile({x, z}, boxSize.y, cube);
                particle.updateY(0, this.noiseGenerator);
                particle.updateColor();
                this.particles.push(particle);
                this.scene.add(cube);
            }
        }
    }

    protected _animate() {
        this.particles.forEach(p => {
            p.updateY(this.frame, this.noiseGenerator);
            p.updateColor(this.frame);
        });
    }
}
