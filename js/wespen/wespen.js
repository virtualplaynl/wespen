"strict mode";

var wespen;
var time = [];
const perfWindow = 60;

class WespenGame
{
    constructor(name, width, height, defaultVertexShader, defaultFragmentShader, showDebug, startupScene)
    {
        wespen = this;
        this.debug = showDebug;

        if(width == 0) {
            width = document.body.clientWidth;
            height = document.body.clientHeight;
            document.body.style.padding = "0";
            document.body.style.margin = "0";
        }

        this.name = name;

        if(this.debug) console.log("WESPEn starting '" + name + "' at " + width + "x" + height);

        this.width = width;
        this.height = height;
        this.vertexShader = defaultVertexShader;
        this.fragmentShader = defaultFragmentShader;

        this.canvas = document.createElement("canvas");
        this.canvas.id = "wespenCanvas";
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.zIndex = 1;

        document.body.appendChild(this.canvas);

        if(showDebug) {
            var panel = document.createElement("div");
            panel.style.backgroundColor = "rgba(90, 80, 85, 1)";
            panel.style.position = "fixed";
            panel.style.display = "table";
            panel.style.top = 0;
            panel.style.left = 0;
            panel.style.zIndex = 2;
            panel.style.color = "white";
            panel.style.textAlign = "center";
            panel.style.width = "160px";
            panel.style.height = "100px";
            panel.style.opacity = 0.6;
            var debugText = document.createElement("span");
            debugText.style.display = "table-cell";
            debugText.style.fontFamily = "sans-serif";
            debugText.style.fontSize = "11px";
            debugText.style.lineHeight = "16px";
            debugText.style.verticalAlign = "middle";
            debugText.innerHTML = "0 FPS";
            document.body.appendChild(panel);
            panel.appendChild(debugText);
            this.debugPanel = panel;
            this.debugText = debugText;
        }

        var loadingScreen = document.createElement("div");
        loadingScreen.style.background = "linear-gradient(rgba(150, 140, 130, 1), black)";
        loadingScreen.style.position = "fixed";
        loadingScreen.style.display = "table";
        loadingScreen.style.top = 0;
        loadingScreen.style.left = 0;
        loadingScreen.style.zIndex = 100;
        loadingScreen.style.color = "white";
        loadingScreen.style.textAlign = "center";
        loadingScreen.style.alignContent = "center";
        loadingScreen.style.width = "100%";
        loadingScreen.style.height = "100%";
        var loadingContent = document.createElement("div");
        loadingContent.style.display = "table-cell";
        loadingContent.style.verticalAlign = "middle";
        var loadingText = document.createElement("span");
        loadingText.style.fontFamily = "sans-serif";
        loadingText.style.fontSize = "11px";
        loadingText.style.lineHeight = "22px";
        loadingText.innerHTML = "<b>" + name + "</b><br />Loading...<br />0%<br />";
        var loadingBarBack = document.createElement("div");
        loadingBarBack.style.backgroundColor = "rgba(150, 140, 130, 1)";
        loadingBarBack.style.display = "inline-block";
        loadingBarBack.style.width = "200px";
        loadingBarBack.style.height = "10px";
        var loadingBar = document.createElement("div");
        loadingBar.style.backgroundColor = "rgba(255, 255, 255, 1)";
        loadingBarBack.style.display = "inline-block";
        loadingBar.style.width = "1%";
        loadingBar.style.height = "10px";
        document.body.appendChild(loadingScreen);
        loadingScreen.appendChild(loadingContent);
        loadingContent.appendChild(loadingText);
        loadingContent.appendChild(loadingBarBack);
        loadingBarBack.appendChild(loadingBar);
        this.loadingScreen = loadingScreen;
        this.loadingText = loadingText;
        this.loadingBar = loadingBar;

        this.scenes = [startupScene];
        this.loadingAssets = 0;
        this.totalAssets = 0;

        time.timeScale = 1.0;

        document.body.onload = function() {
            wespen.glCanvas = new GLCanvas(wespen.canvas, wespen.vertexShader, wespen.fragmentShader, true);

            wespen.fixedDelta = 0;
            time.fixedTimestep = 1.0 / 100.0;
            wespen.fixedUpdateLoop = setInterval(wespen.fixedUpdate, 1000.0 * wespen.fixedTimestep);
            wespen.renderLoop = setInterval(wespen.render, 1000.0 / 60.0);
            wespen.startupTime = performance.now();
            wespen.lastFixed = performance.now();
            wespen.lastRender = performance.now();
            this.fps = 60;
            this.cpuTime = 0;
            this.gpuTime = 0;
            this.debugFrames = 0;
            wespen.polyCount = 0;
            wespen.drawCalls = 0;
            time.frameCount = 0;
            time.fixedTime = 0;
            time.fixedUnscaledTime = 0;
            time.unscaledTime = 0;
            time.time = 0;
            time.timeSinceLevelLoad = 0;
            time.realTimeSinceStartup = 0;
            time.inFixedTimeStep = false;

            startupScene.initialize();
        };
    }

    fixedUpdate()
    {
        if(wespen.loadingAssets == 0) {
            if(wespen.loadingScreen) {
                document.body.removeChild(wespen.loadingScreen);
                wespen.loadingScreen = null;
            }
            this.thisFixed = performance.now();
            wespen.fixedDelta += (this.thisFixed - wespen.lastFixed) * 0.001;
            time.realTimeSinceStartup = (this.thisFixed - wespen.startupTime) * 0.001;
            wespen.lastFixed = this.thisFixed;
            while(wespen.fixedDelta >= time.fixedTimestep) {
                time.fixedUnscaledDeltaTime = Math.min(wespen.fixedDelta, time.fixedTimestep);
                time.fixedUnscaledTime += time.fixedUnscaledDeltaTime;
                time.fixedDeltaTime = time.fixedUnscaledDeltaTime * time.timeScale;
                time.fixedTime += time.fixedDeltaTime;
                time.inFixedTimeStep = true;
                wespen.gameObjects.forEach(gameObject => {
                    gameObject.fixedUpdate();
                });
                time.inFixedTimeStep = false;
                wespen.fixedDelta -= time.fixedTimestep;
            }
            this.cpuTime += (performance.now() - this.thisFixed);
        }
        else {
            var loaded = (100 * (1 - wespen.loadingAssets / wespen.totalAssets)).toFixed(0);
            wespen.loadingText.innerHTML = "<b>" + wespen.name + "</b><br />Loading...<br />"+loaded+"%<br />";
            wespen.loadingBar.style.width = loaded+"%";
        }
    }

    render()
    {
        if(wespen.loadingAssets == 0) {
            this.thisRender = performance.now();
            time.unscaledDeltaTime = (this.thisRender - wespen.lastRender) * 0.001;
            time.realTimeSinceStartup = (this.thisRender - wespen.startupTime) * 0.001;
            wespen.lastRender = this.thisRender;
            time.unscaledTime += time.unscaledDeltaTime;
            time.deltaTime = time.unscaledDeltaTime * time.timeScale;
            time.time += time.deltaTime;
            time.timeSinceLevelLoad += time.deltaTime;

            var startTime = performance.now();
            wespen.gameObjects.forEach(gameObject => {
                gameObject.update();
            });
            wespen.gameObjects.forEach(gameObject => {
                gameObject.lateUpdate();
            });
            this.cpuTime += (performance.now() - startTime);

            startTime = performance.now();
            wespen.glCanvas.startRender();
            wespen.gameObjects.forEach(gameObject => {
                gameObject.render();
            });
            this.gpuTime += (performance.now() - startTime);

            if(wespen.debugPanel) {
                this.debugFrames++;
                this.fps += 1 / time.unscaledDeltaTime;
                if(this.debugFrames == perfWindow) {
                    wespen.debugText.innerHTML = "<b style='font-size: 12px;'>" + (this.fps / perfWindow).toFixed(1) + " FPS</b><br />CPU: <b style='font-size: 12px;'>" + (this.cpuTime/perfWindow).toFixed(2) + " ms</b> (" + (1000/this.cpuTime*perfWindow).toFixed(0) + " /s)<br />GPU: <b style='font-size: 12px;'>" + (this.gpuTime/perfWindow).toFixed(2) + " ms</b> (" + (1000/this.gpuTime*perfWindow).toFixed(0) + " /s)<br />Polycount: " + wespen.polyCount + "<br />Draw calls: " + (wespen.drawCalls / perfWindow);
                    this.fps = 0;
                    this.debugFrames = 0;
                    this.cpuTime = 0;
                    this.gpuTime = 0;
                    wespen.drawCalls = 0;
                }
            }
        }
    }
}
