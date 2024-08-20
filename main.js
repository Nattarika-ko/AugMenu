import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.gammaFactor = 10;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x632c22);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

let currentModel = null;
export let currentUrl = null;

function setModelSize(model, targetSize) {
  if (!model) return;
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = targetSize / maxDim;
  model.scale.set(scale, scale, scale);
}

function loadModel(modelPath, targetSize = 0.7) {
  if (currentModel) {
    scene.remove(currentModel);
  }

  document.getElementById('progress-container').style.display = 'block';

  const loader = new GLTFLoader().setPath('models/');
  loader.load(modelPath, (gltf) => {
    currentModel = gltf.scene;
    currentModel.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          map: child.material.map,
          color: child.material.color
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    currentModel.position.set(0, 2, -1);
    setModelSize(currentModel, targetSize);
    scene.add(currentModel);
    const box = new THREE.Box3().setFromObject(currentModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5;

    camera.position.set(center.x, center.y, center.z + cameraZ);

    controls.target.set(center.x, center.y, center.z);
    controls.update();

    document.getElementById('progress-container').style.display = 'none';

  }, (xhr) => {
    console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
  }, (error) => {
    console.error(error);
    document.getElementById('progress-container').style.display = 'none';
  });
}

function changeModel(modelNumber) {
  const modelPath = `${modelNumber}.glb`;
  currentUrl = modelNumber;
  console.log(currentUrl);
  loadModel(modelPath);
  return currentUrl;
}

function closeNav() {
  document.getElementById("Container_Menu").style.width = "0%";
}

// Set up button listeners to change the model
document.getElementById('Onion_Ring').addEventListener('click', () => {
  changeModel('Onionring');
  closeNav();
});
document.getElementById('Salad').addEventListener('click', () => {
  changeModel('Salad');
  closeNav();
});
document.getElementById('Hamburger').addEventListener('click', () => {
  changeModel('Hamburger');
  closeNav();
});
document.getElementById('Truffle_Soup').addEventListener('click', () => {
  changeModel('TruffleSoup');
  closeNav();
});
document.getElementById('Pork_rib').addEventListener('click', () => {
  changeModel('BBQRibs');
  closeNav();
});
document.getElementById('Rice_teriyaki').addEventListener('click', () => {
  changeModel('KoreaChicken_Final');
  closeNav();
});
document.getElementById('French_fried').addEventListener('click', () => {
  changeModel('FrenchFried_Final');
  closeNav();
});
document.getElementById('Corn_ribs').addEventListener('click', () => {
  changeModel('Corn_Final');
  closeNav();
});
document.getElementById('Tomato_sauce_fried_rice').addEventListener('click', () => {
  changeModel('AmericanFriedRice_Final');
  closeNav();
});
document.getElementById('Truffle_pasta').addEventListener('click', () => {
  changeModel('Penne_Final');
  closeNav();
});

// Set up button listeners for the navbar
document.getElementById('OnionRing_navbar').addEventListener('click', () => {
  changeModel('Onionring');
});
document.getElementById('Salad_navbar').addEventListener('click', () => {
  changeModel('Salad');
});
document.getElementById('Hamburger_navbar').addEventListener('click', () => {
  changeModel('Hamburger');
});
document.getElementById('TruffleSoup_navbar').addEventListener('click', () => {
  changeModel('TruffleSoup');
});
document.getElementById('Porkrib_navbar').addEventListener('click', () => {
  changeModel('BBQRibs');
});
document.getElementById('Riceteriyaki_navbar').addEventListener('click', () => {
  changeModel('KoreaChicken_Final');
});
document.getElementById('Frenchfried_navbar').addEventListener('click', () => {
  changeModel('FrenchFried_Final');
});
document.getElementById('Cornribs_navbar').addEventListener('click', () => {
  changeModel('Corn_Final');
});
document.getElementById('Tomatosaucefriedrice_navbar').addEventListener('click', () => {
  changeModel('AmericanFriedRice_Final');
});
document.getElementById('Trufflepasta_navbar').addEventListener('click', () => {
  changeModel('Penne_Final');
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Load initial model
//loadModel('Onionring',0.7);
changeModel('Onionring');
