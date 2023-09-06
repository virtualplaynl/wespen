class PrimitivesScene extends Scene
{
    constructor()
    {
        super("Primitives Demo");
    }

    awake()
    {
        wespen.gameObjects.push(new GameObject("Skybox", [0,0,-5], [0,0,0,1], [1,1,1], new Skybox("skybox_stormydays.jpg")));
        wespen.gameObjects.push(new GameObject("Tetra", [0,-1,0], new Tetrahedron(0.5, new Material("TetraDie.png", null, [0.4,0.4,0.2,1])), new Rotator(62, 12, -24)));
        wespen.gameObjects.push(new GameObject("Icosa", [1,0,0], new Icosahedron(0.5, new Material("IcosaDie.png", null, [0.4,0.4,0.2,1])), new Rotator(62, 12, -24)));
        wespen.gameObjects.push(new GameObject("Octa", [0,1,0], new Octahedron(0.5, new Material("OctaDie.png", null, [0.4,0.4,0.2,1])), new Rotator(62, 12, -24)));
        wespen.gameObjects.push(new GameObject("Dodeca", [-1,0,0], new Dodecahedron(0.5, new Material("DodecaDie.png", null, [0.4,0.4,0.2,1])),  new Rotator(62, 12, -24)));
        wespen.gameObjects.push(new GameObject("Cube", [0,0,0], [0,0,0,1], [0.5,0.5,0.5], new Cube(1.0, new Material("HexaDie.png", null, [0.4,0.4,0.2,1])), new Rotator(0, 62, 0)));
        wespen.gameObjects.push(new GameObject("Sphere", [-1,-1,0], new UVSphere(0.5, new Material("uvgrid.png", null, [0.4,0.4,0.2,1],[1,1,1,1],[1,1,1,0.3],20)), new Rotator(62, 12, -24)));
        wespen.mainCamera.addComponent(new Rotator(-12, 0, 0, [0,0,0]));
    }
}