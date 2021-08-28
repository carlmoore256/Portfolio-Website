export class Color {
    public components: number[];
    constructor(
        r: number = 0,
        g: number = 0,
        b: number = 0,
        a: number = 1.0) {
        this.components = [r, g, b, a];
    }
    getStyleString(): string {
        const rgba = this.components.slice(0, 3)
            .map(f => Math.floor(f * 256))
            .concat(this.components[3]);
        return `rgba(${rgba.join(",")})`;
    }
    randomize(): void {
        this.components = [0,0,0].map(_=>Math.random()).concat(1.0);
    }
    static fromRGBA(r: number, g: number, b: number, a: number = 1.0) {
        return new Color(r, g, b, a);
    }
}

const MAX_COLOR_SHIFT_VELOCITY = 0.02;
const getRandomColorShiftVelocity = () => (-0.5 + Math.random()) * MAX_COLOR_SHIFT_VELOCITY;
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(min, v), max);

export class ShiftyColor extends Color {
    private readonly rgbVelocity: number[];
    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1.0) {
        super(r, g, b, a);
        this.rgbVelocity = [0,0,0].map(_ => getRandomColorShiftVelocity());
    }
    shift() {
        for (let i = 0; i < 3; i++) {
            const ci = this.components[i];
            const v = this.rgbVelocity[i];
            const cf = clamp(ci + v, 0, 1);
            this.components[i] = cf;
            if (cf === 0 || cf === 1) this.rgbVelocity[i] = getRandomColorShiftVelocity();
        }
    }
}