import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'


const gui = new dat.GUI()

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene() 

const textureLoader = new THREE.TextureLoader()

//ini gltf loader
const gltfLoader = new GLTFLoader()

let mixer = null

gltfLoader.load('AJ_BLACK_walking_macos_emb_1.gltf',
(gltf) => {
    
    gltf.scene.scale.set(.25,.25,.25)
    
    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[2])
   
    camera.lookAt(gltfLoader)
    action.play()
    scene.add(gltf.scene)

    console.log(gltf)

 
})


// if ( child.isMesh && child.name == "AJ_BLACK_walking1_2.gltf" ) {
// 	//use customized MeshStandardMaterial for this mesh
// 	let tempMaterial = new THREE.MeshStandardMaterial({ map: texture[0], normalMap: texture[1] });
// 	child.material = tempMaterial;
// }



const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10,10),
    new THREE.MeshStandardMaterial({
        color: 'white',

    })
)
floor.rotation.x = - Math.PI * .5
scene.add(floor)
//box
// const geometry = new THREE.BoxGeometry(1,1,1)
// const material = new THREE.MeshBasicMaterial({color: 'red'})
// const mesh = new THREE.Mesh(geometry, material )
// scene.add(mesh)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff , 0.6)
directionalLight.position.set(5, 5, 5)

scene.add(directionalLight)
const sizes = { 
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{

    //update sizes 
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()


    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.win(window.devicePixelRatio, 2))

})


//camera 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(5,5,5)
scene.add(camera)


//controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true
controls.autoRotate = true

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0xFFFFFF);

 
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => 
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if(mixer !== null){
        mixer.update(deltaTime)
    }

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()