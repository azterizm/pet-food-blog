export function PrintElem(elem: HTMLElement | string) {
  const mywindow = window.open('', 'PRINT', 'height=400,width=600')
  if (!mywindow) return

  mywindow.document.write('<html><head><title>' + document.title + '</title>')
  mywindow.document.write('</head><body >')
  mywindow.document.write('<h1>' + document.title + '</h1>')
  mywindow.document.write(
    typeof elem === 'string'
      ? document.getElementById(elem)!.innerHTML
      : elem.innerHTML
  )
  mywindow.document.write('</body></html>')

  mywindow.document.close() // necessary for IE >= 10
  mywindow.focus() // necessary for IE >= 10*/

  mywindow.print()
  mywindow.close()

  return true
}
