import React from "react";
import CodeBlock from "./CodeBlock";

const VexTabDocumentation = () => {
  const documentation = {
    intro: {
      title: "VexTab Documentation",
      description:
        "VexTab is a language for creating, editing, and sharing standard notation and guitar tablature. Unlike ASCII tabs, VexTab is designed for writeability and flexibility.",
    },
    sections: [
      {
        id: 1,
        title: "The Stave",
        description:
          "Use the tabstave keyword to create a new tab stave. You can also add arguments like notation=true to render a standard notation stave above the tab stave.",
        code: "tabstave notation=true",
      },
      {
        id: 2,
        title: "Add Some Notes",
        description:
          "Use the notes keyword to add notes. Notes can be written as note/octave or fret/string.",
        code: "tabstave\nnotes 6/3 5/2 4/2",
      },
      {
        id: 3,
        title: "Stave Keywords",
        description:
          "Customize your stave with the following keywords and values:",
        code: "tabstave notation=true clef=bass key=C time=4/4",
        table: {
          headers: ["Keyword", "Values"],
          rows: [
            { keyword: "notation", values: "true / false" },
            { keyword: "clef", values: "treble, bass, alto, etc." },
            { keyword: "key", values: "C, Am, G, F, etc." },
            { keyword: "time", values: "C, 4/4, 3/4, etc." },
          ],
        },
      },
      {
        id: 4,
        title: "Add Rests and Bar-lines",
        description: "Add rests using # characters and bar-lines using |.",
        code: "tabstave\nnotes 6/1 5/2 | 4/2 3/1",
      },
      {
        id: 5,
        title: "Bend Notes",
        description: "Use the b character to bend notes.",
        code: "tabstave\nnotes 10b12/3",
      },
      {
        id: 6,
        title: "Mute Notes, Strokes, and Vibrato",
        description:
          "Add muted notes with X, upstrokes with u, and vibrato with v.",
        code: "tabstave\nnotes 4-5-6b7v/3 10/1 | 5d-4u-Xd/3 2v/2",
      },
      {
        id: 7,
        title: "Add Chords",
        description: "Group notes into chords using parentheses.",
        code: "tabstave\nnotes (0/6.2/5)(0/6.2/5)(3/6.5/5)(1/6.3/5)",
      },
      {
        id: 8,
        title: "Add Hammer-ons, Pull-offs, Taps, and Slides",
        description: "Use specific characters to add techniques.",
        code: "tabstave\nnotes (8/2.7b9b7/3) (5b6/2.5b6/3)v 7s0/4 |",
        list: [
          { technique: "Hammer-ons", symbol: "h" },
          { technique: "Pull-offs", symbol: "p" },
          { technique: "Taps", symbol: "t" },
          { technique: "Slides", symbol: "s" },
        ],
      },
      {
        id: 9,
        title: "Add Durations and Tuplets",
        description:
          "Change durations with : followed by duration codes like :q (quarter note) or :w (whole note).",
        code: "tabstave\nnotes :8 5s7s8/5 ^3^ :q (5/2.6/3)h(7/3) :8d 5/4 :16 5/5",
      },
      {
        id: 10,
        title: "Add Lyrics or Annotations",
        description: "Use $ to add lyrics or annotations.",
        code: "tabstave\nnotes :q 5/5 5/4 5/3 ^3^ $Fi,Ga,Ro!$ :h 4/4 $.top.$ $Blah!$",
      },
    ],
  };

  return (
    <>
      <div className="alert alert-primary mb-4">
        <div className="d-flex">
          <i className="bi bi-info-circle fs-5 me-2"></i>
          <p className="mb-0">{documentation.intro.description}</p>
        </div>
      </div>

      <div className="d-flex flex-column gap-4">
        {documentation.sections.map((section) => (
          <section key={section.id}>
            <h5 className="d-flex align-items-center mb-3">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                style={{ width: "24px", height: "24px", fontSize: "12px" }}
              >
                {section.id}
              </div>
              {section.title}
            </h5>

            <p>{section.description}</p>

            {section.table && (
              <div className="table-responsive mb-3">
                <table className="table">
                  <thead className="table-light">
                    <tr>
                      {section.table.headers.map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <code>{row.keyword}</code>
                        </td>
                        <td>{row.values}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.list && (
              <ul className="mb-3">
                {section.list.map((item, index) => (
                  <li key={index}>
                    {item.technique}: <code>{item.symbol}</code>
                  </li>
                ))}
              </ul>
            )}
            <CodeBlock code={section.code} />
          </section>
        ))}

        <section className="border-top pt-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-lightbulb text-primary fs-4 me-3"></i>
            <div>
              <h5 className="mb-2">Want to Learn More?</h5>
              <p className="mb-0">
                To dive deeper into VexTab and explore its advanced features,
                check out the{" "}
                <a
                  href="http://vexflow.com/vextab/tutorial.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  official VexTab tutorial{" "}
                  <i className="bi bi-box-arrow-up-right"></i>
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default VexTabDocumentation;
