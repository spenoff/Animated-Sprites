/*
 * AnimatedSpriteDemo.ts - demonstrates some simple sprite rendering and 
 * animation as well as some basic mouse interactions. Note that the
 * AnimationSpriteDemo class loads and creates custom content for the
 * purpose of demonstrating basic functionality.
 */
import {Game} from '../wolfie2d/Game'
import {ResourceManager} from '../wolfie2d/files/ResourceManager'
import {TextToRender} from '../wolfie2d/rendering/TextRenderer'
import {WebGLGameRenderingSystem} from '../wolfie2d/rendering/WebGLGameRenderingSystem'
import {SceneGraph} from '../wolfie2d/scene/SceneGraph'
import {AnimatedSprite} from '../wolfie2d/scene/sprite/AnimatedSprite'
import {AnimatedSpriteType} from '../wolfie2d/scene/sprite/AnimatedSpriteType'
import { GradientCircleType } from '../wolfie2d/scene/circle/GradientCircleType'
import { GradientCircle } from '../wolfie2d/scene/circle/GradientCircle'
import { WebGLGameTexture } from '../wolfie2d/rendering/WebGLGameTexture'

// IN THIS EXAMPLE WE'LL HAVE 2 SPRITE TYPES THAT EACH HAVE THE SAME 2 STATES
// AND WHERE EACH SPRITE TYPE HAS ITS OWN SPRITE SHEET
const DEMO_SPRITE_TYPES : string[] = [
    'resources/animated_sprites/RedCircleMan.json',
    'resources/animated_sprites/MultiColorBlock.json'
];
const DEMO_SPRITE_STATES = {
    FORWARD_STATE: 'FORWARD',
    REVERSE_STATE: 'REVERSE'
};
const DEMO_TEXTURES : string[] = [
    'resources/images/EightBlocks.png', 
    'resources/images/RedCircleMan.png'
];

class AnimatedSpriteDemo {
    constructor() {}

    /**
     * This method initializes the application, building all the needed
     * game objects and setting them up for use.
     */
    public buildTestScene(game : Game, callback : Function) {
        let renderingSystem : WebGLGameRenderingSystem = game.getRenderingSystem();
        let sceneGraph : SceneGraph = game.getSceneGraph();
        let resourceManager : ResourceManager = game.getResourceManager();
        let builder = this;
 
        // EMPLOY THE RESOURCE MANAGER TO BUILD ALL THE WORLD CONTENT
        resourceManager.loadTextures(DEMO_TEXTURES, renderingSystem, function() {
            // ONLY AFTER ALL THE TEXTURES HAVE LOADED LOAD THE SPRITE TYPES
            resourceManager.loadSpriteTypes(DEMO_SPRITE_TYPES, function() {
                // ONLY AFTER ALL THE SPRITE TYPES HAVE LOADED LOAD THE SPRITES
                builder.buildAnimatedSprites(resourceManager, sceneGraph);

                // AND BUILD ALL THE TEXT OUR APP WILL USE
                builder.buildText(game);

                // EVERYTHING HAS BEEN BUILT, CALL THE CALLBACK
                callback();
            });
        });
    }

    /*
     * Builds all the animated sprites to be used by the application and
     * adds them to the scene.
     */
    private buildAnimatedSprites(resourceManager : ResourceManager, scene : SceneGraph) {
        let canvasWidth : number = (<HTMLCanvasElement>document.getElementById("game_canvas")).width;
        let canvasHeight : number = (<HTMLCanvasElement>document.getElementById("game_canvas")).height;

        // BUILD A BUNCH OF CIRCLE SPRITES
        for (let i = 0; i < DEMO_SPRITE_TYPES.length; i++) {
            for (let j = 0; j < 5; j++) {
                let spriteTypeToUse : string = DEMO_SPRITE_TYPES[i];
                let animatedSpriteType : AnimatedSpriteType = resourceManager.getAnimatedSpriteTypeById(spriteTypeToUse);
                let spriteToAdd : AnimatedSprite = new AnimatedSprite(animatedSpriteType, DEMO_SPRITE_STATES.FORWARD_STATE, SceneGraph.lastIndex);
                SceneGraph.lastIndex++;
                let randomX : number = Math.floor(Math.random() * canvasWidth) - (animatedSpriteType.getSpriteWidth()/2);
                let randomY : number = Math.floor(Math.random() * canvasHeight) - (animatedSpriteType.getSpriteHeight()/2);
                spriteToAdd.getPosition().set(randomX, randomY, 0.0, 1.0);
                scene.addAnimatedSprite(spriteToAdd);
            }
        }

        //build circles
        // for(let i = 0; i < 4; i++){
        //     let type = new GradientCircleType(1, 1);
        //     let circle : GradientCircle = new GradientCircle(type, "RED", SceneGraph.lastIndex);
        //     SceneGraph.lastIndex++;
        //     let randomX : number = Math.floor(Math.random() * canvasWidth) - 50;
        //     let randomY : number = Math.floor(Math.random() * canvasHeight) - 50;
        //     circle.getPosition().set(randomX, randomY, 0.0, 1.0);
        //     scene.addGradientCirlce(circle);
        // }

        let rdone : boolean = false;
        let bdone : boolean = false;
        let gdone : boolean = false;
        let cdone : boolean = false;
        let ydone : boolean = false;
        let mdone : boolean = false;
        //GENERATE 5 DIFFERENTLY COLORED CIRCLES RANDOMLY
        for(let i = 0; i < 5; i++){
            var rnum = Math.floor(Math.random() * 6) + 1;
            switch(rnum){
                case 1: if(rdone===false){rdone=true;}else{i--;}break;
                case 2: if(bdone===false){bdone=true;}else{i--;}break;
                case 3: if(gdone===false){gdone=true;}else{i--;}break;
                case 4: if(cdone===false){cdone=true;}else{i--;}break;
                case 5: if(ydone===false){ydone=true;}else{i--;}break;
                default: if(mdone===false){mdone=true;}else{i--;}break;
            }
        }

        //build red circle
        if(rdone){
            let type = new GradientCircleType(1, 1);
            let circle : GradientCircle = new GradientCircle(type, "RED", SceneGraph.lastIndex);
            SceneGraph.lastIndex++;
            let randomX : number = Math.floor(Math.random() * canvasWidth) - 25;
            let randomY : number = Math.floor(Math.random() * canvasHeight) - 25;
            circle.getPosition().set(randomX, randomY, 0.0, 1.0);
            scene.addGradientCirlce(circle);
        }
        if(bdone){
            let type = new GradientCircleType(1, 1);
            let circle : GradientCircle = new GradientCircle(type, "BLUE", SceneGraph.lastIndex);
            SceneGraph.lastIndex++;
            let randomX : number = Math.floor(Math.random() * canvasWidth) - 25;
            let randomY : number = Math.floor(Math.random() * canvasHeight) - 25;
            circle.getPosition().set(randomX, randomY, 0.0, 1.0);
            scene.addGradientCirlce(circle);
        }
        if(gdone){
            let type = new GradientCircleType(1, 1);
            let circle : GradientCircle = new GradientCircle(type, "GREEN", SceneGraph.lastIndex);
            SceneGraph.lastIndex++;
            let randomX : number = Math.floor(Math.random() * canvasWidth) - 25;
            let randomY : number = Math.floor(Math.random() * canvasHeight) - 25;
            circle.getPosition().set(randomX, randomY, 0.0, 1.0);
            scene.addGradientCirlce(circle);
        }
        if(cdone){
            let type = new GradientCircleType(1, 1);
            let circle : GradientCircle = new GradientCircle(type, "CYAN", SceneGraph.lastIndex);
            SceneGraph.lastIndex++;
            let randomX : number = Math.floor(Math.random() * canvasWidth) - 25;
            let randomY : number = Math.floor(Math.random() * canvasHeight) - 25;
            circle.getPosition().set(randomX, randomY, 0.0, 1.0);
            scene.addGradientCirlce(circle);
        }
        if(ydone){
            let type = new GradientCircleType(1, 1);
            let circle : GradientCircle = new GradientCircle(type, "YELLOW", SceneGraph.lastIndex);
            SceneGraph.lastIndex++;
            let randomX : number = Math.floor(Math.random() * canvasWidth) - 25;
            let randomY : number = Math.floor(Math.random() * canvasHeight) - 25;
            circle.getPosition().set(randomX, randomY, 0.0, 1.0);
            scene.addGradientCirlce(circle);
        }
        if(mdone){
            let type = new GradientCircleType(1, 1);
            let circle : GradientCircle = new GradientCircle(type, "MAGENTA", SceneGraph.lastIndex);
            SceneGraph.lastIndex++;
            let randomX : number = Math.floor(Math.random() * canvasWidth) - 25;
            let randomY : number = Math.floor(Math.random() * canvasHeight) - 25;
            circle.getPosition().set(randomX, randomY, 0.0, 1.0);
            scene.addGradientCirlce(circle);
        }

        // type = new GradientCircleType(1, 1);
        // circle = new GradientCircle(type, "BLUE", SceneGraph.lastIndex);
        // SceneGraph.lastIndex++;
        // randomX = Math.floor(Math.random() * canvasWidth) - 25;
        // randomY = Math.floor(Math.random() * canvasHeight) - 25;
        // circle.getPosition().set(randomX, randomY, 0.0, 1.0);
        // scene.addGradientCirlce(circle);

        // type = new GradientCircleType(1, 1);
        // circle = new GradientCircle(type, "GREEN", SceneGraph.lastIndex);
        // SceneGraph.lastIndex++;
        // randomX = Math.floor(Math.random() * canvasWidth) - 25;
        // randomY = Math.floor(Math.random() * canvasHeight) - 25;
        // circle.getPosition().set(randomX, randomY, 0.0, 1.0);
        // scene.addGradientCirlce(circle);

        // type = new GradientCircleType(1, 1);
        // circle = new GradientCircle(type, "YELLOW", SceneGraph.lastIndex);
        // SceneGraph.lastIndex++;
        // randomX = Math.floor(Math.random() * canvasWidth) - 25;
        // randomY = Math.floor(Math.random() * canvasHeight) - 25;
        // circle.getPosition().set(randomX, randomY, 0.0, 1.0);
        // scene.addGradientCirlce(circle);

        // type = new GradientCircleType(1, 1);
        // circle = new GradientCircle(type, "CYAN", SceneGraph.lastIndex);
        // SceneGraph.lastIndex++;
        // randomX = Math.floor(Math.random() * canvasWidth) - 25;
        // randomY = Math.floor(Math.random() * canvasHeight) - 25;
        // circle.getPosition().set(randomX, randomY, 0.0, 1.0);
        // scene.addGradientCirlce(circle);
    }

    /*
     * Builds all the text to be displayed in the application.
     */
    private buildText(game : Game) {
        let sceneGraph : SceneGraph = game.getSceneGraph();
        let numSpritesText = new TextToRender("Num Sprites", "", 20, 50, function() {
            numSpritesText.text = "Number of Scene Objects: " + sceneGraph.getNumSprites();
        });
        let textRenderer = game.getRenderingSystem().getTextRenderer();
        textRenderer.addTextToRender(numSpritesText);
    }
}

// THIS IS THE ENTRY POINT INTO OUR APPLICATION, WE MAKE
// THE Game OBJECT AND INITIALIZE IT WITH THE CANVASES
let game = new Game();
game.init("game_canvas", "text_canvas");

// BUILD THE GAME SCENE
let demo = new AnimatedSpriteDemo();
demo.buildTestScene(game, function() {
    // AND START THE GAME LOOP
    game.start();
});