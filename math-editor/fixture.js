export default `
<html>
  <body>
    <h1>MathEditor Test Page!!!</h1>
    <p>
      These things should work:
    </p>
      <p>editing a formula using MathQuill (need to click twice to open the editor)</p>
      <p>editing using the "Full-Source"</p>
      <p>deleting a formula by pressing the Delete key</p>
      <p>Undoing a delete by pressing Ctrl+Z</p>
      <p>copying/cutting just the selected math element (and then pasting)</p>
      <p>copying/cutting multiple lines of text with math and pasting</p>
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
      <p>Make modal pretty</p>
      <p>Support MathML</p>
      <p>Add/edit/upgrade-by-selecting inline math</p>
      <p>Formula cheat-sheet</p>
  </body>
</html>
`
