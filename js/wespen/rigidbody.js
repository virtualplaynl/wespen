"strict mode";

class Rigidbody extends Component
{
    constructor(mass = 1, damping = 0.995)
    {
        super();
        this.setMass(mass);
        this.velocity = [0,0,0];
        this.acceleration = [0,-9.81,0];
        this.totalForce = [0,0,0];
        this.damping = damping;
    }

    setMass(mass)
    {
        this.mass = mass;
        this.inverseMass = 1 / mass;
    }

    physicsUpdate()
    {
        if(!this.position) {
            this.transform = this.gameObject.transform;
            this.position = this.transform.position;
        }
        var totalAcceleration = [0,0,0];
        vec3.scaleAndAdd(totalAcceleration, this.acceleration, this.totalForce, this.inverseMass);
        vec3.scaleAndAdd(this.velocity, this.velocity, this.acceleration, time.fixedDeltaTime);
        if(this.damping > 0) {
            var damp = Math.pow(this.damping, time.fixedDeltaTime);
            vec3.scale(this.velocity, this.velocity, damp);
        }
        vec3.scaleAndAdd(this.position, this.position, this.velocity, time.fixedDeltaTime);

        this.totalForce = [0,0,0];
    }

    addForce(force, mode = 0)
    {
        vec3.add(this.totalForce, this.totalForce, force);
    }
}