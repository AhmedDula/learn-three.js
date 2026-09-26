"use client";
import gsap from "gsap";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
export default function ThreeScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  const containerRef = useRef();
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    function resizeRendererToDisplaySize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const needResize =
        renderer.domElement.width !== width ||
        renderer.domElement.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
    camera.position.z = 5;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: "blue" });
    const cube = new THREE.Mesh(geometry, material);
    const geometryPlane = new THREE.BoxGeometry(2,2,0.2)
    const materialPlane= new THREE.MeshNormalMaterial({color:"red"})
    const Plane = new THREE.Mesh(geometryPlane,materialPlane)
    Plane.position.set(0,0,.1)
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-4, -5, 2);
scene.add(Plane)
scene.add(cube);

scene.add(light);

const controls = new OrbitControls(camera,renderer.domElement)
controls.autoRotate = true
controls.autoRotateSpeed =5
    function animate() {
      requestAnimationFrame(animate);
      if (resizeRendererToDisplaySize()) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
      controls.update()
    }
    
    animate();
    return () => container.removeChild(renderer.domElement);
  }, []);
  return <div className="w-screen h-screen" ref={containerRef}></div>;
}
