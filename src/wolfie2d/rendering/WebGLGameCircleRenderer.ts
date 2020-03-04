import {WebGLGameShader} from './WebGLGameShader'
import {MathUtilities} from '../math/MathUtilities'
import { Matrix } from '../math/Matrix'
import { Vector3 } from '../math/Vector3'
import {GradientCircle} from '../scene/GradientCircle/GradientCircle'
import {GradientCircleType} from '../scene/GradientCircle/GradientCircleType'
import {WebGLGameTexture} from './WebGLGameTexture'
import {HashTable} from '../data/HashTable'

var CircleDefaults = {
    A_POSITION: "a_Position",
    A_VALUE_TO_INTERPOLATE: "a_ValueToInterpolate",
    A_TEX_COORD: "a_TexCoord",
    U_SPRITE_TRANSFORM: "u_SpriteTransform",//leave this name alone. It's consistent with the slide deck
    U_TEX_COORD_FACTOR: "u_TexCoordFactor",
    U_TEX_COORD_SHIFT: "u_TexCoordShift",
    U_SAMPLER: "u_Sampler",
    NUM_VERTICES: 4,
    FLOATS_PER_VERTEX: 2,
    FLOATS_PER_TEXTURE_COORDINATE: 2,
    TOTAL_BYTES: 16,
    VERTEX_POSITION_OFFSET: 0,
    TEXTURE_COORDINATE_OFFSET: 8,
    INDEX_OF_FIRST_VERTEX: 0
};

export class WebGLGameCircleRenderer {
    private shader : WebGLGameShader;
    private vertexTexCoordBuffer : WebGLBuffer;

    // WE'LL USE THESE FOR TRANSOFMRING OBJECTS WHEN WE DRAW THEM
    private circleTransform : Matrix;
    private circleTranslate : Vector3;
    private circleRotate : Vector3;
    private circleScale : Vector3;    

    private webGLAttributeLocations : HashTable<GLuint>;
    private webGLUniformLocations : HashTable<WebGLUniformLocation>;

    public constructor() {}
    
    public init(webGL : WebGLRenderingContext) : void {
        this.shader = new WebGLGameShader();
        var vertexShaderSource =
            'precision highp float;\n\n' +
            //'uniform vec2 ' + CircleDefaults.U_TEX_COORD_FACTOR + ';\n' +
            //'uniform vec2 ' + CircleDefaults.U_TEX_COORD_SHIFT + ';\n' +
            'attribute vec4 ' + CircleDefaults.A_POSITION + ';\n' +
            'attribute vec2 ' + CircleDefaults.A_VALUE_TO_INTERPOLATE + ';\n' +
            'varying vec2 val;\n' +
            'uniform mat4 ' + CircleDefaults.U_SPRITE_TRANSFORM + ';\n' +
            'void main() {\n' +
            '  val = ' + CircleDefaults.A_VALUE_TO_INTERPOLATE + ';\n' +
            '  gl_Position = ' + CircleDefaults.U_SPRITE_TRANSFORM + ' * ' + CircleDefaults.A_POSITION + ';\n' +
            '}\n';
            // 'uniform mat4 ' + CircleDefaults.U_SPRITE_TRANSFORM + ';\n' +
            // 'uniform vec2 ' + CircleDefaults.U_TEX_COORD_FACTOR + ';\n' +
            // 'uniform vec2 ' + CircleDefaults.U_TEX_COORD_SHIFT + ';\n' +
            // 'attribute vec4 ' + CircleDefaults.A_POSITION + ';\n' +
            // 'attribute vec2 ' + CircleDefaults.A_TEX_COORD + ';\n' +
            // 'varying vec2 v_TexCoord;\n' +
            // 'void main() {\n' +
            // '  gl_Position = ' + CircleDefaults.U_SPRITE_TRANSFORM + ' * ' + CircleDefaults.A_POSITION + ';\n' +
            // '  vec2 tempTexCoord = ' + CircleDefaults.A_TEX_COORD + ' * ' + CircleDefaults.U_TEX_COORD_FACTOR + ';\n' +
            // '  v_TexCoord = tempTexCoord + ' + CircleDefaults.U_TEX_COORD_SHIFT + ';\n' +
            // '}\n';
        var fragmentShaderSource =
            'precision highp float;\n' +
            'varying vec2 val;\n' +
            'void main() {\n' +
            '  float R = 1.0;\n' +
            '  float dist = sqrt(dot(val,val));\n' +
            '  float alpha = 1.0;\n' +
            '  if (dist > R) {\n' +
            '    discard;\n' +
            '  }\n' +
            '  gl_FragColor = vec4(0, 0, dist, alpha);\n' + //TODO might need randomly generated variables here
            '}\n';
            // '#ifdef GL_ES\n' +
            // 'precision mediump float;\n' +
            // '#endif\n' +
            // 'uniform sampler2D ' + CircleDefaults.U_SAMPLER + ';\n' +
            // 'varying vec2 v_TexCoord;\n' +
            // 'void main() {\n' +
            // '  gl_FragColor = texture2D(' + CircleDefaults.U_SAMPLER + ', v_TexCoord);\n' +
            // '}\n';
        this.shader.init(webGL, vertexShaderSource, fragmentShaderSource);

        // GET THE webGL OBJECT TO USE
        var verticesTexCoords = new Float32Array([
            -0.5,  0.5, 0.0, 0.0,
            -0.5, -0.5, 0.0, 1.0,
             0.5,  0.5, 1.0, 0.0,
             0.5, -0.5, 1.0, 1.0
        ]);

        // CREATE THE BUFFER ON THE GPU
        this.vertexTexCoordBuffer = webGL.createBuffer();

        // BIND THE BUFFER TO BE VERTEX DATA
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexTexCoordBuffer);

        // AND SEND THE DATA TO THE BUFFER WE CREATED ON THE GPU
        webGL.bufferData(webGL.ARRAY_BUFFER, verticesTexCoords, webGL.STATIC_DRAW);

        // SETUP THE SHADER ATTRIBUTES AND UNIFORMS
        this.webGLAttributeLocations = {};
        this.webGLUniformLocations = {};
        this.loadAttributeLocations(webGL, [CircleDefaults.A_POSITION, CircleDefaults.A_TEX_COORD]);
        this.loadUniformLocations(webGL, [CircleDefaults.U_SPRITE_TRANSFORM, CircleDefaults.U_SAMPLER, CircleDefaults.U_TEX_COORD_FACTOR, CircleDefaults.U_TEX_COORD_SHIFT]);

        // WE'LL USE THESE FOR TRANSOFMRING OBJECTS WHEN WE DRAW THEM
        this.circleTransform = new Matrix(4, 4);
        this.circleTranslate = new Vector3();
        this.circleRotate = new Vector3();
        this.circleScale = new Vector3();
    }

    public renderGradientCircles(  webGL : WebGLRenderingContext, 
                            canvasWidth : number, 
                            canvasHeight : number, 
                            visibleSet : Array<GradientCircle>) : void {
        // SELECT THE ANIMATED SPRITE RENDERING SHADER PROGRAM FOR USE
        let shaderProgramToUse = this.shader.getProgram();
        webGL.useProgram(shaderProgramToUse);

       // AND THEN RENDER EACH ONE
       for (let circle of visibleSet) {
            this.renderGradientCircle(webGL, canvasWidth, canvasHeight, circle);        
        }
    }

    private loadAttributeLocations(webGL : WebGLRenderingContext, attributeLocationNames : Array<string>) {
        for (var i = 0; i < attributeLocationNames.length; i++) {
            let locationName : string = attributeLocationNames[i];
            let location : GLuint = webGL.getAttribLocation(this.shader.getProgram(), locationName);
            this.webGLAttributeLocations[locationName] = location;
        }
    }

    private loadUniformLocations(webGL : WebGLRenderingContext, uniformLocationNames : Array<string>) {
        for (let i : number = 0; i < uniformLocationNames.length; i++) {
            let locationName : string = uniformLocationNames[i];
            let location : WebGLUniformLocation = webGL.getUniformLocation(this.shader.getProgram(), locationName);
            this.webGLUniformLocations[locationName] = location;
        }
    }

    private renderGradientCircle(   webGL : WebGLRenderingContext, 
                            canvasWidth : number, 
                            canvasHeight : number, 
                            circle : GradientCircle) {
        let circleType : GradientCircleType = circle.getCircleType();
        let texture : WebGLGameTexture = circleType.getCircleSheetTexture();

        // CALCULATE HOW MUCH TO TRANSLATE THE QUAD PER THE Circle POSITION
        let circleWidth : number = circleType.getCircleWidth();
        let circleHeight : number = circleType.getCircleHeight();
        let circleXInPixels : number = circle.getPosition().getX() + (circleWidth/2);
        let circleYInPixels : number = circle.getPosition().getY() + (circleHeight/2);
        let circleXTranslate : number = (circleXInPixels - (canvasWidth/2))/(canvasWidth/2);
        let circleYTranslate : number = (circleYInPixels - (canvasHeight/2))/(canvasHeight/2);
        this.circleTranslate.setX(circleXTranslate);
        this.circleTranslate.setY(-circleYTranslate);

        // CALCULATE HOW MUCH TO SCALE THE QUAD PER THE CIRCLE SIZE
        let defaultWidth : number = canvasWidth/2;
        let defaultHeight : number = canvasHeight/2;
        let scaleX : number = circleWidth/defaultWidth;
        let scaleY : number = circleHeight/defaultHeight;
        this.circleScale.setX(scaleX);
        this.circleScale.setY(scaleY);

        // @todo - COMBINE THIS WITH THE ROTATE AND SCALE VALUES FROM THE CIRCLE
        MathUtilities.identity(this.circleTransform);
        MathUtilities.model(this.circleTransform, this.circleTranslate, this.circleRotate, this.circleScale);
        
        // FIGURE OUT THE TEXTURE COORDINATE FACTOR AND SHIFT
        let texCoordFactorX : number = circleWidth/texture.width;
        let texCoordFactorY : number = circleHeight/texture.height;
        let circleLeft : number = circle.getLeft();
        let circleTop : number = circle.getTop();
        let texCoordShiftX : number = circleLeft/texture.width;
        let texCoordShiftY : number = circleTop/texture.height;   

        // USE THE ATTRIBUTES
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexTexCoordBuffer);
        webGL.bindTexture(webGL.TEXTURE_2D, texture.webGLTexture);

        // HOOK UP THE ATTRIBUTES
        let a_PositionLocation : GLuint = this.webGLAttributeLocations[CircleDefaults.A_POSITION];
        webGL.vertexAttribPointer(a_PositionLocation, CircleDefaults.FLOATS_PER_TEXTURE_COORDINATE, webGL.FLOAT, false, CircleDefaults.TOTAL_BYTES, CircleDefaults.VERTEX_POSITION_OFFSET);
        webGL.enableVertexAttribArray(a_PositionLocation);
        let a_TexCoordLocation : GLuint = this.webGLAttributeLocations[CircleDefaults.A_TEX_COORD];
        webGL.vertexAttribPointer(a_TexCoordLocation, CircleDefaults.FLOATS_PER_TEXTURE_COORDINATE, webGL.FLOAT, false, CircleDefaults.TOTAL_BYTES, CircleDefaults.TEXTURE_COORDINATE_OFFSET);
        webGL.enableVertexAttribArray(a_TexCoordLocation);

        // USE THE UNIFORMS
        let u_SpriteTransformLocation : WebGLUniformLocation = this.webGLUniformLocations[CircleDefaults.U_SPRITE_TRANSFORM];
        webGL.uniformMatrix4fv(u_SpriteTransformLocation, false, this.circleTransform.getData());
        let u_SamplerLocation : WebGLUniformLocation = this.webGLUniformLocations[CircleDefaults.U_SAMPLER];
        webGL.uniform1i(u_SamplerLocation, texture.webGLTextureId);
        let u_TexCoordFactorLocation : WebGLUniformLocation = this.webGLUniformLocations[CircleDefaults.U_TEX_COORD_FACTOR];
        webGL.uniform2f(u_TexCoordFactorLocation, texCoordFactorX, texCoordFactorY);
        let u_TexCoordShiftLocation : WebGLUniformLocation = this.webGLUniformLocations[CircleDefaults.U_TEX_COORD_SHIFT];
        webGL.uniform2f(u_TexCoordShiftLocation, texCoordShiftX, texCoordShiftY);

        // DRAW THE SPRITE AS A TRIANGLE STRIP USING 4 VERTICES, STARTING AT THE START OF THE ARRAY (index 0)
        webGL.drawArrays(webGL.TRIANGLE_STRIP, CircleDefaults.INDEX_OF_FIRST_VERTEX, CircleDefaults.NUM_VERTICES);
    }
}