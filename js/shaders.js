var flatVertexShader = `
attribute vec3 position;
uniform mat4 projection;
uniform mat4 modelview;
void main(void) {
    gl_Position = projection * modelview * vec4(position, 1.0);
}
`;

var flatWhiteFragShader = `
precision mediump float;
void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

var phongVertShader = `
attribute vec3 position;
attribute vec2 texCoord;
attribute vec3 normal;

uniform mat4 projection, modelview, normalMatrix;
uniform vec3 light;

varying vec3 normalInterp;
varying vec3 vertPos;
varying vec3 lightPos;
varying highp vec2 uv;

void main(){
    gl_Position = projection * modelview * vec4(position, 1.0);
    vec4 vertPos4 = modelview * vec4(position, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = vec3(normalMatrix * vec4(normal, 0.0));
    lightPos = light;
    uv = texCoord;
}
`;

var phongFragShader = `
precision mediump float; 

varying vec3 normalInterp;
varying vec3 vertPos;
varying vec3 lightPos;
varying highp vec2 uv;

uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularPower;
uniform sampler2D diffuseTexture;

void main() {
    vec3 normal = normalize(normalInterp);
    vec3 lightDir = normalize(lightPos - vertPos);
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 viewDir = normalize(-vertPos);

    float lambertian = max(dot(lightDir,normal), 0.0);
    float specular = 0.0;

    vec4 texColor = texture2D(diffuseTexture, uv);

    if(lambertian > 0.0) {
       float specAngle = max(dot(reflectDir, viewDir), 0.0);
       specular = specularColor.a * pow(specAngle, specularPower);
    }
    float alpha = diffuseColor.a;
    if(alpha == 0.0) alpha = ambientColor.a;
    gl_FragColor = vec4(texColor.rgb * (ambientColor.rgb*diffuseColor.rgb +
                      lambertian*diffuseColor.rgb) +
                      specular*specularColor.rgb, texColor.a * alpha);
}
`;