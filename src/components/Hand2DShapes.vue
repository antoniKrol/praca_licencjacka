<template>
  <div>
    <VCol>
      <VRow class="mx-2 mt-4">
        <VCard class="me-1 pa-1" color="grey-100">
          <canvas id="drawing" ref="canvas"></canvas>
        </VCard>
        <VCard color="primary" class="pa-1">
          <div class="content-container">
            <video class="input_video" ref="videoElement" playsinline></video>
          </div>
        </VCard>
      </VRow>

      <VContainer fluid class="d-flex justify-center align-center">
        <VIcon
          class="mt-5"
          size="36"
          :icon="currentIcon"
          :color="currentColor" />
        <br />
        <p id="coord" ref="coordElement"></p>
      </VContainer>
      <VContainer fluid>
        <VRow class="d-flex justify-center align-center">
          <VBtn @click="clearCanvas">Wyczyść płótno</VBtn>
        </VRow>
      </VContainer>
    </VCol>
  </div>
</template>

<script>
// Import necessary dependencies and components
import { Point } from "../../lib/point";
import { Camera } from "@mediapipe/camera_utils";
import { Hands } from "@mediapipe/hands";
import { arePointsTouching, mergeClosePoints } from "@/utils/utils";

export default {
  name: "Hand2DShapes",
  data() {
    return {
      pointsArray: [],
      currentIcon: "mdi-thumb-down",
      currentColor: "red",
    };
  },
  methods: {
    drawShape(points, ctx) {
      if (points.length < 3) return;

      ctx.beginPath();
      const startX = (1 - points[0].x) * ctx.canvas.width;
      const startY = points[0].y * ctx.canvas.height;
      ctx.moveTo(startX, startY);

      for (let i = 1; i < points.length; i++) {
        const x = (1 - points[i].x) * ctx.canvas.width;
        const y = points[i].y * ctx.canvas.height;
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fill();
      ctx.strokeStyle = "red";
      ctx.stroke();
    },
    clearCanvas() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.pointsArray = [];
    },
  },
  mounted() {
    const width = 650;
    const height = 400;
    let isPointAdded = false;

    // Get the canvas element
    const canvas = this.$refs.canvas;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Get the video element
    const videoElement = this.$refs.videoElement;

    const onResults = (results) => {
      if (results.multiHandLandmarks.length > 0) {
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

        if (!isPointAdded && arePointsTouching(p1, p2)) {
          this.pointsArray = mergeClosePoints(this.pointsArray, p1, 0.02);
          isPointAdded = true;
        } else if (!arePointsTouching(p1, p2)) {
          this.currentIcon = "mdi-thumb-up";
          this.currentColor = "green";
          isPointAdded = false;
          if (this.pointsArray.length >= 3) {
            drawShape(this.pointsArray, ctx);
          }
        } else {
          this.currentIcon = "mdi-thumb-down";
          this.currentColor = "red";
        }
      } else {
        this.currentIcon = "mdi-thumb-down";
        this.currentColor = "red";
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

    // Function to draw the shape on the canvas
    function drawShape(points, ctx) {
      if (points.length < 3) return;

      ctx.beginPath();
      const startX = (1 - points[0].x) * ctx.canvas.width;
      const startY = points[0].y * ctx.canvas.height;
      ctx.moveTo(startX, startY);

      for (let i = 1; i < points.length; i++) {
        const x = (1 - points[i].x) * ctx.canvas.width;
        const y = points[i].y * ctx.canvas.height;
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fill();
      ctx.strokeStyle = "red";
      ctx.stroke();
    }
  },
};
</script>

<style scoped>
.input_video {
  transform: scaleX(-1);
}
</style>
