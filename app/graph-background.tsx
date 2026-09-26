'use client';

import { useEffect, useRef } from 'react';

const NODE_COUNT = 600;
const BASE_DAMPING = 0.7;
const BASE_SPRING_LENGTH = 2;
const BASE_REPULSION = -0.0999;
const WARMUP_TICKS = 1;
const colors = ['#6F7D4F', '#DDE0CF', '#DA680F', '#7492AC'];

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export default function GraphBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let frame = 0;
    let renderer: import('three').WebGLRenderer | undefined;
    let graph:
      | import('@jonobr1/force-directed-graph').ForceDirectedGraph
      | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let dampingInterval: number | undefined;
    const animations: Array<{ kill: () => void }> = [];

    async function mount() {
      const host = hostRef.current;
      if (!host) return;

      const THREE = await import('three');
      const { ForceDirectedGraph } =
        await import('@jonobr1/force-directed-graph');
      const { gsap } = await import('gsap');
      if (disposed) return;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0xffffff, 1);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      renderer.domElement.style.opacity = '0';
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
      camera.position.z = 50;

      const random = seededRandom(1839);
      const nodes = Array.from({ length: NODE_COUNT }, (_, id) => ({
        id,
        color: colors[Math.floor(colors.length * Math.random())],
      }));
      const links: { source: number; target: number }[] = [];
      for (let source = 1; source < NODE_COUNT; source++) {
        const target =
          random() > 0.5 ? source - 1 : Math.floor(random() * source);
        links.push({ source, target });
      }

      graph = new ForceDirectedGraph(renderer);
      await graph.set({ nodes, links });
      if (disposed) return;

      graph.is2D = true;
      graph.decay = 1;
      graph.maxSpeed = 25;
      graph.timeStep = 1;
      graph.damping = BASE_DAMPING;
      graph.repulsion = BASE_REPULSION;
      graph.springLength = BASE_SPRING_LENGTH;
      graph.stiffness = 0;
      graph.gravity = 0.2;
      graph.beginning = 0;
      graph.ending = 1;
      graph.opacity = 1;
      graph.sizeAttenuation = true;
      graph.pointsInheritColor = true;
      graph.pointColor.setRGB(1, 1, 1);
      graph.linkColor.setRGB(1, 1, 1);
      graph.nodeRadius = 1.25;
      graph.linewidth = 1;
      graph.opacity = 0.6;
      scene.add(graph);

      let boosted = false;
      dampingInterval = window.setInterval(() => {
        if (!graph) return;
        boosted = !boosted;
        graph.damping = boosted ? 1.005 : BASE_DAMPING;
      }, 1000);

      const resize = () => {
        const width = host.clientWidth;
        const height = host.clientHeight;
        if (!width || !height || !renderer) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();

      let ticks = 0;
      const animate = (now: number) => {
        if (!renderer || !graph || disposed) return;
        graph.update(now);
        renderer.render(scene, camera);
        ticks += 1;
        if (ticks === WARMUP_TICKS) {
          animations.push(
            gsap.to(renderer.domElement, {
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
            }),
          );
        }
        frame = window.requestAnimationFrame(animate);
      };
      frame = window.requestAnimationFrame(animate);
    }

    void mount();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.clearInterval(dampingInterval);
      animations.forEach((animation) => animation.kill());
      resizeObserver?.disconnect();
      graph?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="graph-background" aria-hidden="true" />;
}
