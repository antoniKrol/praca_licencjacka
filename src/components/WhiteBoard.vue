<template>
    <VCol>
        <VRow class="mx-2 mt-4">
            <VCard color="primary" class="pa-1">
                <div class="content-container">
                    <video class="input_video" ref="videoElement" playsinline></video>
                </div>
            </VCard>
            <VCard color="white" class="pa-1 ms-1">
                <canvas ref="drawingCanvas" />
            </VCard>
        </VRow>

        <VContainer fluid class="d-flex justify-center align-center">
            <VIcon class="mt-5" size="36" :icon="currentIcon" :color="currentColor" />
            <br />
            <p id="coord" ref="coordElement"></p>
        </VContainer>
    </VCol>
    <VContainer fluid>
        <VRow class="d-flex justify-center align-center">
            <VBtn @click="clearCanvas">Wyczyść tablicę</VBtn>
            <VBtn @click="recognizeText" class="ms-1">Rozpoznaj tekst</VBtn>
        </VRow>
    </VContainer>
    <VContainer fluid>
        <VRow class="d-flex justify-center align-center">
            <VCol>
                <h4>Rozpoznany text:</h4>
                <p>{{ recognizedText }}</p>
            </VCol>
        </VRow>
    </VContainer>
</template>
  
<script>
import { arePointsTouching } from '@/utils/utils';
import { Camera } from "@mediapipe/camera_utils";
import { Hands } from "@mediapipe/hands";
import * as Tesseract from "tesseract.js";


export default {
    name: "WhiteBoard",
    data() {
        return {
            currentIcon: "mdi-thumb-down",
            currentColor: "red",
            recognizedText: "",
        };
    },
    mounted() {
        const width = 700;
        const height = 400;

        const videoElement = this.$refs.videoElement;
        const drawingCanvas = this.$refs.drawingCanvas;
        drawingCanvas.width = width;
        drawingCanvas.height = height;

        const ctx = drawingCanvas.getContext("2d");
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";

        ctx.scale(-1, 1);
        ctx.translate(-width, 0);

        let drawing = false;

        const onResults = (results) => {
            if (results.multiHandLandmarks.length > 0) {
                let p1 = results.multiHandLandmarks[0][8];
                let p2 = results.multiHandLandmarks[0][4];

                if (arePointsTouching(p1, p2)) {
                    this.currentIcon = "mdi-thumb-up";
                    this.currentColor = "green";

                    if (!drawing) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x * width, p1.y * height);
                        drawing = true;
                    } else {
                        ctx.lineTo(p1.x * width, p1.y * height);
                        ctx.stroke();
                    }
                } else {
                    this.currentIcon = "mdi-thumb-down";
                    this.currentColor = "red";
                    drawing = false;
                }
            } else {
                this.currentIcon = "mdi-thumb-down";
                this.currentColor = "red";
                drawing = false;
            }
        };

        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            },
        });

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
    },
    methods: {
        clearCanvas() {
            const drawingCanvas = this.$refs.drawingCanvas;
            const ctx = drawingCanvas.getContext("2d");
            ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        },
        async recognizeText() {
            const drawingCanvas = this.$refs.drawingCanvas;
            try {
                const result = await Tesseract.recognize(drawingCanvas, "pol", {
                });

                this.recognizedText = result.data.text;

            } catch (error) {
                console.error("Error recognizing text: ", error);
            }
        },
    }
};
</script>

<style scoped>
.input_video {
    transform: scaleX(-1);
}
</style>
