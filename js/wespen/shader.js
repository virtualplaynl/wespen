"strict mode";

class Shader
{
    constructor(name, vertex, fragment, useDerivatives = true)
    {
        this.name = name;

        if(useDerivatives) {
            var ext = gl.getExtension("OES_standard_derivatives");
            if (!ext)
                throw "derivatives not supported";
        }

        this.program = gl.createProgram();
        gl.attachShader(this.program, this.buildShader(gl.VERTEX_SHADER, vertex));
        gl.attachShader(this.program, this.buildShader(gl.FRAGMENT_SHADER, fragment));
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            throw "Could not link the shader program!";
        }

        gl.useProgram(this.program);

        this.positionLoc = gl.getAttribLocation(this.program, "position");
        gl.enableVertexAttribArray(this.positionLoc);
        this.normalsLoc = gl.getAttribLocation(this.program, "normal");
        gl.enableVertexAttribArray(this.normalsLoc);
        this.uvsLoc = gl.getAttribLocation(this.program, "texCoord");
        gl.enableVertexAttribArray(this.uvsLoc);
        this.mvMatrixLoc = gl.getUniformLocation(this.program, "modelview");
        this.pMatrixLoc = gl.getUniformLocation(this.program, "projection");
        this.normalMatrixLoc = gl.getUniformLocation(this.program, "normalMatrix");
        this.lightLoc = gl.getUniformLocation(this.program, "light");
        this.ambientLoc = gl.getUniformLocation(this.program, "ambientColor");
        this.diffuseLoc = gl.getUniformLocation(this.program, "diffuseColor");
        this.specularLoc = gl.getUniformLocation(this.program, "specularColor");
        this.specularPowerLoc = gl.getUniformLocation(this.program, "specularPower");
        this.textureLoc = gl.getUniformLocation(this.program, "diffuseTexture");
    }
    
    buildShader(type, source)
    {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw "An error occurred compiling the " + type + " for shader '" + this.name + "': " + gl.getShaderInfoLog(shader);
        }
        
        return shader;
    }
    
    setView(modelMatrix, viewMatrix, projectionMatrix, lightPos)
    {
        var modelviewMatrix = mat4.create();
        mat4.multiply(modelviewMatrix, viewMatrix, modelMatrix);
        var normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelviewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        var lightEyePos = vec3.create();
        vec3.transformMat4(lightEyePos, lightPos, viewMatrix);
        gl.uniformMatrix4fv(this.mvMatrixLoc, false, modelviewMatrix);
        gl.uniformMatrix4fv(this.pMatrixLoc, false, projectionMatrix);
        gl.uniformMatrix4fv(this.normalMatrixLoc, false, normalMatrix);
        gl.uniform3fv(this.lightLoc, lightEyePos);
    }

    setColors(ambient, diffuse, specular, specularPower)
    {
        gl.uniform4fv(this.ambientLoc, ambient);
        gl.uniform4fv(this.diffuseLoc, diffuse);
        gl.uniform4fv(this.specularLoc, specular);
        gl.uniform1f(this.specularPowerLoc, specularPower);
    }

    setTexture(texture)
    {
        if(texture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(this.textureLoc, 0);
        }
    }

    toString()
    {
        return "[Shader " + this.name + "]";
    }
}