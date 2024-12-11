import React, { useEffect, useRef } from "react";

const VexTabEditor = ({ content }) => {
  const containerRef = useRef(null);
  const { Vex, VexTab, Artist } = window.vextab;

  useEffect(() => {
    if (containerRef.current) {
      const tabDOM = containerRef.current;
      tabDOM.innerHTML = "";
      const containerWidth = tabDOM.parentElement.clientWidth;

      const renderer = new Vex.Flow.Renderer(
        tabDOM,
        Vex.Flow.Renderer.Backends.SVG
      );

      renderer.resize(containerWidth, "auto");

      const artist = new Artist(10, 10, containerWidth - 20, {
        scale: 0.8,
        width: containerWidth - 20,
      });

      const tab = new VexTab(artist);

      try {
        tab.parse(content);
        artist.render(renderer);
        const svg = tabDOM.querySelector("svg");
        if (svg) {
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          svg.style.display = "block";
          svg.style.width = "100%";
          svg.style.height = "auto";
        }
      } catch (e) {
        console.error("VexTab rendering error", e);
      }
    }
  }, [content, Artist, Vex.Flow, VexTab]);

  return (
    <div className="vextab-auto text-center rounded w-100 bg-light">
      <div ref={containerRef} id="vextabContainer" className="w-100" />
    </div>
  );
};

export default VexTabEditor;
