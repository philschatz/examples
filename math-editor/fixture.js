export default `
<html>
  <body>
    <h1>MathEditor Test Page!!!</h1>
    <p>
      These things should work:
    </p>
    <ul>
      <li>editing a formula using MathQuill (need to click twice to open the editor)</li>
      <li>editing using the "Full-Source"</li>
      <li>deleting a formula by pressing the Delete key</li>
      <li>Undoing a delete by pressing Ctrl+Z</li>
      <li>copying/cutting just the selected math element (and then pasting)</li>
      <li>copying/cutting multiple lines of text with math and pasting</li>
    </ul>
    <div data-math="x=\\frac{-b\\pm \\sqrt{b^2-4ac}}{2a}"></div>
    <p>And here is another formula (which does not work in MathQuill)</p>
    <div data-math>
\\mathbf{A} =
\\begin{bmatrix}
a_{11} & a_{12} & \\cdots & a_{1n} \\\\
a_{21} & a_{22} & \\cdots & a_{2n} \\\\
\\vdots & \\vdots & \\ddots & \\vdots \\\\
a_{m1} & a_{m2} & \\cdots & a_{mn}
\\end{bmatrix} =
\\left( \\begin{array}{rrrr}
a_{11} & a_{12} & \\cdots & a_{1n} \\\\
a_{21} & a_{22} & \\cdots & a_{2n} \\\\
\\vdots & \\vdots & \\ddots & \\vdots \\\\
a_{m1} & a_{m2} & \\cdots & a_{mn}
\\end{array} \\right) =\\left(a_{ij}\\right) \\in \\mathbb{R}^{m \\times n}.
    </div>
    <h1>TODO</h1>
    <ol>
      <li>Support delete key when selected</li>
      <li>Make modal pretty</li>
      <li>Support MathML</li>
      <li>Add/edit/upgrade-by-selecting inline math</li>
      <li>Formula cheat-sheet</li>
    </ol>
  </body>
</html>
`
