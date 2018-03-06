class PhysicsScene extends Scene
{
    constructor()
    {
        super("Physics Demo");
    }

    awake()
    {
        wespen.gameObjects.push(new GameObject("Skybox", [0,0,-5], [0,0,0,1], [1,1,1], new Skybox("skybox_stormydays.jpg")));
        wespen.gameObjects.push(new GameObject("Sphere", [0,2,0], new UVSphere(0.5, new Material("MetalBall.png", null, [0.1,0.1,0.1,1], [1,1,1,1], [1,1,1,1], 100)), new Rigidbody()));
        wespen.gameObjects.push(new GameObject("Plane", [0,-1,-1.7], new Plane(10, new Material("CinderBlock.jpg"))));
        time.timeScale = 0.1;
    }
}