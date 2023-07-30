import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS2DRenderer.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(3, 2, 3);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

var labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(innerWidth, innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

var controls = new OrbitControls(camera, labelRenderer.domElement);

var light = new THREE.PointLight( 0xffffff, 3, 5000 );
light.position.set(5, 5, 5);
scene.add(light);

var light = new THREE.PointLight( 0xffffff, 1, 5000 );
light.position.set(-5, -5, -5);
scene.add(light);
// scene.add(new THREE.AmbientLight(0xffffff, 20));

const cubeMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x0088ff }),
    new THREE.MeshBasicMaterial({ color: 0x0088ff }),
    new THREE.MeshBasicMaterial({ color: 0x0088ff }),
    new THREE.MeshBasicMaterial({ color: 0x0088ff }),
    new THREE.MeshBasicMaterial({ color: 0x0088ff }),
    new THREE.MeshBasicMaterial({ color: 0x0088ff }),
  ];

var boxInside = new THREE.Mesh(new THREE.BoxBufferGeometry(1.8, 1.8, 1.8), new THREE.MeshPhongMaterial( { ambient: 0x0088ff, color: 0x0088ff, specular: 0xffffff, shininess: 10, shading: THREE.SmoothShading } ));
scene.add(boxInside);

var box = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 2, 2), new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: true,transparent: true,  opacity: 0.8, }));
scene.add(box);

// BOX MOVE WHEN MESSAGE REIVED :

const socket = new WebSocket('ws://localhost:5001');
        socket.onmessage = (event) => {
          const dataFromServer = event.data;
          // console.log(dataFromServer);
          const data = JSON.parse(dataFromServer);
          // console.log(data);
          box.rotation.x = data.gyro_x
          boxInside.rotation.x = data.gyro_x
          box.rotation.y = data.gyro_y
          boxInside.rotation.y = data.gyro_y
        };









var pos = new THREE.Vector3(1.1, 0, 0);
var normal = new THREE.Vector3().copy(pos).normalize();

var cNormal = new THREE.Vector3();
var cPos = new THREE.Vector3();
var m4 = new THREE.Matrix4();

var div = document.createElement('div');
div.className = 'label';
div.textContent = '1';
div.style.marginTop = '-1em';
div.style.fontSize = "40px"
var label = new CSS2DObject(div);
label.position.copy(pos);
box.add(label);

div.addEventListener("click", function(event) {
    console.log("I clicked");
    
    const itemList = document.getElementById('item-list');
    const li = document.createElement('div');
    li.textContent = div.textContent;
    console.log(li);
  
    const childElement = document.createElement('div');
    const dynamicValue = div.textContent;
    
    childElement.innerHTML = `
      <div class="item">
        <div class="title">Face n°${dynamicValue}</div>
        <form>
        <input class="input" type="text" id="name" name="name" placeholder="NICARV-210" required minlength="4" maxlength="8" size="10">
        </form>
      </div>
    `;
    
    itemList.appendChild(childElement);
  });
  


renderer.setAnimationLoop(() => {

    cNormal.copy(normal).applyMatrix3(box.normalMatrix);
    cPos.copy(pos).applyMatrix4(m4.multiplyMatrices(camera.matrixWorldInverse, box.matrixWorld));
    let d = cPos.negate().dot(cNormal);

    div.style.visibility = d < 0 ? "hidden" : "visible";

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
});

