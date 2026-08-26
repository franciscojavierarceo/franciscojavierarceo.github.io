import clsx from "clsx";
import Link from 'next/link'
import { useEffect, useState } from "react";

import { Image } from "..";
import { getSiteMetaData } from "@utils/helpers";

const randomMatrix = () => Array.from({ length: 2 }, () => Array.from({ length: 2 }, () => Math.floor(Math.random() * 9) + 1));
const emptyMatrix = () => [[null, null], [null, null]];

function matrixRowsText(matrixA, matrixB, matrixResult) {
  return matrixA.map((row, index) => {
    const format = (value) => value === null ? "·" : String(value).padStart(2, " ");
    const left = `[ ${row.map(format).join(" ")} ]`;
    const right = `[ ${matrixB[index].map(format).join(" ")} ]`;
    const result = `[ ${matrixResult[index].map((value) => value === null ? "·" : String(value).padStart(2, " ")).join(" ")} ]`;
    return `${left} ${index === 0 ? "×" : " "} ${right} ${index === 0 ? "=" : " "} ${result}`;
  }).join("\n");
}

export function Bio({ className }) {
  const { author, social } = getSiteMetaData();
  const [matrixA, setMatrixA] = useState(emptyMatrix());
  const [matrixB, setMatrixB] = useState(emptyMatrix());
  const [visibleA, setVisibleA] = useState(emptyMatrix());
  const [visibleB, setVisibleB] = useState(emptyMatrix());
  const [matrixResult, setMatrixResult] = useState(emptyMatrix());
  const [phase, setPhase] = useState("idle");
  const [populateStep, setPopulateStep] = useState(0);
  const [matrixStep, setMatrixStep] = useState(-1);

  useEffect(() => {
    if (phase === "populate" && populateStep < 4) {
      const timer = setTimeout(() => {
        const row = Math.floor(populateStep / 2);
        const column = populateStep % 2;
        setVisibleA((current) => current.map((currentRow, currentRowIndex) => currentRow.map((currentValue, currentColumnIndex) => currentRowIndex === row && currentColumnIndex === column ? matrixA[row][column] : currentValue)));
        setVisibleB((current) => current.map((currentRow, currentRowIndex) => currentRow.map((currentValue, currentColumnIndex) => currentRowIndex === row && currentColumnIndex === column ? matrixB[row][column] : currentValue)));
        if (populateStep === 3) {
          setPhase("compute");
          setMatrixStep(0);
        } else {
          setPopulateStep(populateStep + 1);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
    if (phase !== "compute" || matrixStep < 0 || matrixStep > 3) return undefined;
    const timer = setTimeout(() => {
      const row = Math.floor(matrixStep / 2);
      const column = matrixStep % 2;
      const firstProduct = matrixA[row][0] * matrixB[0][column];
      const secondProduct = matrixA[row][1] * matrixB[1][column];
      const value = firstProduct + secondProduct;
      const expression = `(${matrixA[row][0]}×${matrixB[0][column]})+(${matrixA[row][1]}×${matrixB[1][column]})`;
      setMatrixResult((current) => current.map((currentRow, currentRowIndex) => currentRow.map((currentValue, currentColumnIndex) => currentRowIndex === row && currentColumnIndex === column ? expression : currentValue)));
      const resolveTimer = setTimeout(() => {
        setMatrixResult((current) => current.map((currentRow, currentRowIndex) => currentRow.map((currentValue, currentColumnIndex) => currentRowIndex === row && currentColumnIndex === column ? value : currentValue)));
        setMatrixStep(matrixStep + 1);
      }, 900);
      return () => clearTimeout(resolveTimer);
    }, 1300);
    return () => clearTimeout(timer);
  }, [matrixA, matrixB, matrixStep, phase, populateStep]);

  const runMatrix = () => {
    setMatrixA(randomMatrix());
    setMatrixB(randomMatrix());
    setVisibleA(emptyMatrix());
    setVisibleB(emptyMatrix());
    setMatrixResult(emptyMatrix());
    setPopulateStep(0);
    setMatrixStep(-1);
    setPhase("populate");
  };

  return (
    <>
    <section className={className}>
    <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
    <img
      src="/profile.jpg"
      className="object-cover w-20 h-20 rounded-full md:w-24 md:h-24"
      alt={'Francisco Javier Arceo'}
      />
      <div>
        <p className="mb-2 eyebrow terminal-label">francisco</p>
        <h2 className="text-3xl font-black md:text-5xl">Developer & open-source enthusiast.</h2>
      </div>
    </div>
    <div className="max-w-2xl mt-6 text-lg leading-relaxed">
        <p>I'm <a className="inline-link" href="/about-me">Francisco</a>. I build tools, write about technology, and spend a lot of time thinking about how data and people fit together.
          You can find some of my other writing on{' '}<a className="inline-link" href="https://chaosengineering.substack.com/">the Chaos Engineering blog</a>.
          I'm very passionate about data, code, technology, engineering, economics, finance, machine learning, digital products, and philanthropy.
          I'll probably write about some of those things so feel free to check back in if you're interested!
        </p>
        <p className="mt-5 text-base" style={{color: 'var(--muted)'}}>Find me on <a className="inline-link" href='https://github.com/franciscojavierarceo'>GitHub</a> or <a className="inline-link" href='https://twitter.com/franciscojarceo'>Twitter</a>. Welcome to my little corner of the internet.</p>
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button className="terminal-action" type="button" onClick={runMatrix}>
            generate dot-product matrix
          </button>
          <pre className="matrix-output" aria-live="polite">{matrixRowsText(visibleA, visibleB, matrixResult)}</pre>
        </div>
    </div>
    </section>
    </>
  );
}
