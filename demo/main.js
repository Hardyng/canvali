const { default: Canvali, CanvaliScene } = window.Canvali

const canvali = new Canvali('abc')
const canvaliScene = new CanvaliScene({
  rx: 10,
  width: 600,
  height: 500
})
canvali.setScene(canvaliScene)
document.getElementById('download').addEventListener('click', () => {
  canvali.download()
})
document.getElementById('filter').addEventListener('click', () => {
  canvali.filter('grayscale')
})
document.getElementById('noise').addEventListener('click', () => {
  canvali.filter('noise')
})
document.getElementById('posterize').addEventListener('click', () => {
  const value = document.getElementById('value').value
  canvali.filter('posterize', value)
})
document.getElementById('contrast').addEventListener('click', () => {
  const value = document.getElementById('value').value
  if (value) {
    canvali.filter('contrast', value)
  } else {
    canvali.filter('contrast')
  }
})
// console.log("myLibraryInstance", myLibraryInstance);

// myLibraryInstance.myMethod();
