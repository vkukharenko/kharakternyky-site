/* =======================================================
   BOOK DAYS GALLERY
   Характерники — Книга 1
======================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const gallery = document.getElementById("book-days");

    if (!gallery) {
        return;
    }

    const bookPath = "../../images/books/kharakternyky-1/";

    const firstDay = 1;
    const lastDay = 46;

    for (let day = firstDay; day <= lastDay; day++) {

        const dayNumber = String(day).padStart(3, "0");

        const details = document.createElement("details");
        details.className = "book-day";

        const summary = document.createElement("summary");
        summary.textContent = `День ${dayNumber}`;

        const imagesContainer = document.createElement("div");
        imagesContainer.className = "day-images";

        details.appendChild(summary);
        details.appendChild(imagesContainer);

        gallery.appendChild(details);

        details.addEventListener("toggle", function () {

            if (!details.open) {
                return;
            }

            if (imagesContainer.dataset.loaded === "true") {
                return;
            }

            imagesContainer.dataset.loaded = "true";

            loadDayImages(
                dayNumber,
                imagesContainer,
                bookPath
            );

        });

    }

});


function loadDayImages(dayNumber, container, bookPath) {

    let imageNumber = 1;
    let loadedImages = 0;

    function tryNextImage() {

        const number =
            String(imageNumber).padStart(3, "0");

        const imagePath =
            `${bookPath}day-${dayNumber}-${number}.webp`;

        const image = new Image();

        image.src = imagePath;

        image.alt =
            `Характерники — День ${dayNumber}, ілюстрація ${number}`;

        image.loading = "lazy";
        image.decoding = "async";
        image.className = "day-image";

        image.onload = function () {

            container.appendChild(image);

            loadedImages++;
            imageNumber++;

            tryNextImage();
        };

        image.onerror = function () {

            console.log(
                `День ${dayNumber}: знайдено ${loadedImages} ілюстрацій`
            );

        };

    }

    tryNextImage();
}
