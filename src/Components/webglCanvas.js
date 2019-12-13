import React, { Component } from 'react';
import commonFunctions from './commonFunctions';
import Geometry from '../Geometry/index';
import { vec3, mat4 } from 'gl-matrix';
import Cube from '../Geometry/Cube';

export default class WebGLCanvas extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }

        this.canvas = React.createRef();
        //this.render = this.render.bind(this);

    }

    draw(deltaTime, programInfo, buffers) {
        let gl = this.state.gl;
        // Set clear colour
        // This is a Red-Green-Blue-Alpha colour
        // See https://en.wikipedia.org/wiki/RGB_color_model
        // Here we use floating point values. In other places you may see byte representation (0-255).
        gl.clearColor(0.55686, 0.54902, 0.52157, 1.0);

        // Depth testing allows WebGL to figure out what order to draw our objects such that the look natural.
        // We want to draw far objects first, and then draw nearer objects on top of those to obscure them.
        // To determine the order to draw, WebGL can test the Z value of the objects.
        // The z-axis goes out of the screen
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        gl.clearDepth(1.0); // Clear everything

        // Clear the color and depth buffer with specified clear colour.
        // This will replace everything that was in the previous frame with the clear colour.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Choose to use our shader
        gl.useProgram(programInfo.program);

        {
            // Bind the buffer we want to draw
            gl.bindVertexArray(buffers.vao);

            // Draw the object
            const offset = 0; // Number of elements to skip before starting
            gl.drawElements(gl.TRIANGLES, buffers.numVertices, gl.UNSIGNED_SHORT, offset);
        }
    }

    main() {
        console.log(this.state);

        let programInfo = this.initializeShader();

        let vertices = [
            [0.0, 0.0, 0.0],
            [0.0, 0.5, 0.0],
            [0.5, 0.5, 0.0],
            [0.5, 0.0, 0.0],

            [0.0, 0.0, 0.5],
            [0.0, 0.5, 0.5],
            [0.5, 0.5, 0.5],
            [0.5, 0.0, 0.5],

            [0.0, 0.5, 0.5],
            [0.0, 0.5, 0.0],
            [0.5, 0.5, 0.0],
            [0.5, 0.5, 0.5],

            [0.0, 0.0, 0.5],
            [0.5, 0.0, 0.5],
            [0.5, 0.0, 0.0],
            [0.0, 0.0, 0.0],

            [0.5, 0.0, 0.5],
            [0.5, 0.0, 0.0],
            [0.5, 0.5, 0.5],
            [0.5, 0.5, 0.0],

            [0.0, 0.0, 0.5],
            [0.0, 0.0, 0.0],
            [0.0, 0.5, 0.5],
            [0.0, 0.5, 0.0]
        ]

        let faces = [
            2, 0, 1, 3, 0, 2,
            //backface
            5, 4, 6, 6, 4, 7,
            //top face
            10, 9, 8, 10, 8, 11,
            //bottom face
            13, 12, 14, 14, 12, 15,
            //side
            18, 16, 17, 18, 17, 19,
            //side
            22, 21, 20, 23, 21, 22,
        ]

        

        var buffers = this.initBuffers(programInfo, vertices.flat(), faces);

        console.log("Starting rendering loop");

        // A variable for keeping track of time between frames
        var then = 0.0;
        var that = this;

        // This function is called when we want to render a frame to the canvas
        function render(now) {
            now *= 0.001; // convert to seconds
            const deltaTime = now - then;
            then = now;
            
            // Draw our scene
            that.draw(deltaTime, programInfo, buffers);
            //that.testFunction()

            // Request another frame when this one is done
            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);

    }

    initializeShader() {
        let gl = this.state.gl;

        const vertShaderSample =
            `#version 300 es
            in vec3 aPosition;
            
            void main() {
                gl_Position = vec4(aPosition, 1.0);
            }
            `;


        const fragShaderSample =
            `#version 300 es
            precision highp float;

            out vec4 fragColor;
            
            void main() {
                fragColor = vec4(0.2, 0.5, 0.2, 1.0);
            }
            `;

        const shaderProgram = commonFunctions.initShaderProgram(gl, vertShaderSample, fragShaderSample);

        const programInfo = {
            program: shaderProgram,

            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition')
            }
        };

        return programInfo;
    }

    initBuffers(programInfo, inputVertices, inputIndices) {
        let gl = this.state.gl;
        // We have 3 vertices with x, y, and z values
        const positions = new Float32Array(inputVertices);

        // We are using gl.UNSIGNED_SHORT to enumerate the indices
        const indicesArray = new Uint16Array(inputIndices);

        // Allocate and assign a Vertex Array Object to our handle
        var vertexArrayObject = gl.createVertexArray();

        // Bind our Vertex Array Object as the current used object
        gl.bindVertexArray(vertexArrayObject);

        return {
            vao: vertexArrayObject,
            attributes: {
                position: commonFunctions.initPositionAttribute(gl, programInfo, positions),
            },
            indices: commonFunctions.initIndexBuffer(gl, indicesArray),
            numVertices: indicesArray.length, //use the length of the indiciesArray
        };
    }

    componentDidMount() {
        var gl = this.canvas.current.getContext("webgl2");

        console.log(gl);

        if (gl == null) {
            alert("Your browser does not support webgl2!");
            return;
        }

        this.setState({
            canvas: this.canvas.current,
            gl
        }, () => {
            this.main()
        });

    }


    render() {
        return (
            <canvas height={500} width={500} ref={this.canvas} />
        )
    }

}

