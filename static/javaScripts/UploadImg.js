function uploadImg(){
  function Init() {
    var fileSelect = document.getElementById('file-upload');
    var fileDrag = document.getElementById('file-drag');
    fileSelect.addEventListener('change', fileSelectHandler, false);

    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
      fileDrag.addEventListener('dragover', fileDragHover, false);
      fileDrag.addEventListener('dragleave', fileDragHover, false);
      fileDrag.addEventListener('drop', fileSelectHandler, false);
    }
  }

  function fileDragHover(e) {
    var fileDrag = document.getElementById('file-drag');
    e.stopPropagation();
    e.preventDefault();
    fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
  }

  function fileSelectHandler(e) {
    var files = e.target.files || e.dataTransfer.files;
    fileDragHover(e);
    for (var i = 0, f; f = files[i]; i++) {
      parseFile(f);
    }
  }

  function output(msg) {
    var m = document.getElementById('messages');
    m.innerHTML = msg;
  }

  function parseFile(file) {
    output('<strong>' + encodeURI(file.name) + '</strong>');
    var imageName = file.name;
    var isGood = (/\.(?=gif|jpg|png|jpeg)/gi).test(imageName);
    if (isGood) {
      document.getElementById('start').classList.add("hidden");
      document.getElementById('submit').classList.remove("hidden");
      document.getElementById('file-image').classList.remove("hidden");
      document.getElementById('file-image').src = URL.createObjectURL(file);
    }
    else {
      document.getElementById('file-image').classList.add("hidden");
      document.getElementById('start').classList.remove("hidden");
      document.getElementById("file-upload-form").reset();
    }
  }

  // The upload option either Select or Drag&Drop
  if (window.File && window.FileList && window.FileReader) {
    Init();
  } else {
    document.getElementById('file-drag').style.display = 'none';
  }
}
uploadImg();