(function (){
   var b2Vec2 = Box2D.Common.Math.b2Vec2,
       b2BodyDef = Box2D.Dynamics.b2BodyDef,
       b2Body = Box2D.Dynamics.b2Body,
       b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
       b2Fixture = Box2D.Dynamics.b2Fixture,
       b2World = Box2D.Dynamics.b2World,
       b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
       b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
       b2Shape = Box2D.Collision.Shapes.b2Shape,
       b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
   
   var gravity;   
   var world;
   var FRAMES_PER_SECOND = 60;
   var drawScale = 10; // scaling factor for pixel to metres (default unit)
   var canvas = document.getElementById("myCanvas");
   var debugSpan = document.getElementById("debug");
   var context = canvas.getContext("2d");

   // keyboard vars
   var left = 0;
   var right = 0;
   var up = 0;
   var down = 0;

   document.addEventListener("keydown", handleKeyDown, false);
   document.addEventListener("keyup", handleKeyUp, false);      

   var mouse = new Object();
   mouse.x = 0;
   mouse.y = 0;

   var jumpAngle = 1.472
   var jumpPower = 1000;

   function step() {

      // function to step | redraw the world
      world.Step(1/FRAMES_PER_SECOND, 10, 10); // ??? study the manual on world.
      
      console.log(left + " " + right);

      if(right === 1){

        // make the object move right
        projectileObject.SetAwake(true);
        projectileObject.m_linearVelocity.x = 10;

      } else if(left === 1) {
        
        // make the object move left
        projectileObject.SetAwake(true);
        projectileObject.m_linearVelocity.x = -10;

      } else if(up === 1) {
        
        // make the object jump
        projectileObject.SetAwake(true);
        if(projectileObject.m_linearVelocity.y === 0){
          projectileObject.m_linearVelocity.y = 80;
        }
        
        /*
        projectileObject.ApplyImpulse(new b2Vec2(Math.cos(jumpAngle)*jumpPower,
                                 Math.sin(jumpAngle)*jumpPower),
                                 projectileObject.GetWorldCenter());
        */

      } else if(down === 1) {
        
        // make the object fall down

      } else {
        
        // make the object stop
        // projectileObject.m_linearVelocity.x = 0.0;

      }
      
      draw();

   }
 
   function init() {

      // function to initialise gameplay
      gravity = new b2Vec2(0,9.81); // sets the gravity vector
      world = new b2World(gravity, true); // initialises the box2d world with the gravity vector      

      var debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(context);
      debugDraw.SetDrawScale(drawScale);
      debugDraw.SetFillAlpha(0.3);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      world.SetDebugDraw(debugDraw);

      var bodyDef = new b2BodyDef;
      var fixDef = new b2FixtureDef;
      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsEdge({
        x: 0, 
        y: ptm(canvas.height)}, 
        {
          x: ptm(canvas.width), 
          y: ptm(canvas.height)
        });
      world.CreateBody(bodyDef).CreateFixture(fixDef);

      projectileObject = createCircle(ptm(20),ptm(canvas.height),2,undefined);

      // build sample world
      createRectangle(ptm(220),ptm(480),2,2,undefined);
      createRectangle(ptm(260),ptm(440),2,2,undefined);
      createRectangle(ptm(260),ptm(480),2,2,undefined);
      createRectangle(ptm(300),ptm(400),2,2,undefined);
      createRectangle(ptm(300),ptm(440),2,2,undefined);
      createRectangle(ptm(300),ptm(480),2,2,undefined);
      createRectangle(ptm(340),ptm(400),2,2,undefined);
      createRectangle(ptm(380),ptm(400),2,2,undefined);
      createRectangle(ptm(420),ptm(400),2,2,undefined);
      createRectangle(ptm(460),ptm(400),2,2,undefined);
      var height = 500;
      for(var ctr=1;ctr<=2;ctr++){
          createRectangle(ptm(600),ptm(height),2,2,undefined);
          height -= 50;  
      }
      height = 500;
      for(var ctr=1;ctr<=3;ctr++){
          createRectangle(ptm(700),ptm(height),2,2,undefined);  
          height -= 50;
      }
      height = 500;
      for(var ctr=1;ctr<=2;ctr++){
          createRectangle(ptm(800),ptm(height),2,2,undefined);  
          height -= 50;
      }      
        
      canvas.addEventListener("click", handleMouseClick, false);
      canvas.addEventListener("mousemove", handleMouseMove, false);
      
      canvas.onselectstart = function(){
        return false;
      }

      window.setInterval(step, 1000/FRAMES_PER_SECOND);
      
   }

   function handleKeyDown(e){

      switch (e.keyCode) {
                case 37 :
                    left = 1;
                    break;
                case 38 :
                    up = 1;
                    break;
                case 39 :
                    right = 1;
                    break;
                case 40 :
                    down = 1;
                    break; 
            }

   }

   function handleKeyUp(e){

      switch (e.keyCode) {
                case 37 :
                    left = 0;
                    right = 0;
                    break;
                case 38 :
                    up = 0;
                    down = 0;
                    break;
                case 39 :
                    right = 0;
                    left = 0;
                    break;
                case 40 :
                    down = 0;
                    up = 0;
                    break; 
            }

   }

   function handleMouseClick(event) {

        
   }

   function handleMouseMove(event){

        mouse.x = event.clientX - canvas.getBoundingClientRect().left;
        mouse.y = event.clientY - canvas.getBoundingClientRect().top;

   }

   function draw(){

        world.DrawDebugData();

   }

   function defaultProperties(){

      this.type = b2Body.b2_dynamicBody;
      this.linearDamping = 1.0;
      this.angularDamping = 2.0;
      this.fixedRotation = true;
      this.isBullet = true; // continouos collision detection
      this.density = 1.0;
      this.friction = 1.0;
      this.restitution = 0.2;

   }

   function createRectangle(x, y, width, height, properties){

      // check if properties have been defined explicitly, else assign default
      properties = (typeof properties != 'undefined') ? properties : new defaultProperties; 

      // define body properties
      var bodyDef = new b2BodyDef;

      // default behaviour : dynamic body
      // bodyDef.type = properties.type;

      // below line assigns the body to be static
      bodyDef.type = b2Body.b2_staticBody;
      
      bodyDef.position.x = x;
      bodyDef.position.y = y;
      bodyDef.linearDamping = properties.linearDamping;
      bodyDef.angularDamping = properties.angularDamping;
      bodyDef.bullet = properties.isBullet;

      // define fixture properties
      var fixDef = new b2FixtureDef;
      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsBox(width, height);
      fixDef.density = properties.density;
      fixDef.friction = properties.friction;
      fixDef.restitution = properties.restitution;

      // add body to the world and return reference
      var body = world.CreateBody(bodyDef);
      body.CreateFixture(fixDef);
      return body;

   }

   function createCircle(x, y, radius, properties){

      // check if properties have been defined explicitly, else assign default
      properties = (typeof properties != 'undefined') ? properties : new defaultProperties; 

      // define body properties
      var bodyDef = new b2BodyDef;
      bodyDef.type = properties.type;
      bodyDef.position.x = x;
      bodyDef.position.y = y;
      bodyDef.linearDamping = properties.linearDamping;
      bodyDef.angularDamping = properties.angularDamping;
      bodyDef.bullet = properties.isBullet;

      // define fixture properties
      var fixDef = new b2FixtureDef;
      fixDef.shape = new b2CircleShape(radius);
      fixDef.density = properties.density;
      fixDef.friction = properties.friction;
      fixDef.restitution = properties.restitution;

      // add body to the world and return reference
      var body = world.CreateBody(bodyDef);
      body.CreateFixture(fixDef);
      return body;

   }

   function angleBetween2Lines(mouseX, mouseY){
        // line 1 := (0, canvas.height) -> (canvas.width, canvas.height)
        // line 2 := (0, canvas.height) -> (mouseX, mouseY)
        var angle1 = Math.atan2(0, 0 - canvas.width);
        var angle2 = Math.atan2(canvas.height - mouseY, 0 - mouseX);
        return (angle1-angle2);
   }

   function mtp(metres){

      return metres * drawScale;

   }

   function ptm(pixels){

      return pixels / drawScale;

   }
 
   // invoke the initialiser function
   init();

})();