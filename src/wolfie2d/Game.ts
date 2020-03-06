/*
 * Game is the focal point of the application, it has 4 subsystems,
 * the resource manager, the scene graph, the rendering system, and
 * the UI controller. In addition it serves as the game loop, providing
 * both an update and draw function that is called on a schedule.
 */
import {GameLoopTemplate} from './loop/GameLoopTemplate'
import {WebGLGameRenderingSystem} from './rendering/WebGLGameRenderingSystem'
import {SceneGraph} from './scene/SceneGraph'
import {AnimatedSprite} from './scene/sprite/AnimatedSprite'
import {ResourceManager} from './files/ResourceManager'
import {UIController} from './ui/UIController'
import { GradientCircle } from './scene/circle/GradientCircle'

export class Game extends GameLoopTemplate {
    private resourceManager : ResourceManager = new ResourceManager();
    private sceneGraph : SceneGraph = new SceneGraph();
    private renderingSystem : WebGLGameRenderingSystem = new WebGLGameRenderingSystem();
    private uiController : UIController = new UIController();

    public constructor() {
        super();
    }

    public getRenderingSystem() : WebGLGameRenderingSystem {
        return this.renderingSystem;
    }

    public getResourceManager() : ResourceManager {
        return this.resourceManager;
    }

    public getSceneGraph() : SceneGraph {
        return this.sceneGraph;
    }

    public init(gameCanvasId : string, textCanvasId : string) : void {
        this.renderingSystem.init(gameCanvasId, textCanvasId);
        this.uiController.init(gameCanvasId, this.sceneGraph);
    }

    public begin() : void {
       //setTimeout(this.update1, 1000);
    }

    private isRed(g : GradientCircle) : boolean{
        if(g.getState() == "RED"){
            return true;
        }
        return false;
    }

    private isBlue(g : GradientCircle) : boolean{
        if(g.getState() === "BLUE"){
            return true;
        }
        return false;
    }

    private isGreen(g : GradientCircle) : boolean{
        if(g.getState() === "GREEN"){
            return true;
        }
        return false;
    }

    private isYellow(g : GradientCircle) : boolean{
        if(g.getState() === "YELLOW"){
            return true;
        }
        return false;
    }

    private isCyan(g : GradientCircle) : boolean{
        if(g.getState() === "CYAN"){
            return true;
        }
        return false;
    }

    private isMagenta(g : GradientCircle) : boolean{
        if(g.getState() === "MAGENTA"){
            return true;
        }
        return false;
    }

    /*
     * This draws the game. Note that we are not currently using the 
     * interpolation value, but could once physics is involved.
     */
    public draw(interpolationPercentage : number) : void {
        // GET THE VISIBLE SET FROM THE SCENE GRAPH
        let visibleSprites : Array<AnimatedSprite>;
        visibleSprites = <Array<AnimatedSprite>>this.sceneGraph.scope();
        let circleSet : Array<GradientCircle>;
        circleSet = <Array<GradientCircle>>this.sceneGraph.scope2();
        let redSet : Array<GradientCircle>;
        redSet = circleSet.filter(this.isRed);

        let blueSet : Array<GradientCircle>;
        blueSet = circleSet.filter(this.isBlue);

        let greenSet : Array<GradientCircle>;
        greenSet = circleSet.filter(this.isGreen);

        let yellowSet : Array<GradientCircle>;
        yellowSet = circleSet.filter(this.isYellow);

        let cyanSet : Array<GradientCircle>;
        cyanSet = circleSet.filter(this.isCyan);

        let magentaSet : Array<GradientCircle>;
        magentaSet = circleSet.filter(this.isMagenta);


        // RENDER THE VISIBLE SET, WHICH SHOULD ALL BE RENDERABLE
        this.renderingSystem.render(visibleSprites, redSet, blueSet, greenSet, cyanSet, yellowSet, magentaSet);
    }

    /**
     * Updates the scene.
     */
    public update(delta : number) : void {
        this.sceneGraph.update(delta);
         var to_add = this.uiController.getNumObjectsToAdd();
         if(to_add > 0){
            for(var i = 0; i < to_add; i++){
                var new_sprite = this.resourceManager.generate_random_sprite(this.uiController.getXPos(), this.uiController.getYPos());
                this.sceneGraph.addAnimatedSprite(new_sprite);
                var visibleSprites = <Array<AnimatedSprite>>this.sceneGraph.scope();
                this.uiController.subNumObjectsToAdd();

            }
            this.renderingSystem.render(visibleSprites, [], [], [], [], [], []);
        }
        while(this.uiController.getSpritesToRemove().length > 0){
            var sprite = this.uiController.popSpritesToRemove();
            //sprite.clearSprite();
            this.sceneGraph.removeAnimatedSprite(sprite);
        }

        while(this.uiController.getCirclesToRemove().length > 0){
            var circle = this.uiController.popCirclesToRemove();
            //sprite.clearSprite();
            this.sceneGraph.removeGradientCircle(circle);
        }
    }

    
    
    /**
     * Updates the FPS counter.
     */
    public end(fps : number, panic : boolean) : void {
        if (panic) {
            var discardedTime = Math.round(this.resetFrameDelta());
            console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
        }
    }
}