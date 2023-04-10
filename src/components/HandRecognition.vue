<template>
  <VCol>
    <VRow class="mx-2 mt-4">
      <VCard class="me-1 pa-1" color="primary">
        <div ref="rendererContainer" />
      </VCard>
      <VCard color="primary" class="pa-1">
        <div class="content-container">
          <video class="input_video" ref="videoElement" playsinline></video>
          <canvas id="drawing" ref="canvas"></canvas>
        </div>
      </VCard>
    </VRow>

    <VContainer fluid class="d-flex justify-center align-center">
      <VIcon class="mt-5" size="36" :icon="currentIcon" :color="currentColor" />
      <br />
      <p id="coord" ref="coordElement"></p>
    </VContainer>
  </VCol>
</template>

<script>
import { Point } from "../../lib/point";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Camera } from "@mediapipe/camera_utils";
import { Hands } from "@mediapipe/hands";
import { ConvexGeometry } from "three-stdlib";

import {
  arePointsTouching,
  mergeClosePoints,
} from "@/utils/utils";
export default {
  name: "HandRecognition",
  data() {
    return {
      currentIcon: "mdi-thumb-down",
      currentColor: "red",
    };
  },
  mounted() {
    const width = 700;
    const height = 400;
    let isCameraLooking = false;
    const clearCanvas = () => {
      if (scene && mesh) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh = null;
      }
    };
    const addShape = (camera) => {
      clearCanvas();
      const scale = 150;
      const points = pointsArray.map(
        (point) =>
          new THREE.Vector3(
            point.x * scale,
            point.y * scale,
            Math.abs(point.z * scale * 10)
          )
      );

      const geometry = new ConvexGeometry(points);

      const material = new THREE.MeshPhongMaterial({
        color: 0x2E3D59,
        side: THREE.DoubleSide,
      });

      mesh = new THREE.Mesh(geometry, material);
      if (!isCameraLooking) {
        // Calculate the center of the input points
        const center = new THREE.Vector3(0, 0, 0);
        pointsArray.forEach((point) => center.add(point));
        center.divideScalar(pointsArray.length);

        // Update camera position and target
        camera.position.set(center.x, center.y, center.z + 100);

        camera.lookAt(center);
        isCameraLooking = true;
      }
      scene.add(mesh);
    };


    let shapeAdded = false;
    // Pobierz element <video> o klasie "input_video"
    const videoElement = this.$refs.videoElement;

    // Tablica do przechowywania punktów
    let pointsArray = [];

    // Zmienna do przechowywania aktualnego indeksu w tablicy temp
    //let i = -1;
    let isPointAdded = false;



    //Funkcja wywoływana przy każdym nowym wyniku rozpoznawania dłoni
    //d = ((x2 - x1)2 + (y2 - y1)2 + (z2 - z1)2)1/2
    const onResults = (results) => {
      // Jeśli została znaleziona co najmniej jedna dłoń
      if (results.multiHandLandmarks.length > 0) {
        // Stwórz nowe obiekty Point dla dwóch punktów: palca wskazującego i kciuka
        let p1 = new Point(
          results.multiHandLandmarks[0][8].x,
          results.multiHandLandmarks[0][8].y,
          results.multiHandLandmarks[0][8].z
        );
        let p2 = new Point(
          results.multiHandLandmarks[0][4].x,
          results.multiHandLandmarks[0][4].y,
          results.multiHandLandmarks[0][4].z
        );
        if (pointsArray.length >= 3 && !shapeAdded) {
          addShape(cameraT);
          //shapeAdded=true;
        }
        if (!isPointAdded && arePointsTouching(p1, p2)) {
          pointsArray = mergeClosePoints(pointsArray, p1, 0.02);
          isPointAdded = true;
        } else if (!arePointsTouching(p1, p2)) {
          this.$refs.coordElement.innerHTML = pointsArray.length;
          this.currentIcon = "mdi-thumb-up";
          this.currentColor = "green";
          isPointAdded = false;
          if (pointsArray.length >= 3) {
            //draw(pointsArray);
          }
        } else {
          this.$refs.coordElement.innerHTML =
            "Geting coordinates from your hands";
        }
      } else {
        this.currentIcon = "mdi-thumb-down";
        this.currentColor = "red";
      }
    };
    // Stwórz nowy obiekt Hands z użyciem biblioteki @mediapipe/hands
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    // Ustaw opcje dla obiektu Hands
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: width,
      height: height,
    });
    camera.start();

    // Załaduj bibliotekę Three.js
    var scene, cameraT, renderer, mesh;
    var controls;
    const canvas = this.$refs.canvas;
    canvas.width = width;
    canvas.height = height;
    // Utwórz scenę
    scene = new THREE.Scene();
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xAAAAAA, side: THREE.DoubleSide });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -100; // You can adjust this value to position the ground accordingly
    plane.rotation.x = Math.PI / 2;

    scene.add(plane);

    // Create ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Create spot light
    const spotLight = new THREE.SpotLight(0xffffff, 0.5, 0, Math.PI / 3);
    spotLight.position.set(1, 600, 40)
    scene.add(spotLight);



    // Utwórz kamerę
    cameraT = new THREE.PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      1,
      2000
    );
    cameraT.position.z = 5;

    // Utwórz renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor(0xB8B8BF);
    this.$refs.rendererContainer.appendChild(renderer.domElement);

    // Utwórz kontrolery orbity
    controls = new OrbitControls(cameraT, renderer.domElement);

    // Funkcja aktualizująca
    var render = function () {
      requestAnimationFrame(render);

      controls.update();
      renderer.render(scene, cameraT);
    };

    // Rozpocznij renderowanie
    render();
  },
};
</script>

<style scoped>
.input_video {
  transform: scaleX(-1);
  /* This will flip the video horizontally */
}
</style>
