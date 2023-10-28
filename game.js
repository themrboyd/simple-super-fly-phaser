
var game;
let player;
let keyUp, keyDown
let keyLeft, keyRight;
let keyFire;
let bulletSpeed = 1200;

let playerBulletGrp;
let ufoGrp;
let ufoSpacing = 130;
let ufoSpeed = 200;

let explosionGrp;
let ufoBulletGrp;

let heartGrp;



var scene;
window.onload = function() {
    var gameConfig = {
        type:Phaser.AUTO,
        width: 1334,
        height:750,
        parent: 'gameContainer',
        scene: [bootGame,playGame],
        scale:{
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        backgroundColor: '#eeeeee',

        physics:{
            default: "arcade",
            arcade: {
                gravity: { y: 0},
                debug: false
            }
        }
    }

    game = new Phaser.Game(gameConfig);
    
}

class bootGame extends Phaser.Scene{
    constructor(){
        super("bootGame");
    }
    
    preload(){
        
        this.load.image("bone_bullet","assets/bullet.png");
        this.load.image("ufo","assets/spaceship.png"); 

        this.load.image("heart","assets/heart.png");

        this.load.image("ufo_bullet","assets/bullet_ufo.png");


        this.load.spritesheet("anim_fly","assets/evil_fly_idl.png", {
            frameWidth: 280, 
            frameHeight:188,
            spacing:20
        });

        this.load.spritesheet("anim_ufo","assets/sprites/little_ufo.png", {
            frameWidth: 232, 
            frameHeight:142
        });

        this.load.spritesheet("anim_exp1","assets/explosions/explosion_01_strip13.png", {
            frameWidth: 187, 
            frameHeight:188,
            spacing:15
        });

        this.load.spritesheet('tree-one-sheet','assets/tree1.png',{
            frameWidth:458,
            frameHeight: 458,
          });
      
          this.load.spritesheet('tree-two-sheet','assets/tree2.png',{
            frameWidth:458,
            frameHeight: 458,
          });
      
          this.load.spritesheet('tree-three-sheet','assets/tree3.png',{
            frameWidth:458,
            frameHeight: 458,
          });

          this.load.atlas("tree1", "assets/tree1.png", "assets/tree1.json");



        this.load.atlas("sakura", "assets/sakura-sheet.png", "assets/sakura-sheet.json");
    
    }

    create(){
        this.scene.start("playGame");
    }
}

class playGame extends Phaser.Scene{
    constructor(){
        super("playGame");
        this.playerHeart = 4;
    }

    
    createT111(){
        //tree1
        
        this.anims.create({
          key: 'tree1-grow',
          frames: this.anims.generateFrameNames('tree1', {
              start: 0,
              end: 8,
              zeroPad: 3,
              prefix: 'tile',
              suffix: '.png'
          }),
          frameRate: 1,
          repeat: 0
      });
      this.tree1=this.add.sprite(200,120,'tree1');
      this.tree1.setScale(0.25);
    //  this.tree1.play('tree1-grow');
      
      this.tree1.play('tree1-grow').anims.play("left", true).on('animationcomplete', () => {
        this.tree1.setVisible(false);
          this.anims.create({
            key: 'tree1-grow2',
            frames: this.anims.generateFrameNames('tree1', {
                start: 7,
                end: 8,
                zeroPad: 3,
                prefix: 'tile',
                suffix: '.png'
            }),
            frameRate: 0.5,
            repeat: -1
        });
        this.tree1=this.add.sprite(200,120,'tree1');
        this.tree1.setScale(0.25);
        this.tree1.play('tree1-grow2');
      } )
    
     
      
    
      }

    createPlayer(){
        
        this.anims.create({
            key: 'animFly',
            frames : this.anims.generateFrameNumbers('anim_fly',{
                start: 0,
                end: 9,
                first:0
            }),
            frameRate: 15,
            repeat : -1
        });
        let animFly = this.physics.add.sprite(game.config.width / 4, game.config.height / 2,'anim_fly').play("animFly");
        
        player = animFly;
        player.speed = 400;
        player.setScale(0.4);
        player.immortal = false;

  
    }

    createTreeSakura(){
        this.anims.create({
            key: 'sakura-grow',
            frames: this.anims.generateFrameNames('sakura', {
                start: 0,
                end: 60,
                zeroPad: 3,
                prefix: 'tile',
                suffix: '.png'
            }),
            frameRate: 2,
            repeat: 0
        });
        this.sakura=this.add.sprite(game.config.width/2,game.config.height/2,'sakura');
        this.sakura.play('sakura-grow');
        this.sakura.setScale(1);
    }

    createPlayerHeart(){
        for(let i = 0; i < this.playerHeart; i++){
            let heart = this.add.sprite(40 + (i * 35),40, "heart");
            heart.setScale(0.2);
            heart.depth =10;
            heartGrp.add(heart);
        }
    }
    createUFO(){
        for(var i = 0; i < 5; i++){

            this.anims.create({
                key: 'animUFO',
                frames : this.anims.generateFrameNumbers('anim_ufo',{
                    start: 0,
                    end: 1,
                    first:0
                }),
                frameRate: 3,
                repeat : -1
            });
            let animUFO = this.physics.add.sprite((game.config.width),100 + (i * ufoSpacing),'anim_ufo').play("animUFO");
            animUFO.setScale(0.5);
            let ufo = animUFO; 
            
            ufo.speed = (Math.random() * 2) + 1;
            ufo.startX = game.config.width + (ufo.width /2);
            ufo.startY = 100 + (i * ufoSpacing);
            ufo.x = ufo.startX;
            ufo.y = ufo.startY;

            ufo.magnitude = Math.random() * 70;

            ufo.fireInterval = (Math.random() * 3000) + 1500;
            ufo.fireTimer = this.time.addEvent({
                delay: ufo.fireInterval, 
                args: [ufo], 
                callback: this.ufoFire,
                repeat: -1
            });

            ufoGrp.add(ufo);
        }
    }

    ufoFire(enemy){
        let bullet = scene.physics.add.sprite(enemy.x, enemy.y, "ufo_bullet");
        bullet.setScale(0.5);
        bullet.body.velocity.x = -bulletSpeed;
        ufoBulletGrp.add(bullet);
    }
    
    create(){
        this.createPlayer();
        this.createTreeSakura();

        //this.createT111();
        playerBulletGrp = this.add.group();
        ufoGrp = this.add.group();
        this.createUFO();

        ufoBulletGrp = this.add.group();

        explosionGrp = this.add.group();

        heartGrp = this.add.group();

        this.createPlayerHeart();

        // Check collision
        this.physics.add.overlap(ufoGrp,playerBulletGrp,this.onUFOHit);
        this.physics.add.overlap(player, ufoBulletGrp, this.onPlayerHit);
        this.physics.add.overlap(player, ufoGrp, this.onPlayerHit);

        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyFire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        scene = this;
        
        
    }
    
  
    update(){ 
        this.updatePlayer();
        this.updatePlayerBullets();
        this.updateUFO();
        this.updateExplosion();
        this.updateUFOBullet();
    } 

    updateUFOBullet(){
        for(var i= ufoBulletGrp.getChildren().length - 1 ; i>=0; i--){
            let bullet = ufoBulletGrp.getChildren()[i];
            if (bullet.x < 0 - (bullet.width / 2)){
                bullet.destroy();
            }
            
        }
    }
    updateExplosion(){
        for(var i= explosionGrp.getChildren().length - 1 ; i>=0; i--){
            let explosion = explosionGrp.getChildren()[i];
            explosion.rotation += 0.04;
            explosion.alpha -= 0.05;
            if(explosion.alpha <= 0){
                explosion.destroy();
            }
        }
    }
    updateUFO(){
        for(var i=0; i< ufoGrp.getChildren().length; i++){
            let enemy = ufoGrp.getChildren()[i];
            enemy.x -= enemy.speed;
            enemy.y = enemy.startY + (Math.sin(game.getTime()/ 1000) * enemy.magnitude);
            if (enemy.x < 0 - (enemy.width / 2)){
                
                enemy.speed = (Math.random() * 2) + 1;
                enemy.x = enemy.startX;
                enemy.magnitude = Math.random() * 70;

             
                
            }
        }
    }
    updatePlayer(){

        if(keyUp.isDown){
            player.setVelocityY(-player.speed);
          }else if(keyDown.isDown){
            player.setVelocityY(player.speed);
          }else{
            player.setVelocityY(0);
        }
        if(keyLeft.isDown){
            player.setVelocityX(-player.speed);
          }else if(keyRight.isDown){
            player.setVelocityX(player.speed);
          }else{
            player.setVelocityX(0);
          }

          if(player.y < 0 + (player.getBounds().height / 2)){
            player.y = (player.getBounds().height / 2)
          }
          else if(player.y > game.config.height -  (player.getBounds().height / 2)){
            player.y = game.config.height -  (player.getBounds().height / 2);
          }
          else if(player.x < 0 + (player.getBounds().width / 2)){
            player.x = (player.getBounds().width / 2)
          }
          else if(player.x > game.config.width -  (player.getBounds().width / 2)){
            player.x = game.config.width -  (player.getBounds().width / 2);
          }
    
          if(Phaser.Input.Keyboard.JustDown(keyFire)){
            this.fire();
          }
    }
    updatePlayerBullets(){
        for(var i = 0; i < playerBulletGrp.getChildren().length; i++){
           let bullet = playerBulletGrp.getChildren()[i];
           bullet.angle += 1;
           if(bullet.x > game.config.width){
            bullet.destroy();
           }
        }
    }
    
    fire(){
        var bullet = this.physics.add.sprite(player.x + 50,player.y + 10, 'bone_bullet');
        bullet.setScale(1.2);
        bullet.body.velocity.x = bulletSpeed;
        playerBulletGrp.add(bullet);
        
    }
    onPlayerHit(player, obstacle){
        
        if(player.immortal == false){
            if(obstacle.texture.key == "ufo_bullet"){
                obstacle.destroy();
            }
            
            scene.playerHeart-- ;
            if(scene.playerHeart <= 0){
                scene.playerHeart = 0;
                scene.restartGame();
            }
            scene.updatePlayerHeart();
            player.immortal = true;

            console.log(scene.time)
            player.flickerTimer = scene.time.addEvent({
                delay: 100,
                
             callback: () => {        
                scene.playerFlickering();
            },
                repeat:15
            });
            
        }
        
    }

    restartGame = () => {

       // Show "Game Over" message
        const gameOverText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'Game Over',
            {
                fontFamily: 'Arial',
                fontSize: 58,
                backgroundColor:'#000000',
                color: '#ff0000'
            }
        );
        gameOverText.setOrigin(0.5);
        
        // Reset the game
        this.playerHeart = 4;
        this.updatePlayerHeart();

        // You can add additional game reset logic here
        // e.g., reset player position, score, and other game states

        // Delay for a few seconds before restarting the scene
        this.time.delayedCall(3000, () => {
            gameOverText.destroy(); // Remove the "Game Over" message
            this.scene.restart(); // Restart the scene
        });
    }
    playerFlickering(){ 
        player.setVisible(!player.visible); 
        if(player.flickerTimer.repeatCount == 0){
            player.immortal = false;
            player.setVisible(true);
            player.flickerTimer.remove();
        } 
    }
    updatePlayerHeart(){
        
        for(let i = heartGrp.getChildren().length -1 ; i >=0; i--){
            if(this.playerHeart < i+1){
                heartGrp.getChildren()[i].setVisible(false);
            }else{
                heartGrp.getChildren()[i].setVisible(true);
            }
        }
    }
    onUFOHit(ufo, bullet){
        bullet.destroy();

        scene.anims.create({
            key: 'animExp1',
            frames : scene.anims.generateFrameNumbers('anim_exp1',{
                start: 0,
                end: 12,
                first: 0
            }),
            frameRate:20,
            repeat: 0,
            hideOnComplete: true
        }); 
        let explosion1 = scene.physics.add.sprite(ufo.x,ufo.y,'anim_exp1').play("animExp1");
        explosionGrp.add(explosion1);

        ufo.x = ufo.startX;
        ufo.speed = (Math.random() * 2) + 1;
        
    }

    
}

