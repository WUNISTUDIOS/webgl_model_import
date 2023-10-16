import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'



const gltfLoader = new GLTFLoader()

const cubeTextureLoader = new THREE.CubeTextureLoader()

const textureloader = new THREE.TextureLoader()

// const rgbeloader = new RGBELoader()
// const exrloader = new EXRLoader()


/**
 * Base
 */ 
// Debug
const gui = new dat.GUI()
const global = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh && child.material.isMeshStandardMaterial)
        {
            child.material.envMapIntensity = global.envMapIntensity
        }
    })
}

/**
 * environment map
 */
//LOW DYNAMIC RANGE TEXTURE
scene.backgroundBlurriness = .1
scene.backgroundIntensity = 1


gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(.001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(.001)

global.envMapIntensity = 1

gui
    .add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials)

// const environmentMap = cubeTextureLoader.load([
//     'environmentMaps/0/px.png',
//     'environmentMaps/0/nx.png',
//     'environmentMaps/0/py.png',
//     'environmentMaps/0/ny.png',
//     'environmentMaps/0/pz.png',
//     'environmentMaps/0/nz.png'
// ])

// scene.environment = environmentMap

// scene.background = environmentMap

//hdr (rgbe) loader

// rgbeloader.load('/environmentMaps/0/2k.hdr', (environmentMap) =>
// {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping
//     console.log(environmentMap)
//     scene.background = environmentMap
//     scene.environment = environmentMap
// })


const environmentMap = textureloader.load('/environmentMaps/blockadesLabsSkybox/digital_painting_neon_city_night_orange_lights_.jpg')
environmentMap.mapping = THREE.EquirectangularReflectionMapping

scene.background = environmentMap
scene.environment = environmentMap
environmentMap.ColorSpace = THREE.SRGBColorSpace
/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({roughness: .3, metalness: 1, color: 0xaaaaaa})
)

// torusKnot.material.envMap = environmentMap

torusKnot.position.x = - 4
torusKnot.position.y = 4

scene.add(torusKnot)

gltfLoader.load ('/models/FlightHelmet/glTF/FlightHelmet.gltf', 
(gltf) => 
{
    scene.add(gltf.scene)
    gltf.scene.scale.set(10,10,10)

    updateAllMaterials()
    // gltf.scene.add(gltf)
}
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()