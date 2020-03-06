import {SceneObject} from '../SceneObject'
import {GradientCircleType} from './GradientCircleType'

export class GradientCircle extends SceneObject {
    private circleType : GradientCircleType;
    private state : string;
    private indexNum : number;

    public constructor(initCircleType : GradientCircleType, initState : string, initIndexNum : number) {
        super();
        
        this.circleType = initCircleType;
        this.state = initState;
        this.indexNum = initIndexNum;
    }

    public getIndexNum(){
        return this.indexNum;
    }


    public getCircleType() : GradientCircleType {
        return this.circleType;
    }

    public getState() : string {
        return this.state;
    }

    public setState(initState : string) : void {
        this.state = initState;
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
    // public getLeft() : number {
    //     return this.circleType.getLeft(this.state, this.circleColorIndex);
    // }
    
    // public getTop() : number {
    //     return this.circleType.getTop(this.state, this.circleColorIndex);
    // }

    // public toString() : string {
    //     let summary : string =  "{ position: ("
    //                         +   this.getPosition().getX() + ", " + this.getPosition().getY() + ") "
    //                         +   "(state: " + this.getState() + ") "
    //                         +   "(animationFrameIndex: " + this.getAnimationFrameIndex() + ") "
    //                         +   "(frameCounter: " + this.getFrameCounter() + ") ";
    //     return summary;
    // }
}