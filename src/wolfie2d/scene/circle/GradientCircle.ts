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

    public toString() : string {
        let summary : string;
        switch(this.state){
            case "RED" : summary =  "{ position: ("
            +   this.getPosition().getX() + ", " + this.getPosition().getY() + ") "
            +   "(color: (dist, 0, 0)) "; break;
            case "BLUE" : summary =  "{ position: ("
            +   this.getPosition().getX() + ", " + this.getPosition().getY() + ") "
            +   "(color: (0, 0, dist)) "; break;
            case "GREEN" : summary =  "{ position: ("
            +   this.getPosition().getX() + ", " + this.getPosition().getY() + ") "
            +   "(color: (0, dist, 0)) "; break;
            case "CYAN" : summary =  "{ position: ("
            +   this.getPosition().getX() + ", " + this.getPosition().getY() + ") "
            +   "(color: (0, dist, dist)) "; break;
            case "YELLOW" : summary =  "{ position: ("
            +   this.getPosition().getX() + ", " + this.getPosition().getY() + ") "
            +   "(color: (dist, dist, 0)) "; break;
            default: summary =  "{ position: ("
            +   this.getPosition().getX() + ", " + this.getPosition().getY() + ") "
            +   "(color: (dist, 0, dist)) "; break;
        }
        return summary;
    }
}