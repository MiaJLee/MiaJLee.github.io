import * as THREE from 'three'
import { OrbitControls } from 'jsm/controls/OrbitControls.js'
import { drawThreeGeo } from '../src/components/threeGeoJSON.js'

const w = window.innerWidth
const h = window.innerHeight
const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0xffffff, 0.3)
const camera = new THREE.PerspectiveCamera(75, w / h, 1, 100)
camera.position.z = 4
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(w, h)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

camera.position.set(-0.041, 2, 4)
controls.update()

controls.autoRotate = true
controls.autoRotateSpeed = 0.5

const geometry = new THREE.SphereGeometry(2)
const lineMat = new THREE.LineBasicMaterial({
	color: 0x000000,
	transparent: true,
	opacity: 0.4,
})
const edges = new THREE.EdgesGeometry(geometry, 1)
const line = new THREE.LineSegments(edges, lineMat)
scene.add(line)

// line.rotateX(100)

// 특정 위치에 마커 추가
const radius = 2
const latitude = 20 // 위도
const longitude = 279 // 경도
const phi = (90 - latitude) * (Math.PI / 180)
const theta = (longitude + 180) * (Math.PI / 180)

const x = radius * Math.sin(phi) * Math.cos(theta)
const y = radius * Math.cos(phi)
const z = radius * Math.sin(phi) * Math.sin(theta)

const marker = new THREE.Mesh(
	new THREE.SphereGeometry(0.03, 16, 16),
	new THREE.MeshBasicMaterial({ color: 0xff00ff })
)
marker.position.set(x, y, z)
scene.add(marker)

scene.background = new THREE.Color(0xffffff)

// check here for more datasets ...
// https://github.com/martynafford/natural-earth-geojson
// non-geojson datasets: https://www.naturalearthdata.com/downloads/
fetch('./content/countries.json')
	.then((response) => response.text())
	.then((text) => {
		const data = JSON.parse(text)
		const countries = drawThreeGeo({
			json: data,
			radius: 2,
			materialOptions: {
				color: 0x80ff80,
			},
		})
		scene.add(countries)
	})

function animate() {
	requestAnimationFrame(animate)
	renderer.render(scene, camera)
	controls.update()
}

animate()

function handleWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', handleWindowResize, false)
