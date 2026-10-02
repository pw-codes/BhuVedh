"use client";
export default function PrintButton() { return <button className="primary noprint" onClick={() => window.print()}>Print or save as PDF</button>; }
