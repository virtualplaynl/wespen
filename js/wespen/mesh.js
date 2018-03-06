"strict mode";

class Mesh extends Component
{
    // normals: normals array, or true for calculate smooth, or false for calculate flat
    constructor(material, vertices, normals, uvs, indices)
    {
        super();

        this.material = material;
        this.shader = material.shader;

        this.itemSize = 3;  // rendering triangles

        var i, j, k, v, n, edge1, edge2, faceNormal;
        if(normals === true) {  // calculate smooth shading normals TODO: cancel seam when vertices share spot but not index (e.g. because of uv coords)
            normals = [];
            for(i = 0; i < vertices.length; i++) {
                normals.push(0);
            }
            for(i = 0; i < indices.length; i += 3) {
                v = [0,0,0];
                for(j = 0; j < 3; j++) v[j] = vertices.slice(indices[i+j] * 3, indices[i+j] * 3 + 3);

                faceNormal = this.triangleNormal(v);

                for(j = 0; j < 3; j++) {
                    for(k = 0; k < 3; k++) normals[indices[i+j] * 3 + k] += faceNormal[k];
                }
            }
            for(n = 0; n < normals.length; n += 3) {
                var normal = normals.slice(n, n + 3);
                vec3.normalize(normal, normal);
                for(j = 0; j < 3; j++) normals[n + j] = normal[j];
            }
        }
        else if(normals === false) {  // calculate flat shading normals; Warning: vertices will be duplicated!
            normals = [];
            var newVertices = [];
            var newIndices = [];
            for(i = 0; i < indices.length; i += 3) {
                v = [0,0,0];
                for(j = 0; j < 3; j++) v[j] = vertices.slice(indices[i+j] * 3, indices[i+j] * 3 + 3);

                faceNormal = this.triangleNormal(v);
                vec3.normalize(faceNormal, faceNormal);

                for(j = 0; j < 3; j++) {
                    for(k = 0; k < 3; k++) {
                        normals.push(faceNormal[k]);
                        newVertices.push(v[j][k]);
                    }
                    newIndices.push(i+j);
                }
            }
            vertices = newVertices;
            indices = newIndices;
        }

        this.vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        this.normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        if(!uvs) {
            uvs = [];
            for (let i = 0; i < indices.length; i++) {
                uvs.push(0, 0);
            }
        }
        this.uvsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(indices), gl.STATIC_DRAW);

        this.numItems = indices.length;

        wespen.polyCount += indices.length / 3;
    }

    triangleNormal(vertices)
    {
        var edge1 = vec3.create();
        var edge2 = vec3.create();
        var faceNormal = vec3.create();
        vec3.subtract(edge1, vertices[1], vertices[0]);
        vec3.subtract(edge2, vertices[2], vertices[0]);
        vec3.cross(faceNormal, edge1, edge2);

        return faceNormal;
    }
    
    render(shader)
    {
        var modelMatrix = mat4.create();
        mat4.fromRotationTranslationScale(modelMatrix, this.gameObject.transform.rotation, this.gameObject.transform.position, this.gameObject.transform.scale);
        
        this.shader.setView(modelMatrix, wespen.viewMatrix, wespen.mainCamera.pMatrix, wespen.singleLightPos);
        this.material.applyForRendering();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
        gl.vertexAttribPointer(this.shader.positionLoc, this.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.vertexAttribPointer(this.shader.normalsLoc, this.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer);
        gl.vertexAttribPointer(this.shader.uvsLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.shader.uvsLoc);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.numItems, gl.UNSIGNED_SHORT, 0);

        wespen.drawCalls++;
    }
}