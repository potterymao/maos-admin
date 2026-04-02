import { useDesignStore } from "~/stores/useDesignStore";
import type { ResizeData, RotateData } from "~~/types";
import interact from "interactjs";

export function usePlateDesigner() {
  const designStore = useDesignStore();

  const resizeData = ref<ResizeData | null>(null);
  const rotateData = ref<RotateData | null>(null);
  const isDragging = ref(false);
  const dragOffset = ref({ x: 0, y: 0 });

  const startDrag = (patternIndex: number, event: MouseEvent | TouchEvent) => {
    designStore.selectPattern(patternIndex);
    isDragging.value = true;

    const pattern = designStore.patterns[patternIndex];
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    let clientX: number, clientY: number;

    if ("touches" in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    dragOffset.value = {
      x: clientX - rect.left - pattern.x,
      y: clientY - rect.top - pattern.y,
    };

    document.addEventListener("mousemove", doDrag as EventListener);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", doDrag as EventListener, { passive: false });
    document.addEventListener("touchend", stopDrag);

    if ("touches" in event) {
      event.preventDefault();
    }
  };

  const doDrag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value || designStore.selectedPatternIndex === null) return;

    const plateContainer = document.querySelector(".plate-container");
    if (!plateContainer) return;

    const rect = plateContainer.getBoundingClientRect();
    const pattern = designStore.patterns[designStore.selectedPatternIndex];

    let clientX: number, clientY: number;

    if ("touches" in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
      event.preventDefault();
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    let newX = clientX - rect.left - dragOffset.value.x;
    let newY = clientY - rect.top - dragOffset.value.y;

    const maxX = 500 - pattern.width;
    const maxY = 500 - pattern.height;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    designStore.updatePatternPosition(designStore.selectedPatternIndex, newX, newY);
  };

  const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", doDrag as EventListener);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", doDrag as EventListener);
    document.removeEventListener("touchend", stopDrag);
  };

  const startResize = (patternIndex: number, event: MouseEvent, direction: ResizeData["direction"]) => {
    designStore.selectPattern(patternIndex);

    const pattern = designStore.patterns[patternIndex];
    resizeData.value = {
      patternIndex,
      direction,
      startWidth: pattern.width,
      startHeight: pattern.height,
      startX: pattern.x,
      startY: pattern.y,
      clientX: event.clientX,
      clientY: event.clientY,
    };

    document.addEventListener("mousemove", doResize);
    document.addEventListener("mouseup", stopResize);
  };

  const doResize = (event: MouseEvent) => {
    if (!resizeData.value) return;

    const pattern = designStore.patterns[resizeData.value.patternIndex];
    const start = resizeData.value;

    const deltaX = event.clientX - start.clientX;
    const deltaY = event.clientY - start.clientY;

    const minSize = 20;
    const maxSize = 300;

    let newWidth = start.startWidth;
    let newHeight = start.startHeight;
    let newX = start.startX;
    let newY = start.startY;

    switch (start.direction) {
      case "bottom-right":
        newWidth = Math.max(minSize, Math.min(maxSize, start.startWidth + deltaX));
        newHeight = Math.max(minSize, Math.min(maxSize, start.startHeight + deltaY));
        break;
      case "bottom-left":
        newWidth = Math.max(minSize, Math.min(maxSize, start.startWidth - deltaX));
        newHeight = Math.max(minSize, Math.min(maxSize, start.startHeight + deltaY));
        newX = start.startX + deltaX;
        break;
      case "top-right":
        newWidth = Math.max(minSize, Math.min(maxSize, start.startWidth + deltaX));
        newHeight = Math.max(minSize, Math.min(maxSize, start.startHeight - deltaY));
        newY = start.startY + deltaY;
        break;
      case "top-left":
        newWidth = Math.max(minSize, Math.min(maxSize, start.startWidth - deltaX));
        newHeight = Math.max(minSize, Math.min(maxSize, start.startHeight - deltaY));
        newX = start.startX + deltaX;
        newY = start.startY + deltaY;
        break;
    }

    if (newX < 0) {
      newWidth += newX;
      newX = 0;
    }
    if (newY < 0) {
      newHeight += newY;
      newY = 0;
    }
    if (newX + newWidth > 500) {
      newWidth = 500 - newX;
    }
    if (newY + newHeight > 500) {
      newHeight = 500 - newY;
    }

    if (newWidth < minSize) {
      newWidth = minSize;
      if (start.direction.includes("left")) {
        newX = start.startX + start.startWidth - minSize;
      }
    }
    if (newHeight < minSize) {
      newHeight = minSize;
      if (start.direction.includes("top")) {
        newY = start.startY + start.startHeight - minSize;
      }
    }

    designStore.updatePatternSize(start.patternIndex, newWidth, newHeight);
    designStore.updatePatternPosition(start.patternIndex, newX, newY);
  };

  const stopResize = () => {
    resizeData.value = null;
    document.removeEventListener("mousemove", doResize);
    document.removeEventListener("mouseup", stopResize);
  };

  const startRotate = (patternIndex: number, event: MouseEvent) => {
    designStore.selectPattern(patternIndex);

    const pattern = designStore.patterns[patternIndex];
    const plateContainer = document.querySelector(".plate-container");
    if (!plateContainer) return;

    const rect = plateContainer.getBoundingClientRect();

    const centerX = rect.left + pattern.x + pattern.width / 2;
    const centerY = rect.top + pattern.y + pattern.height / 2;

    const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);

    rotateData.value = {
      patternIndex,
      startRotation: pattern.rotation,
      centerX,
      centerY,
      startAngle,
    };

    document.addEventListener("mousemove", doRotate);
    document.addEventListener("mouseup", stopRotate);
  };

  const doRotate = (event: MouseEvent) => {
    if (!rotateData.value) return;

    const start = rotateData.value;
    const currentAngle = Math.atan2(event.clientY - start.centerY, event.clientX - start.centerX);

    const angleDiff = (currentAngle - start.startAngle) * (180 / Math.PI);

    let newRotation = (start.startRotation + angleDiff) % 360;
    if (newRotation < 0) newRotation += 360;

    designStore.updatePatternRotation(start.patternIndex, newRotation);
  };

  const stopRotate = () => {
    rotateData.value = null;
    document.removeEventListener("mousemove", doRotate);
    document.removeEventListener("mouseup", stopRotate);
  };

  const setupInteractable = (element: HTMLElement, patternIndex: number) => {
    interact(element)
      .draggable({
        inertia: false,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: ".plate-container",
            endOnly: true,
          }),
        ],
        listeners: {
          move: (event) => {
            const target = event.target as HTMLElement;
            const x = (parseFloat(target.getAttribute("data-x")!) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute("data-y")!) || 0) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px) rotate(${designStore.patterns[patternIndex].rotation}deg)`;
            target.setAttribute("data-x", x.toString());
            target.setAttribute("data-y", y.toString());

            designStore.updatePatternPosition(patternIndex, designStore.patterns[patternIndex].x + event.dx, designStore.patterns[patternIndex].y + event.dy);
          },
        },
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 20, height: 20 },
            max: { width: 300, height: 300 },
          }),
          interact.modifiers.restrictEdges({
            outer: ".plate-container",
          }),
        ],
        listeners: {
          move: (event) => {
            const target = event.target as HTMLElement;
            const pattern = designStore.patterns[patternIndex];

            let x = pattern.x;
            let y = pattern.y;

            if (event.edges.left) {
              x += event.deltaRect.left;
            }
            if (event.edges.top) {
              y += event.deltaRect.top;
            }

            const width = Math.max(20, pattern.width + event.deltaRect.width);
            const height = Math.max(20, pattern.height + event.deltaRect.height);

            target.style.width = `${width}px`;
            target.style.height = `${height}px`;

            target.style.transform = `translate(${x - pattern.x}px, ${y - pattern.y}px) rotate(${pattern.rotation}deg)`;
            target.setAttribute("data-x", (x - pattern.x).toString());
            target.setAttribute("data-y", (y - pattern.y).toString());

            designStore.updatePatternSize(patternIndex, width, height);
            designStore.updatePatternPosition(patternIndex, x, y);
          },
        },
      });
  };

  onUnmounted(() => {
    document.removeEventListener("mousemove", doDrag as EventListener);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", doDrag as EventListener);
    document.removeEventListener("touchend", stopDrag);
  });

  return {
    designStore,
    startDrag,
    startResize,
    startRotate,
    setupInteractable,
    isDragging,
  };
}
