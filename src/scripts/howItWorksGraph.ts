import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type PathPoint = {
  x: number;
  y: number;
};

const getStep = (element: Element) => Number(element.getAttribute("data-step"));

const initGraph = (graph: SVGSVGElement) => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compactMotion = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
  const selectedEdges = Array.from(graph.querySelectorAll<SVGPathElement>("[data-path-edge]"));
  const hintEdges = Array.from(graph.querySelectorAll<SVGPathElement>("[data-hint-edge]"));
  const pathNodes = Array.from(graph.querySelectorAll<SVGGElement>("[data-path-node]"));
  const halos = Array.from(graph.querySelectorAll<SVGCircleElement>("[data-node-halo]"));
  const hintNodes = Array.from(graph.querySelectorAll<SVGGElement>("[data-hint-node]"));
  const movingCert = graph.querySelector("[data-moving-cert]");
  const originCert = graph.querySelector("[data-origin-cert]");
  const certTrail = graph.querySelector("[data-cert-trail]");
  const pathPoints: PathPoint[] = Array.from(graph.querySelectorAll<SVGGElement>("[data-path-point]"))
    .sort((a, b) => getStep(a) - getStep(b))
    .map((point) => ({
      x: Number(point.getAttribute("data-point-x")),
      y: Number(point.getAttribute("data-point-y")),
    }));

  const orderedNodes = pathNodes.sort((a, b) => getStep(a) - getStep(b));
  const orderedHalos = halos.sort((a, b) => getStep(a) - getStep(b));
  const orderedEdges = selectedEdges.sort((a, b) => getStep(a) - getStep(b));

  if (
    movingCert instanceof SVGGElement &&
    originCert instanceof SVGGElement &&
    certTrail instanceof SVGEllipseElement &&
    pathPoints.length &&
    orderedNodes.length &&
    orderedEdges.length &&
    orderedHalos.length
  ) {
    orderedEdges.forEach((edge) => {
      const length = edge.getTotalLength();
      edge.style.strokeDasharray = `${length}`;
      edge.style.strokeDashoffset = `${length}`;
    });

    const startPoint = pathPoints[0];
    const endPoint = pathPoints[pathPoints.length - 1];
    const finalHalo = orderedHalos[orderedHalos.length - 1];
    const stepDuration = compactMotion ? 0.48 : 0.68;
    const motionTargets = [movingCert, certTrail, ...orderedNodes, ...orderedHalos, ...hintNodes];

    gsap.set(movingCert, {
      x: startPoint.x,
      y: startPoint.y,
      opacity: 0,
      scale: 0.94,
      transformOrigin: "center center",
    });

    gsap.set(certTrail, {
      opacity: 0.22,
      scale: 0.82,
      transformOrigin: "center center",
    });

    gsap.set(orderedNodes, {
      opacity: compactMotion ? 0.88 : 0.76,
      scale: 0.98,
      transformOrigin: "center center",
    });

    gsap.set(orderedHalos, {
      opacity: 0,
      scale: 0.76,
      transformOrigin: "center center",
    });

    if (hintEdges.length) {
      gsap.set(hintEdges, {
        opacity: (index: number) => (index === hintEdges.length - 1 ? 0.07 : 0.12),
      });
    }

    if (hintNodes.length) {
      gsap.set(hintNodes, {
        opacity: 0.72,
        scale: 0.96,
        transformOrigin: "center center",
      });
    }

    const resetEdges = () => {
      orderedEdges.forEach((edge) => {
        edge.style.strokeDashoffset = edge.getTotalLength().toString();
      });

      gsap.set(orderedEdges, {
        opacity: 0.16,
      });
    };

    const clearMotionHints = () => {
      gsap.set(motionTargets, {
        clearProps: "willChange",
      });
    };

    if (prefersReducedMotion) {
      gsap.set(orderedEdges, {
        opacity: 1,
        strokeDashoffset: 0,
      });

      gsap.set(orderedNodes, {
        opacity: 1,
        scale: (index: number) => (index === orderedNodes.length - 1 ? 1.16 : 1.06),
      });

      gsap.set(orderedHalos, {
        opacity: (index: number) => (index === orderedHalos.length - 1 ? 0.92 : 0.52),
        scale: (index: number) => (index === orderedHalos.length - 1 ? 1.18 : 1.04),
      });

      gsap.set(originCert, {
        opacity: 0.18,
      });

      gsap.set(movingCert, {
        x: endPoint.x,
        y: endPoint.y,
        opacity: 0.92,
        scale: 1.04,
      });

      gsap.set(certTrail, {
        opacity: 0.36,
        scale: 1,
      });

      if (hintEdges.length) {
        gsap.set(hintEdges, {
          opacity: 0.16,
        });
      }

      clearMotionHints();
    } else {
      gsap.set(motionTargets, {
        willChange: "transform, opacity",
      });

      const timeline = gsap.timeline({
        paused: true,
        repeat: -1,
        repeatDelay: compactMotion ? 0.6 : 1.05,
        defaults: { ease: "power2.inOut" },
        onRepeat: () => {
          resetEdges();
        },
      });

      timeline
        .set(movingCert, {
          x: startPoint.x,
          y: startPoint.y,
          opacity: 0,
          scale: 0.94,
        })
        .set(certTrail, {
          opacity: 0.22,
          scale: 0.82,
        })
        .set(originCert, {
          opacity: 0.32,
        })
        .to(originCert, {
          opacity: 0.18,
          duration: 0.28,
        }, 0)
        .to(movingCert, {
          opacity: 0.98,
          scale: 1,
          duration: 0.26,
        }, 0.04);

      if (hintEdges.length) {
        timeline
          .to(hintEdges.slice(0, 3), {
            opacity: 0.24,
            duration: 0.16,
            stagger: 0.05,
          }, 0.18)
          .to(hintNodes.slice(0, 2), {
            opacity: 0.88,
            scale: 1.02,
            duration: 0.18,
            stagger: 0.06,
          }, "<")
          .to(hintEdges.slice(0, 3), {
            opacity: 0.1,
            duration: 0.2,
            stagger: 0.04,
          }, ">")
          .to(hintNodes.slice(0, 2), {
            opacity: 0.72,
            scale: 0.96,
            duration: 0.2,
          }, "<");
      }

      orderedEdges.forEach((edge, index) => {
        const targetNode = orderedNodes[index];
        const targetHalo = orderedHalos[index];
        const targetPoint = pathPoints[index + 1];
        const isFinal = index === orderedEdges.length - 1;
        const addPause = index === 3;

        timeline
          .to(edge, {
            opacity: 1,
            strokeDashoffset: 0,
            duration: stepDuration * 0.72,
          }, ">")
          .to(movingCert, {
            x: targetPoint.x,
            y: targetPoint.y,
            duration: stepDuration,
          }, "<")
          .to(certTrail, {
            opacity: isFinal ? 0.52 : 0.44,
            scale: isFinal ? 1.08 : 1.02,
            duration: stepDuration * 0.58,
            yoyo: true,
            repeat: 1,
          }, "<")
          .to(targetNode, {
            opacity: 1,
            scale: isFinal ? 1.2 : 1.1,
            duration: 0.26,
          }, `<+${stepDuration * 0.48}`)
          .to(targetHalo, {
            opacity: isFinal ? 0.96 : 0.56,
            scale: isFinal ? 1.26 : 1.06,
            duration: 0.34,
          }, "<")
          .to(targetNode, {
            scale: isFinal ? 1.14 : 1.05,
            duration: 0.24,
          }, ">-0.06");

        if (addPause && hintEdges.length > 3) {
          const delayedHintEdges = hintEdges.slice(3);

          timeline
            .to(delayedHintEdges, {
              opacity: 0.2,
              duration: 0.18,
              stagger: 0.05,
            }, ">-0.06")
            .to(hintNodes.slice(2), {
              opacity: 0.84,
              scale: 1.01,
              duration: 0.18,
              stagger: 0.05,
            }, "<")
            .to({}, { duration: compactMotion ? 0.08 : 0.14 })
            .to(delayedHintEdges, {
              opacity: (hintIndex: number) => (hintIndex === delayedHintEdges.length - 1 ? 0.07 : 0.1),
              duration: 0.22,
              stagger: 0.04,
            })
            .to(hintNodes.slice(2), {
              opacity: 0.72,
              scale: 0.96,
              duration: 0.2,
            }, "<");
        }
      });

      timeline
        .to(finalHalo, {
          opacity: 1,
          scale: 1.34,
          duration: compactMotion ? 0.3 : 0.44,
          yoyo: true,
          repeat: 1,
        }, ">-0.02")
        .to(movingCert, {
          scale: 1.08,
          duration: 0.18,
          yoyo: true,
          repeat: 1,
        }, "<")
        .to(movingCert, {
          opacity: 0.14,
          duration: 0.22,
        }, "+=0.34")
        .to(orderedEdges, {
          opacity: 0.22,
          duration: 0.24,
          stagger: 0.03,
        }, "<")
        .to(orderedHalos.slice(0, -1), {
          opacity: 0.16,
          scale: 0.94,
          duration: 0.24,
          stagger: 0.04,
        }, "<")
        .to(finalHalo, {
          opacity: 0.22,
          scale: 0.96,
          duration: 0.28,
        }, "<")
        .to(orderedNodes, {
          scale: 0.98,
          duration: 0.24,
          stagger: 0.03,
        }, "<")
        .to(originCert, {
          opacity: 0.3,
          duration: 0.18,
        }, "<");

      ScrollTrigger.create({
        trigger: graph,
        start: "top 82%",
        end: "bottom 18%",
        onEnter: () => timeline.play(0),
        onEnterBack: () => timeline.play(0),
        onLeave: () => timeline.pause(0),
        onLeaveBack: () => timeline.pause(0),
      });

      timeline.eventCallback("onComplete", clearMotionHints);
    }
  }
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll<SVGSVGElement>("[data-process-graph]").forEach((graph) => {
    initGraph(graph);
  });
}
