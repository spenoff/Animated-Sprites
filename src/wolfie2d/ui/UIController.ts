/*
 * This provides responses to UI input.
 */
import {AnimatedSprite} from "../scene/sprite/AnimatedSprite"
import {AnimatedSpriteType} from "../scene/sprite/AnimatedSpriteType"
import {GradientCircle} from "../scene/circle/GradientCircle"
import {SceneGraph} from "../scene/SceneGraph"
import { GradientCircleType } from "../scene/circle/GradientCircleType";

export class UIController {
    private spriteToDrag : AnimatedSprite;
    private circleToDrag : GradientCircle;
    private scene : SceneGraph;
    private dragOffsetX : number;
    private dragOffsetY : number;
    private numObjectsToAdd : number;
    private xPos : number;
    private yPos : number;
    private spritesToRemove : Array<AnimatedSprite>;
    private circlesToRemove : Array<GradientCircle>;
    static detail_text : string;
    static focusedSprite : AnimatedSprite;


    public constructor() {}

    public init(canvasId : string, initScene : SceneGraph) : void {
        this.spriteToDrag = null;
        this.scene = initScene;
        this.dragOffsetX = -1;
        this.dragOffsetY = -1;
        this.numObjectsToAdd = 0;
        this.spritesToRemove = [];
        this.circlesToRemove = [];

        UIController.detail_text = "";
        UIController.focusedSprite = null;


        let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        canvas.addEventListener("mousedown", this.mouseDownHandler);
        canvas.addEventListener("mousemove", this.mouseMoveHandler);
        canvas.addEventListener("mouseup", this.mouseUpHandler);
        canvas.addEventListener("dblclick", this.doubleClickHandler);
    }

    public mouseDownHandler = (event : MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        this.xPos = mousePressX;
        this.yPos = mousePressY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        let circle : GradientCircle = this.scene.getCircleAt(mousePressX, mousePressY);
        console.log("mousePressX: " + mousePressX);
        console.log("mousePressY: " + mousePressY);
        
        if(sprite != null && circle != null){
            // console.log("sprite: " + sprite + "Index: " + sprite.getIndexNum().toString());
            // console.log("circle: " + circle + "Index: " +circle.getIndexNum().toString());
            // if(sprite.getIndexNum() <= circle.getIndexNum()){
            //     console.log("This is happening");
            //     sprite = null;
            // }else{
            //     console.log("and This is happening");
            //     circle = null;
            // }
            sprite = null;
        }
        if (sprite != null) {
            console.log("dragging sprite");
            this.circleToDrag = null;
            // START DRAGGING IT
            this.spriteToDrag = sprite;
            this.dragOffsetX = sprite.getPosition().getX() - mousePressX;
            this.dragOffsetY = sprite.getPosition().getY() - mousePressY;
        }else if (circle != null) {
            console.log("dragging circle");
            this.spriteToDrag = null;
            // START DRAGGING IT
            this.circleToDrag = circle;
            this.dragOffsetX = circle.getPosition().getX() - mousePressX;
            this.dragOffsetY = circle.getPosition().getY() - mousePressY;

            if(sprite != null && circle == null){
                UIController.detail_text = sprite.toString();
            }
            if(circle != null){
                UIController.detail_text = circle.toString();
                UIController.focusedSprite = null;
            }else{UIController.focusedSprite = sprite;}
        }
    }
    
    public mouseMoveHandler = (event : MouseEvent) : void => {
        
        if (this.spriteToDrag != null) {
            console.log("dragging sprite");
            this.spriteToDrag.getPosition().set(event.clientX + this.dragOffsetX, 
                                                event.clientY + this.dragOffsetY, 
                                                this.spriteToDrag.getPosition().getZ(), 
                                                this.spriteToDrag.getPosition().getW());
        }

        if (this.circleToDrag != null) {
            console.log("dragging");
            this.circleToDrag.getPosition().set(event.clientX + this.dragOffsetX, 
                                                event.clientY + this.dragOffsetY, 
                                                this.circleToDrag.getPosition().getZ(), 
                                                this.circleToDrag.getPosition().getW());
        }
        
        let sprite : AnimatedSprite = this.scene.getSpriteAt(event.clientX, event.clientY);
        let circle : GradientCircle = this.scene.getCircleAt(event.clientX, event.clientY);
        if(sprite != null && circle == null){
            UIController.detail_text = sprite.toString();
        }
        if(circle != null){
            UIController.detail_text = circle.toString();
            UIController.focusedSprite = null;
        }else{UIController.focusedSprite = sprite;}
    }

    public mouseUpHandler = (event : MouseEvent) : void => {
        if(this.spriteToDrag == null && this.circleToDrag == null){
            this.numObjectsToAdd++;
        }
        this.spriteToDrag = null;
        this.circleToDrag = null;
    }

    public doubleClickHandler = (event : MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        this.xPos = mousePressX;
        this.yPos = mousePressY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        let circle : GradientCircle = this.scene.getCircleAt(mousePressX, mousePressY);
        if(sprite != null){
            this.spritesToRemove.push(sprite);
        }
        if(circle != null){
            this.circlesToRemove.push(circle);
        }
    }

    public getSpritesToRemove() : Array<AnimatedSprite> {
        return this.spritesToRemove;
    }

    public popSpritesToRemove() : AnimatedSprite {
        return this.spritesToRemove.pop();
    }

    public getCirclesToRemove() : Array<GradientCircle> {
        return this.circlesToRemove;
    }

    public popCirclesToRemove() : GradientCircle {
        return this.circlesToRemove.pop();
    }

    public getNumObjectsToAdd() : number{
        return this.numObjectsToAdd;
    }

    public subNumObjectsToAdd(){
        this.numObjectsToAdd--;
    }

    public getXPos() : number {
        return this.xPos;
    }

    public getYPos() : number {
        return this.yPos;
    }
}