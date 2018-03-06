class Transform extends Component
{
    constructor(gameObject, position = [0.0, 0.0, 0.0], rotation = [0.0, 0.0, 0.0, 1.0], scale = [1.0, 1.0, 1.0])
    {
        super();

        this.gameObject = gameObject;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }

    rotate(x, y, z, local = true)
    {
        if(local == false) {
            this.rotateAround(eulerAngles, [0,0,0]);
        }
        else {
            var rotQ = quat.create();
            quat.fromEuler(rotQ, x, y, z);
            quat.multiply(this.rotation, rotQ, this.rotation);
        }
    }
    rotateAround(x, y, z, pivot)
    {
        var rotQ = quat.create();
        quat.fromEuler(rotQ, x, y, z);
        var rot = mat4.create();
        var trans = mat4.create();
        vec3.negate(pivot, pivot);
        mat4.fromTranslation(trans, pivot);
        mat4.fromRotationTranslation(rot, rotQ, [0,0,0]);
        mat4.multiply(rot, rot, trans);
        vec3.negate(pivot, pivot);
        mat4.fromTranslation(trans, pivot);
        mat4.multiply(rot, trans, rot);
        vec3.transformMat4(this.position, this.position, rot);

        quat.multiply(this.rotation, rotQ, this.rotation);
    }
    translate(offset, local = false)
    {
        for(var i = 0; i < 3; i++) this.position[i] += offset[i];
    }
}