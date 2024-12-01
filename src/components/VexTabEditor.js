import React, { useEffect, useRef } from "react";

const VexTabEditor = ({ content }) => {
  const containerRef = useRef(null);
  const { Vex, VexTab, Artist } = window.vextab;

  useEffect(() => {
    if (containerRef.current) {
      const tabDOM = containerRef.current;
      tabDOM.innerHTML = "";
      const renderer = new Vex.Flow.Renderer(
        tabDOM,
        Vex.Flow.Renderer.Backends.SVG
      );
      const artist = new Artist(10, 10, 600, { scale: 0.8 });
      const tab = new VexTab(artist);

      try {
        tab.parse(content);
        artist.render(renderer);
      } catch (e) {
        console.error("VexTab rendering error", e);
      }
    }
  }, [content]);

  return (
    <div className="vextab-auto text-center bg-light rounded">
      <div ref={containerRef} id="vextabContainer" />
    </div>
  );
};

export default VexTabEditor;
