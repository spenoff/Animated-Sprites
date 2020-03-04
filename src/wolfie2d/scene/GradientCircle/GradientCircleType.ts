import {WebGLGameTexture} from '../../rendering/WebGLGameTexture'
import {HashTable} from '../../data/HashTable'

export class GradientCircleFrame {
    public left : number;
    public top : number;
    public duration : number;

    constructor(initLeft : number, initTop : number, initDuration : number) {
        this.left = initLeft;
        this.top = initTop;
        this.duration = initDuration;
    }
}

export class GradientCircleType {
    private circleSheetTexture : WebGLGameTexture;
    private animations : HashTable<Array<GradientCircleFrame>>;
    private circleWidth : number;
    private circleHeight : number;

    public constructor(initCircleSheetTexture : WebGLGameTexture, 
                initCircleWidth : number, initCircleHeight : number) {
        this.circleSheetTexture = initCircleSheetTexture;
        this.animations = {};
        this.circleWidth = initCircleWidth;
        this.circleHeight = initCircleHeight;
    }

    public addAnimation(state : string) : void {
        this.animations[state] = new Array<GradientCircleFrame>();
    }

    public addAnimationFrame(state : string, index : number, frameDuration : number) : void {
        var columns = this.circleSheetTexture.width/this.circleWidth;
        var rows = this.circleSheetTexture.height/this.circleHeight;
        var col = index % columns;
        var row = Math.floor(index /  columns);
        var left = col * this.circleWidth;
        var top = row * this.circleHeight;
        this.animations[state].push(new GradientCircleFrame(left, top, frameDuration));
    }

    public getCircleWidth() : number {
        return this.circleWidth;
    }

    public getCircleHeight() : number {
        return this.circleHeight;
    }

    public getCircleSheetTexture() : WebGLGameTexture {
        return this.circleSheetTexture;
    }

    public getAnimation(state : string) : Array<GradientCircleFrame> {
        return this.animations[state];
    }

    public getLeft(state : string, frameIndex : number) : number {
        let animationFrame : GradientCircleFrame = this.animations[state][frameIndex];
        return animationFrame.left;
    }

    public getTop(state : string, frameIndex : number) : number {
        let animationFrame : GradientCircleFrame = this.animations[state][frameIndex];
        return animationFrame.top;
    }
}