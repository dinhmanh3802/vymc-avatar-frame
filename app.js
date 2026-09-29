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


/* =================================
   CẤU HÌNH CHÍNH
================================= */

let cropper = null;

let currentImageURL = null;


/*
    Frame của mày là 1280 x 1280
*/
const OUTPUT_WIDTH = 1254;
const OUTPUT_HEIGHT = 1254;


/*
    Vị trí vùng tròn để nhét ảnh vào.

    Nếu sau này chưa khít 100%,
    chỉ cần chỉnh 3 số này.

    centerX:
    tăng = sang phải
    giảm = sang trái

    centerY:
    tăng = xuống dưới
    giảm = lên trên

    radius:
    tăng = vòng ảnh lớn hơn
    giảm = vòng ảnh nhỏ hơn
*/
const AVATAR_CIRCLE = {
    centerX: 619,
    centerY: 583,
    radius: 405
};


/*
    Cho ảnh tràn thêm một chút ra ngoài
    để không bị hở mép frame.
*/
const AVATAR_BLEED = 12;


/* =================================
   LOAD ẢNH NGƯỜI DÙNG
================================= */

function loadImageFile(file) {

    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        alert(
            "Vui lòng chọn một file ảnh JPG hoặc PNG."
        );

        return;

    }


    if (currentImageURL) {

        URL.revokeObjectURL(
            currentImageURL
        );

    }


    currentImageURL =
        URL.createObjectURL(file);


    fileName.textContent =
        file.name;


    imageToCrop.src =
        currentImageURL;


    editorSection.classList.remove(
        "hidden"
    );

    resultSection.classList.add(
        "hidden"
    );


    imageToCrop.onload = function () {

        if (cropper) {

            cropper.destroy();

        }


        cropper =
            new Cropper(
                imageToCrop,
                {

                    /*
                        Crop vẫn để vuông.
                        Sau đó ảnh vuông này
                        sẽ được cắt thành hình tròn.
                    */
                    aspectRatio: 1,

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
   CHỌN ẢNH
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
   KÉO THẢ ẢNH TRÊN MÁY TÍNH
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
   PHÓNG TO
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


/* =================================
   THU NHỎ
================================= */

zoomOutButton.addEventListener(
    "click",
    function () {

        if (!cropper) {
            return;
        }

        cropper.zoom(-0.1);

    }
);


/* =================================
   XOAY ẢNH
================================= */

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
   TẠO ẢNH CUỐI
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


        /*
            Lấy ảnh đã crop
        */
        const croppedCanvas =
            cropper.getCroppedCanvas({

                width:
                    AVATAR_CIRCLE.radius * 2,

                height:
                    AVATAR_CIRCLE.radius * 2,

                imageSmoothingEnabled:
                    true,

                imageSmoothingQuality:
                    "high"

            });


        /*
            Setup canvas kết quả
        */
        resultCanvas.width =
            OUTPUT_WIDTH;

        resultCanvas.height =
            OUTPUT_HEIGHT;


        /*
            Xóa canvas cũ
        */
        ctx.clearRect(
            0,
            0,
            OUTPUT_WIDTH,
            OUTPUT_HEIGHT
        );


        /*
            Load frame
        */
        const frameImage =
            new Image();


        frameImage.onload =
            function () {

                /*
                    Xóa canvas lại lần nữa
                    để chắc chắn sạch.
                */
                ctx.clearRect(
                    0,
                    0,
                    OUTPUT_WIDTH,
                    OUTPUT_HEIGHT
                );


                /*
                    BẮT ĐẦU CLIP VÙNG TRÒN
                */
                ctx.save();


                ctx.beginPath();


                ctx.arc(
                    AVATAR_CIRCLE.centerX,
                    AVATAR_CIRCLE.centerY,
                    AVATAR_CIRCLE.radius,
                    0,
                    Math.PI * 2
                );


                ctx.closePath();


                ctx.clip();


                /*
                    Vẽ ảnh người dùng
                    chỉ bên trong vùng tròn.
                */
                ctx.drawImage(

                    croppedCanvas,

                    AVATAR_CIRCLE.centerX
                        - AVATAR_CIRCLE.radius
                        - AVATAR_BLEED,

                    AVATAR_CIRCLE.centerY
                        - AVATAR_CIRCLE.radius
                        - AVATAR_BLEED,

                    (AVATAR_CIRCLE.radius * 2)
                        + (AVATAR_BLEED * 2),

                    (AVATAR_CIRCLE.radius * 2)
                        + (AVATAR_BLEED * 2)

                );


                /*
                    Kết thúc clip
                */
                ctx.restore();


                /*
                    Vẽ frame lên trên cùng
                */
                ctx.drawImage(
                    frameImage,
                    0,
                    0,
                    OUTPUT_WIDTH,
                    OUTPUT_HEIGHT
                );


                /*
                    Hiện kết quả
                */
                resultSection.classList.remove(
                    "hidden"
                );


                /*
                    Trả nút về trạng thái ban đầu
                */
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


                /*
                    Cuộn xuống kết quả
                */
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


        /*
            Nếu không load được frame
        */
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


        /*
            Đường dẫn frame
        */
        frameImage.src =
            "assets/frame.png";

    }
);


/* =================================
   TẢI ẢNH
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
   CHỌN ẢNH KHÁC
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
   DỌN BỘ NHỚ
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
