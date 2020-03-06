import {SceneObject} from './SceneObject'
import {AnimatedSprite} from './sprite/AnimatedSprite'
import {GradientCircle} from './circle/GradientCircle'
import { GradientCircleType } from './circle/GradientCircleType';

export class SceneGraph {
    static lastIndex : number = 0;

    // AND ALL OF THE ANIMATED SPRITES, WHICH ARE NOT STORED
    // SORTED OR IN ANY PARTICULAR ORDER. NOTE THAT ANIMATED SPRITES
    // ARE SCENE OBJECTS
    private animatedSprites : Array<AnimatedSprite>;

    // AND ALL OF THE ANIMATED SPRITES, WHICH ARE NOT STORED
    // SORTED OR IN ANY PARTICULAR ORDER. NOTE THAT ANIMATED SPRITES
    // ARE SCENE OBJECTS
    private gradientCircles : Array<GradientCircle>;
    private redCircles : Array<GradientCircle>;

    // SET OF VISIBLE OBJECTS, NOTE THAT AT THE MOMENT OUR
    // SCENE GRAPH IS QUITE SIMPLE, SO THIS IS THE SAME AS
    // OUR LIST OF ANIMATED SPRITES
    private visibleSet : Array<SceneObject>;

    public constructor() {
        // DEFAULT CONSTRUCTOR INITIALIZES OUR DATA STRUCTURES
        this.animatedSprites = new Array();
        this.gradientCircles = new Array();
        this.redCircles = new Array();
        this.visibleSet = new Array();
    }

    public getNumSprites() : number {
        return this.animatedSprites.length;
    }

    public addAnimatedSprite(sprite : AnimatedSprite) : void {
        this.animatedSprites.push(sprite);
    }

    public addGradientCirlce(sprite : GradientCircle) : void {
        this.gradientCircles.push(sprite);
    }

    public addRedCirlce(sprite : GradientCircle) : void {
        this.redCircles.push(sprite);
    }

    public removeAnimatedSprite(sprite : AnimatedSprite) : void {
        var spriteIndex = this.animatedSprites.indexOf(sprite, 0);
        if(spriteIndex > -1) {
            console.log("It's being removed");
            this.animatedSprites.splice(spriteIndex, 1);
        }
    }

    public removeGradientCircle(sprite : GradientCircle) : void {
        var spriteIndex = this.gradientCircles.indexOf(sprite, 0);
        if(spriteIndex > -1) {
            console.log("It's being removed");
            this.gradientCircles.splice(spriteIndex, 1);
        }
    }

    public getSpriteAt(testX : number, testY : number) : AnimatedSprite {
        for (let sprite of this.animatedSprites) {
            if (sprite.contains(testX, testY))
                return sprite;
        }
        return null;
    }

    public getCircleAt(testX : number, testY : number) : GradientCircle {
        for (let circle of this.gradientCircles) {
            if (circle.contains(testX, testY))
                return circle;
        }
        return null;
    }

    /**
     * update
     * 
     * Called once per frame, this function updates the state of all the objects
     * in the scene.
     * 
     * @param delta The time that has passed since the last time this update
     * funcation was called.
     */
    public update(delta : number) : void {
        for (let sprite of this.animatedSprites) {
            sprite.update(delta);
        }
    }

    public scope() : Array<SceneObject> {
        // CLEAR OUT THE OLD
        this.visibleSet = [];

        // PUT ALL THE SCENE OBJECTS INTO THE VISIBLE SET
        for (let sprite of this.animatedSprites) {
            this.visibleSet.push(sprite);
        }

        return this.visibleSet;
    }

    public scope2() : Array<SceneObject> {
        // CLEAR OUT THE OLD
        this.visibleSet = [];

        // PUT ALL THE SCENE OBJECTS INTO THE VISIBLE SET
        for (let circle of this.gradientCircles) {
            this.visibleSet.push(circle);
        }

        return this.visibleSet;
    }
}