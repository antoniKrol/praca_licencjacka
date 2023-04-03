<template>
    <div class="container">
        <div ref="rendererContainer"></div>
        <div class="content-container">
            <video class="input_video" ref="videoElement" playsinline></video>
            <canvas id="drawing" ref="canvas"></canvas>
        </div>
    </div>
    <p id="coord" ref="coordElement"></p>
</template>

<script>
import { Point } from "../../lib/point";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Camera } from "@mediapipe/camera_utils";
import { Hands } from "@mediapipe/hands";
import { ConvexHull } from "three-stdlib";

export default {
    name: "HandRecognition",
    mounted() {
        const width = 700;
        const height = 400;
        //s
        const addShape = (camera) => {
            const scale = 100; // Increase the scale if needed
            const points = pointsArray.map(
                (point) =>
                    new THREE.Vector3(
                        point.x * scale,
                        point.y * scale,
                        Math.abs(point.z * scale * 10)
                    )
            );

            // Debug: Print the input points array
            //console.log("Input points:", points);

            const convexHull = new ConvexHull().setFromPoints(points);

            // Create geometry from the convex hull
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            const faces = convexHull.faces;

            faces.forEach((face) => {
                const a = face.edge.next.vertex.point;
                const b = face.edge.prev.vertex.point;
                const c = face.edge.vertex.point;
                vertices.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
            });

            geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(new Float32Array(vertices), 3)
            );

            const material = new THREE.MeshBasicMaterial({
                color: 0x00ffee,
                side: THREE.DoubleSide,
            });

            mesh = new THREE.Mesh(geometry, material);
            // Calculate the center of the input points
            const center = new THREE.Vector3(0, 0, 0);
            pointsArray.forEach((point) => center.add(point));
            center.divideScalar(pointsArray.length);

            // Update camera position and target
            camera.position.set(center.x, center.y, center.z + 100);
            camera.lookAt(center);

            scene.add(mesh);

            // Debug: Print the convex hull points
            console.log("Convex hull points:", convexHull);
        };

        let shapeAdded = false;
        // Pobierz element <video> o klasie "input_video"
        const videoElement = this.$refs.videoElement;

        // Pobierz element <canvas> o klasie "output_canvas"
        //const canvasElement = document.getElementsByClassName("output_canvas")[0];

        //Klasa przechowujaca wierzchloki bryły stworzonej przez uzytkownika

        // Funkcja sprawdzająca, czy odległość między punktami p1 i p2 jest na tyle mała, że można ją interpretować jako stykanie palców
        function arePointsTouching(p1, p2) {
            // Jeśli odległość między punktami jest mniejsza niż 0.05, zwróć true, w przeciwnym razie zwróć false
            if (getDistance(p1, p2) < 0.05) {
                return true;
            } else {
                return false;
            }
        }

        // Funkcja zwracająca odległość między punktami p1 i p2 w przestrzeni 3D
        function getDistance(p1, p2) {
            // Oblicz odległość między punktami za pomocą wzoru na odległość w przestrzeni 3D
            const distance = Math.sqrt(
                Math.pow(p2.x - p1.x, 2) +
                Math.pow(p2.y - p1.y, 2) +
                Math.pow(p2.z - p1.z, 2)
            );
            return distance;
        }

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
                    pointsArray.push(p1);
                    isPointAdded = true;
                } else if (!arePointsTouching(p1, p2)) {
                    this.$refs.coordElement.innerHTML = pointsArray.length;
                    this.$el.ownerDocument.body.style.backgroundColor = 'green';

                    isPointAdded = false;
                    if (pointsArray.length >= 3) {
                        //draw(pointsArray);
                    }
                } else {
                    this.$refs.coordElement.innerHTML =
                        "Geting coordinates from your hands";
                }
            } else {
                this.$el.ownerDocument.body.style.backgroundColor = 'red';

            }
        }
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
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
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
        // Add an ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Add a directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Add a point light
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(0, 0, 5);
        scene.add(pointLight);
        // Utwórz kamerę
        cameraT = new THREE.PerspectiveCamera(
            775,
            canvas.width / canvas.height,
            0.1,
            1000
        );
        cameraT.position.z = 5;

        // Utwórz renderer
        renderer = new THREE.WebGLRenderer({ canvas: canvas });
        renderer.setSize(canvas.width, canvas.height);
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
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.content-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.renderer-container {
    width: 700px;
    height: 400px;
}

.input_video,
#drawing {
    width: 700px;
    height: 400px;
    object-fit: cover;
}

.input_video {
    transform: scaleX(-1);
    /* This will flip the video horizontally */
}
</style>
