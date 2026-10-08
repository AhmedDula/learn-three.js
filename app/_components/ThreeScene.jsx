"use client";
import gsap from "gsap";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls, plane } from "three/examples/jsm/Addons.js";
export default function ThreeScene() {
  const containerRef = useRef();
  useEffect(() => {
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);
    const container = containerRef.current;
    if (!container) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.shadowMap.enabled = true
    // -----------
    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0,4,10);

    // -----------
    // Resize
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
    // -----------

    // Loading Manager
    const loadingManager = new THREE.LoadingManager();

    // gsap
    loadingManager.onProgress = (i, loaded, total) => {
      console.log(loaded, total);
      gsap.to(".progress", {
        width: `${(loaded / total) * 100}%`,
        duration: 0.3,
        ease: "none",
        overwrite: true,
      });
    };
    loadingManager.onLoad = (i, loaded, total) => {
      console.log("loaded");
      
      gsap.to(".loader", {
        autoAlpha:0,
        duration: 1.2,
        ease: "none",
        overwrite: true,
      });
    };
    //
    // ----------
    // Loader
    const TextureLoader = new THREE.TextureLoader(loadingManager);
    const disp = TextureLoader.load(
      "texture/river/dry_river_pebbles_disp_4k.jpg",
    );
    const ao = TextureLoader.load("texture/river/dry_river_pebbles_ao_4k.jpg");
    const diff = TextureLoader.load(
      "texture/river/dry_river_pebbles_diff_4k.jpg",
    );
    const normal = TextureLoader.load(
      "texture/river/dry_river_pebbles_nor_gl_4k.jpg",
    );
    const rough = TextureLoader.load(
      "texture/river/dry_river_pebbles_rough_4k.jpg",
    );
    diff.colorSpace = THREE.SRGBColorSpace;
    // Material
    const material = new THREE.MeshPhysicalMaterial({
      map: diff,
      normalMap: normal,
      roughnessMap: rough,
      aoMap: ao,
      displacementMap: disp,
      displacementScale: 0.04,
    });
    // -----------

    // Shapes
    const geometrySphere = new THREE.SphereGeometry(1, 32, 32);
    const sphere = new THREE.Mesh(geometrySphere, material);
    sphere.position.x = 2;

    const geometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
    const cube = new THREE.Mesh(geometry, material);
cube.castShadow =true
    const geometryWall = new THREE.BoxGeometry(2, 2, 0.2, 64, 64, 10);
    const wall = new THREE.Mesh(geometryWall, material);
    wall.position.set(-3,0,0)
    const geometryPlane = new THREE.BoxGeometry(10, 0.2, 10, 64, 64, 10);
    const plane = new THREE.Mesh(geometryPlane, material);
    plane.position.y = -1.2;
    plane.receiveShadow =true
    // -----------
    // Lights
    // --- spotlight ----
    const spotLight = new THREE.SpotLight(0xfffff0,700,20,Math.PI / 5,10 )
    spotLight.position.set(0,8,-5)
   
    spotLight.castShadow = true
    spotLight.shadow.camera.far=20
    const helper = new THREE.SpotLightHelper(spotLight)
    const helperCM = new THREE.CameraHelper( spotLight.shadow.camera );
    scene.add(helper,helperCM)


    // ---- directionalLight ----
    // const directlight = new THREE.DirectionalLight(0xffffff, 10);
    // directlight.position.set(2, 7, 2);

   // ambiant light
  //  const ambiantLight = new THREE.AmbientLight(0xfffff0,50)
  
  // pointLight 
  // const pointLight = new THREE.PointLight(0xfffff0,10,5)
  // pointLight.position.set(0,2,0)

  // HemisphereLight
  //  const hemiLight  = new THREE.HemisphereLight(0xffff00 , 0xff00ff,10)

  // rectArea Light
  // const rectLight = new THREE.RectAreaLight( 0xffffff,10,10,30)
  // rectLight.position.set(0,10,10)
  // rectLight.lookAt(cube.position)

    // -----------

    scene.add(spotLight);
    scene.add(sphere,cube,wall,plane);
    

    const controls = new OrbitControls(camera, renderer.domElement);
   
    controls.autoRotateSpeed = 5;

    // frame Requiest
    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);

      if (resizeRendererToDisplaySize()) {
        camera.aspect = container.clientWidth / container.clientHeight;

        camera.updateProjectionMatrix();
      }

      controls.update();
      renderer.render(scene, camera);
    }

    animate();
    return () => {
      cancelAnimationFrame(animationId);

      controls.dispose();
      renderer.dispose();

      geometrySphere.dispose();
      geometry.dispose();
      geometryPlane.dispose();

      material.dispose();

      container.removeChild(renderer.domElement);
    };
  }, []);
  return (
    <main className="w-screen overflow-hidden">
      <div className="loader w-full h-screen fixed  inset-0 bg-amber-100">
        {" "}
        <div className="mx-auto my-[30%] w-fit h-fit">
          <p className=" w-fit h-fit "> Loading...</p>
          <span className="progress block h-2 w-0 bg-amber-800 rounded-2xl"></span>
        </div>
      </div>
      <div className="w-screen h-screen  " ref={containerRef} />
    </main>
  );
}
