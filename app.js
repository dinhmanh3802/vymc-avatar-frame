const imageInput =
    document.getElementById("imageInput");

const imageToCrop =
    document.getElementById("imageToCrop");

const editorSection =
    document.getElementById("editorSection");

const resultSection =
    document.getElementById("resultSection");

const uploadPanel =
    document.getElementById("uploadPanel");

const fileName =
    document.getElementById("fileName");

const zoomInButton =
    document.getElementById("zoomInButton");

const zoomOutButton =
    document.getElementById("zoomOutButton");

const rotateButton =
    document.getElementById("rotateButton");

const createButton =
    document.getElementById("createButton");

const downloadButton =
    document.getElementById("downloadButton");

const changeImageButton =
    document.getElementById("changeImageButton");

const selectAnotherButton =
    document.getElementById("selectAnotherButton");

const resultCanvas =
    document.getElementById("resultCanvas");

const ctx =
    resultCanvas.getContext("2d");


let cropper = null;

let currentImageURL = null;


const OUTPUT_WIDTH = 1080;

const OUTPUT_HEIGHT = 1080;


/* =================================
   HANDLE IMAGE
================================= */

function loadImageFile(file) {

    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        alert("Vui lòng chọn một file ảnh JPG hoặc PNG.");

        return;

    }


    if (currentImageURL) {

        URL.revokeObjectURL(currentImageURL);

    }


    currentImageURL =
        URL.createObjectURL(file);


    fileName.textContent =
        file.name;


    imageToCrop.src =
        currentImageURL;


    editorSection.classList.remove("hidden");

    resultSection.classList.add("hidden");


    imageToCrop.onload = function () {

        if (cropper) {

            cropper.destroy();

        }


        cropper =
            new Cropper(
                imageToCrop,
                {

                    aspectRatio:
                        OUTPUT_WIDTH /
                        OUTPUT_HEIGHT,

                    viewMode: 1,

                    dragMode: "move",

                    autoCropArea: 1,

                    responsive: true,

                    restore: false,

                    background: false,

                    guides: true,

                    center: true,

                    highlight: false,

                    movable: true,

                    zoomable: true,

                    zoomOnTouch: true,

                    zoomOnWheel: true,

                    wheelZoomRatio: 0.1,

                    rotatable: true,

                    scalable: false,

                    toggleDragModeOnDblclick:
                        false

                }
            );


        setTimeout(
            function () {

                editorSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            },
            120
        );

    };

}


/* =================================
   INPUT
================================= */

imageInput.addEventListener(
    "change",
    function (event) {

        const file =
            event.target.files[0];

        loadImageFile(file);

    }
);


/* =================================
   DRAG & DROP
================================= */

uploadPanel.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        uploadPanel.classList.add(
            "dragging"
        );

    }
);


uploadPanel.addEventListener(
    "dragleave",
    function () {

        uploadPanel.classList.remove(
            "dragging"
        );

    }
);


uploadPanel.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        uploadPanel.classList.remove(
            "dragging"
        );


        const file =
            event.dataTransfer.files[0];


        loadImageFile(file);

    }
);


/* =================================
   CONTROLS
================================= */

zoomInButton.addEventListener(
    "click",
    function () {

        if (!cropper) {
            return;
        }

        cropper.zoom(0.1);

    }
);


zoomOutButton.addEventListener(
    "click",
    function () {

        if (!cropper) {
            return;
        }

        cropper.zoom(-0.1);

    }
);


rotateButton.addEventListener(
    "click",
    function () {

        if (!cropper) {
            return;
        }

        cropper.rotate(90);

    }
);


/* =================================
   CREATE FINAL IMAGE
================================= */

createButton.addEventListener(
    "click",
    function () {

        if (!cropper) {

            alert(
                "Bạn chưa chọn ảnh."
            );

            return;

        }


        createButton.disabled = true;

        createButton.innerHTML =
            "<span>Đang tạo ảnh...</span>";


        const croppedCanvas =
            cropper.getCroppedCanvas({

                width:
                    OUTPUT_WIDTH,

                height:
                    OUTPUT_HEIGHT,

                imageSmoothingEnabled:
                    true,

                imageSmoothingQuality:
                    "high"

            });


        resultCanvas.width =
            OUTPUT_WIDTH;

        resultCanvas.height =
            OUTPUT_HEIGHT;


        ctx.clearRect(
            0,
            0,
            OUTPUT_WIDTH,
            OUTPUT_HEIGHT
        );


        ctx.drawImage(
            croppedCanvas,
            0,
            0,
            OUTPUT_WIDTH,
            OUTPUT_HEIGHT
        );


        const frameImage =
            new Image();


        frameImage.onload =
            function () {

                ctx.drawImage(
                    frameImage,
                    0,
                    0,
                    OUTPUT_WIDTH,
                    OUTPUT_HEIGHT
                );


                resultSection.classList.remove(
                    "hidden"
                );


                createButton.disabled =
                    false;


                createButton.innerHTML =
                    `
                    <span>
                        Tạo ảnh với khung VYMC
                    </span>

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path d="M5 12H19" />
                        <path d="M14 7L19 12L14 17" />
                    </svg>
                    `;


                setTimeout(
                    function () {

                        resultSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    },
                    100
                );

            };


        frameImage.onerror =
            function () {

                createButton.disabled =
                    false;


                createButton.innerHTML =
                    "Tạo ảnh với khung VYMC";


                alert(
                    "Không tìm thấy file frame. Kiểm tra lại assets/frame.png"
                );

            };


        frameImage.src =
            "assets/frame.png";

    }
);


/* =================================
   DOWNLOAD
================================= */

downloadButton.addEventListener(
    "click",
    function () {

        resultCanvas.toBlob(

            function (blob) {

                if (!blob) {

                    alert(
                        "Không thể tạo ảnh."
                    );

                    return;

                }


                const downloadURL =
                    URL.createObjectURL(blob);


                const link =
                    document.createElement("a");


                link.href =
                    downloadURL;


                link.download =
                    "VYMC-2-nam-avatar.png";


                document.body.appendChild(
                    link
                );


                link.click();


                document.body.removeChild(
                    link
                );


                setTimeout(
                    function () {

                        URL.revokeObjectURL(
                            downloadURL
                        );

                    },
                    1000
                );

            },

            "image/png"

        );

    }
);


/* =================================
   SELECT ANOTHER IMAGE
================================= */

function chooseAnotherImage() {

    imageInput.value = "";

    imageInput.click();

}


changeImageButton.addEventListener(
    "click",
    chooseAnotherImage
);


selectAnotherButton.addEventListener(
    "click",
    chooseAnotherImage
);


/* =================================
   CLEANUP
================================= */

window.addEventListener(
    "beforeunload",
    function () {

        if (currentImageURL) {

            URL.revokeObjectURL(
                currentImageURL
            );

        }

    }
);