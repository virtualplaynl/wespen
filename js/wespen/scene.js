"strict mode";

class Scene
{
    constructor(name, simpleInit)
    {
        this.name = name;
        this.simpleInit = simpleInit;
    }

    initialize()
    {
        if(wespen.debug) console.log("Starting Scene: " + this.name);
        
        this.gameObjects = [];
        wespen.currentScene = this;
        wespen.gameObjects = this.gameObjects;

        var cameraObject = new GameObject("Main Camera");
        wespen.mainCamera = new Camera(cameraObject, 45, 0.1, 1000, [0,0,5], [0,0,0,1]);
        wespen.gameObjects.push(cameraObject);

        wespen.singleLightPos = [3, 2, 2];

        time.timeSinceLevelLoad = 0;
        
        if(this.simpleInit) this.simpleInit();
        if(this.awake) this.awake();
        if(this.onEnable) this.onEnable();
        if(this.start) this.start();
    }
}