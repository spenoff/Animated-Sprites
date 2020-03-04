import {SceneObject} from '../SceneObject'
import {GradientCircleType} from './GradientCircleType'

export class GradientCircle extends SceneObject {
    private circleType : GradientCircleType;
    private state : string;
    private circleColorIndex : number;
    private frameCounter : number;

    public constructor() {
        super();
        this.circleType = null;
        
        // START RESET
        this.state = null;
        this.circleColorIndex = 0;
        this.frameCounter = 0;
    }

    public getAnimationFrameIndex() : number {
        return this.circleColorIndex;
    }

    public getFrameCounter() : number {
        return this.frameCounter;
    }

    public getCircleType() : GradientCircleType {
        return this.circleType;
    }

    public getState() : string {
        return this.state;
    }

    public setState(initState : string) : void {
        this.state = initState;
        this.circleColorIndex = 0;
        this.frameCounter = 0;
    }
    
    public contains(pointX : number, pointY : number) : boolean {
        let circleWidth = this.getCircleType().getCircleWidth();
        let circleHeight = this.getCircleType().getCircleHeight();
        let circleLeft = this.getPosition().getX();
        let circleRight = this.getPosition().getX() + circleWidth;
        let circleTop = this.getPosition().getY();
        let circleBottom = this.getPosition().getY() + circleHeight;
        if (    (pointX < circleLeft)
            ||  (circleRight < pointX)
            ||  (pointY < circleTop)
            ||  (circleBottom < pointY)) {
                return false;
        }
        else {
            return true;
        }
    }

    /**RENAME THIS METHOD SO IT DENOTES PIXEL LOCATION IN TEXTURE */
    public getLeft() : number {
        return this.circleType.getLeft(this.state, this.circleColorIndex);
    }
    
    public getTop() : number {
        return this.circleType.getTop(this.state, this.circleColorIndex);
    }

    public toString() : string {
        let summary : string =  "{ position: ("
                            +   this.getPosition().getX() + ", " + this.getPosition().getY() + ") "
                            +   "(state: " + this.getState() + ") "
                            +   "(animationFrameIndex: " + this.getAnimationFrameIndex() + ") "
                            +   "(frameCounter: " + this.getFrameCounter() + ") ";
        return summary;
    }
}