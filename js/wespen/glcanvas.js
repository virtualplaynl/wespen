"strict mode";

var gl;
var canvas;

class GLCanvas
{
    constructor(glCanvas, vertex, fragment)
    {
        canvas = glCanvas;
        this.initGL();
        this.defaultShader = new Shader("Default", vertex, fragment);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        this.defaultTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.defaultTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
            1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 255, 255, 255]));
    }

    initGL()
    {
        try {
            gl = canvas.getContext("webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
            console.error(e);
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }

    startRender()
    {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}