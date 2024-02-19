$(document).ready(function () {
  let GLOBAL_CANVAS = document.createElement("canvas");

  let GLOBAL_CANVAS_CTX = GLOBAL_CANVAS.getContext("2d");

  //generic function to display file given its base64 repr
  function displayFile(fileData) {
    let mimeType = fileData.split(",")[0].split(":")[1].split(";")[0];
    let previewFile = $("<img>").addClass("filePreview");
    previewFile.attr("src", fileData);
    $("#copy .file").empty();
    $("#copy .file").append(previewFile);
    $("#copy .format .mimeType").empty().append(mimeType);

    previewFile[0].onload = () => {
      // let imgAspectRatio = img.width / img.height
      let width = previewFile[0].width;
      let height = previewFile[0].height;
      GLOBAL_CANVAS.width = width;
      GLOBAL_CANVAS.height = height;
      GLOBAL_CANVAS_CTX.drawImage(previewFile[0], 0, 0, width, height);

      // document.body.append(GLOBAL_CANVAS);
    };
  }

  //generic function to handle and display uploaded files
  function handleFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (ev) => {
      let rawData = ev.target.result;
      sessionStorage.setItem("originalFile", rawData);
      displayFile(rawData);
    };
  }

  //persist uploaded file on page refresh
  let fileValue = sessionStorage.getItem("originalFile");

  if (fileValue) {
    displayFile(fileValue);
  }

  //allow user to just paste a file into the webpage..
  $(document).on("paste", function (e) {
    e.stopPropagation();
    e.preventDefault();
    var items = (e.clipboardData || e.originalEvent.clipboardData).items;
    if (items) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].kind === "file") {
          var file = items[i].getAsFile();
          handleFile(file);
        }
      }
    }
  });

  //Allow file upload and drag-and-drops
  $("#originalFile").change((e) => {
    let file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  });

  //create new boxes when displaying a new format
  $("#new-box").click(() => {
    // Create a dialog element
    let dialog = $("<dialog>");

    // Create a label and select element for the file format
    let label = $("<label>").text("Select the new file format:");

    let select = $("<select>").append(
      $("<option>").val("image/png").text("PNG"),
      $("<option>").val("image/jpg").text("JPG"),
      $("<option>").val("image/webp").text("WEBP")
    );

    let confirmButton = $("<button>").text("Confirm");
    confirmButton.click(() => {
      let selectedFormat = select.val();
      dialog[0].close();
      createNewPasteBox(selectedFormat);
    });

    dialog.append(label, select, confirmButton);

    $("body").append(dialog);

    dialog[0].showModal();
  });

  function createNewFormat(previewFile, format) {
    GLOBAL_CANVAS.toBlob(
      (blob) => {
        let link = URL.createObjectURL(blob);
        previewFile.attr("src", link);
      },
      format,
      1
    );
  }

  function createNewPasteBox(format) {
    let newPasteBox = $("<div>").addClass("paste").hide();

    let newPasteBoxFile = $("<div>").addClass("file");
    let previewFile = $("<img>").addClass("filePreview");
    newPasteBoxFile.append(previewFile);
    createNewFormat(previewFile, format);

    // images: png, jpg, webp

    let copyIcon = $("<img>")
      .addClass("copyIcon")
      .attr("alt", "copy to clipboard")
      .attr("src", "/copy.svg");

    copyIcon.on("click", () => {
      let blobUrl = copyIcon.prev().attr("src")
      let a = document.createElement("a");
      a.href = blobUrl;
      a.download = "testImage." + format.split("/")[1]; // Extract file extension from format
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // console.log(copyIcon.prev().attr("src"))
    });

    newPasteBoxFile.append(copyIcon);

    let newPasteBoxFormat = $("<div>").addClass("format");

    let newPasteBoxFormatText = $("<div>")
      .addClass("selectedFormat")
      .text(`Current File Format is ${format}`);

    newPasteBoxFormat.append(newPasteBoxFormatText);
    newPasteBox.append(newPasteBoxFile);
    newPasteBox.append(newPasteBoxFormat);

    $("#new-box").before(newPasteBox);

    newPasteBox.fadeIn(800);
  }
});
