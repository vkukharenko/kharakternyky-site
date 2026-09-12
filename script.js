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

            // Не завантажуємо картинки повторно
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

    function loadNextImage() {

        const imageNumberFormatted =
            String(imageNumber).padStart(3, "0");

        const image = document.createElement("img");

        image.src =
            `${bookPath}day-${dayNumber}-${imageNumberFormatted}.webp`;

        image.alt =
            `Характерники — День ${dayNumber}, ілюстрація ${imageNumberFormatted}`;

        image.loading = "lazy";

        image.decoding = "async";

        image.className = "day-image";

        image.onload = function () {

            container.appendChild(image);

            imageNumber++;

            loadNextImage();
        };

        image.onerror = function () {

            // Якщо наступної картинки немає —
            // закінчуємо завантаження цього дня.
            image.remove();

        };
    }

    loadNextImage();
}