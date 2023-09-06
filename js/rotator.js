"strict mode";

class Rotator extends Component
{
    constructor(x, y, z, pivot = false)
    {
        super();

        this.xRot = x;
        this.yRot = y;
        this.zRot = z;

        this.pivot = pivot;
    }
    fixedUpdate()
    {
        super.fixedUpdate();
        if(this.pivot === false) {
            this.transform.rotate(this.xRot * time.fixedDeltaTime, this.yRot * time.fixedDeltaTime, this.zRot * time.fixedDeltaTime);
        }
        else {
            this.transform.rotateAround(
                this.xRot * time.fixedDeltaTime, this.yRot * time.fixedDeltaTime, this.zRot * time.fixedDeltaTime,
                this.pivot
            );
        }
    }
}