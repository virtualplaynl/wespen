class Camera extends Component
{
    constructor(gameObject, fov, nearClip, farClip, position, rotation)
    {
        super();

        gameObject.addComponent(this);

        this.fov = fov;
        this.nearClip = nearClip;
        this.farClip = farClip;

        this.pMatrix = mat4.create();
        mat4.perspective(this.pMatrix, fov, gl.viewportWidth / gl.viewportHeight, nearClip, farClip);

        this.transform.position = position;
        this.transform.rotation = rotation;
    }
    
    update()
    {
        if(this === wespen.mainCamera) {
            wespen.viewMatrix = mat4.create();
            var pos = vec3.create();
            vec3.scale(pos, this.transform.position, -1.0);
            var camRot = quat.create();
            quat.copy(camRot, this.transform.rotation);
            camRot[3] *= -1;
            mat4.fromRotationTranslation(wespen.viewMatrix, camRot, [0,0,0]);
            mat4.translate(wespen.viewMatrix, wespen.viewMatrix, pos);
        }
    }
}