"strict mode";

class Material
{
    constructor(textureUrl = null, textureImage = null, ambientColor = [0.1,0.1,0.1,1], diffuseColor = [1,1,1,1], specularColor = [1,1,1,0.5], specularPower = 8.0, shader = wespen.glCanvas.defaultShader)
    {
        this.shader = shader;
        this.texture = wespen.glCanvas.defaultTexture;
        this.textureImage = textureImage;
        this.textureUrl = textureUrl;
        var mat = this;
        if(textureUrl) {
            this.textureImage = null;
            this.loadTextureAsync(this.textureUrl);
        }
        else {
            this.loaded = true;
            if(textureImage) this.bindImage(textureImage);
        }
        this.ambientColor = ambientColor;
        this.diffuseColor = diffuseColor;
        this.specularColor = specularColor;
        this.specularPower = specularPower;
    }

    applyForRendering()
    {
        this.shader.setColors(this.ambientColor, this.diffuseColor, this.specularColor, this.specularPower);
        this.shader.setTexture(this.texture);
    }

    loadTextureAsync(url, callback)
    {
        this.loaded = false;
        wespen.totalAssets++;
        wespen.loadingAssets++;
        const image = new Image();
        var mat = this;
        image.onload = function() {
            mat.bindImage(image);
            mat.loaded = true;
            wespen.loadingAssets--;
        };
        image.src = url;
    }

    bindImage(image)
    {
        function isPowerOf2(value) { // TODO in Math helper class?
            return (value & (value - 1)) == 0;
        }

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else { // NPOT! Warning? or Pixel-perfect sprite?
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    }

    toString()
    {
        return "[Material (" + this.shader.toString() + ")]";
    }
}