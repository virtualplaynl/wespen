"strict mode";

class GameObject
{
    constructor(name, position = [0,0,0], rotation = [0,0,0,1], scale = [1,1,1])
    {
        this.name = name;
        this.transform = new Transform(this, position.isComponent ? [0,0,0] : position, rotation.isComponent ? [0,0,0,1] : rotation, scale.isComponent ? [1,1,1] : scale);
        this.components = [this.transform];

        for(var c = 1; c < arguments.length; c++) {
            if(arguments[c].isComponent) {
                this.addComponent(arguments[c]);
            }
        }
    }

    toString()
    {
        var descr = this.name + " [";
        for (var i = 0; i < this.components.length; i++) {
            descr += this.components[i].constructor.name;
            if(i < this.components.length - 1) descr += ", ";
        }
        descr += "]";
        return descr;
    }

    addComponent(component)
    {
        this.components.push(component);
        component.gameObject = this;
        component.transform = this.transform;
    }

    fixedUpdate()
    {
        this.components.forEach(component => {
            component.fixedUpdate();
        });
        this.components.forEach(component => {
            if(component.physicsUpdate) component.physicsUpdate();
        });
    }
    lateUpdate()
    {
        this.components.forEach(component => {
            component.lateUpdate();
        });
    }
    update()
    {
        this.components.forEach(component => {
            component.update();
        });
    }
    render()
    {
        this.components.forEach(component => {
            component.render();
        });
    }
}