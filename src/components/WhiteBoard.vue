<template>
  <VCol>
    <VRow class="mt-4">
      <VCard color="secondary" class="ms-1 pa-1">
        <div class="content-container">
          <video class="input_video" ref="videoElement" playsinline></video>
        </div>
      </VCard>

      <VCard color="white" class="pa-1 ms-1">
        <canvas ref="crosshairCanvas" style="position: absolute" />
        <canvas ref="drawingCanvas" />
        <VCardItem
          ><ColorPalette
            :colors="['black', 'red', 'green', 'blue', 'yellow', 'purple']"
            @color-selected="changeColor"
        /></VCardItem>
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
        <h4>Rozpoznany tekst:</h4>
        <p>{{ recognizedText }}</p>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { arePointsTouching } from "@/utils/utils";
import { Camera } from "@mediapipe/camera_utils";
import { Hands } from "@mediapipe/hands";
import * as Tesseract from "tesseract.js";
import ColorPalette from "./ColorPalette.vue";

export default {
  name: "WhiteBoard",
  components: {
    ColorPalette,
  },
  data() {
    return {
      currentIcon: "mdi-thumb-down",
      currentColor: "red",
      recognizedText: "",
    };
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
        const result = await Tesseract.recognize(drawingCanvas, "pol", {});

        this.recognizedText = result.data.text;
      } catch (error) {
        console.error("Error recognizing text: ", error);
      }
    },
    changeColor(color) {
      const drawingCanvas = this.$refs.drawingCanvas;
      const ctx = drawingCanvas.getContext("2d");
      ctx.strokeStyle = color;
    },
  },
  mounted() {
    const width = 700;
    const height = 400;

    const videoElement = this.$refs.videoElement;
    const drawingCanvas = this.$refs.drawingCanvas;
    drawingCanvas.width = width;
    drawingCanvas.height = height;

    const crosshairCanvas = this.$refs.crosshairCanvas;
    crosshairCanvas.width = width;
    crosshairCanvas.height = height;

    const crosshairCtx = crosshairCanvas.getContext("2d");
    crosshairCtx.scale(-1, 1);
    crosshairCtx.translate(-width, 0);

    const ctx = drawingCanvas.getContext("2d");
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";

    ctx.scale(-1, 1);
    ctx.translate(-width, 0);

    let drawing = false;

    const onResults = (results) => {
      // Clear previous crosshair
      crosshairCtx.clearRect(
        0,
        0,
        crosshairCanvas.width,
        crosshairCanvas.height
      );

      if (results.multiHandLandmarks.length > 0) {
        let p1 = results.multiHandLandmarks[0][8];
        let p2 = results.multiHandLandmarks[0][4];

        // Draw crosshair at the tip of the pointing finger only if not drawing
        const crosshairSize = 5;
        const x = p1.x * width;
        const y = p1.y * height;

        if (!arePointsTouching(p1, p2)) {
          crosshairCtx.beginPath();
          crosshairCtx.moveTo(x - crosshairSize, y);
          crosshairCtx.lineTo(x + crosshairSize, y);
          crosshairCtx.moveTo(x, y - crosshairSize);
          crosshairCtx.lineTo(x, y + crosshairSize);
          crosshairCtx.strokeStyle = "red";
          crosshairCtx.lineWidth = 1;
          crosshairCtx.stroke();
        }

        if (arePointsTouching(p1, p2)) {
          this.currentIcon = "mdi-thumb-up";
          this.currentColor = "green";
          //
          if (!drawing) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.currentX = x;
            ctx.currentY = y;
            drawing = true;
          } else {
            const prevX = ctx.currentX;
            const prevY = ctx.currentY;
            const newX = x;
            const newY = y;
            const midX = (prevX + newX) / 2;
            const midY = (prevY + newY) / 2;

            ctx.quadraticCurveTo(prevX, prevY, midX, midY);
            ctx.stroke();

            ctx.currentX = newX;
            ctx.currentY = newY;
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
};
</script>

<style scoped>
.input_video {
  transform: scaleX(-1);
}
</style>
