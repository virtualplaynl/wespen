class Component
{
    constructor()
    {
        this.isComponent = true;
    }

    name()
    {
        if(this.gameObject) { return this.gameObject.name; }
        return "(Unattached)";
    }

    toString()
    {
        return this.name() + " > " + this.constructor.name;
    }

    addComponent(component)
    {
        this.gameObject.addComponent(component);
    }

    enable()
    {
        this.enabled = true;
        this.onEnable();
    }
    disable()
    {
        this.enabled = false;
        this.onDisable();
    }

    onEnable()
    {}
    onDisable()
    {}

    fixedUpdate()
    {}
    lateUpdate()
    {}
    update()
    {}
    render()
    {}
}