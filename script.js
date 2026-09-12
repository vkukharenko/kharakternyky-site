/* =======================================================
   BOOK DAYS GALLERY
   Характерники — Книга 1
======================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const gallery = document.getElementById("book-days");

    if (!gallery) {
        console.log("BOOK GALLERY: #book-days не знайдено");
        return;
    }

    console.log("BOOK GALLERY: script працює");

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

            console.log(`Завантаження Дня ${dayNumber}`);

            loadDayImages(
                dayNumber,
                imagesContainer,
                bookPath
            );

        });

    }

});


/* =======================================================
   LOAD IMAGES
======================================================= */

function loadDayImages(dayNumber, container, bookPath) {

    let imageNumber = 1;

    function loadNextImage() {

        const number = String(imageNumber).padStart(3, "0");

        const imagePath =
            `${bookPath}day-${dayNumber}-${number}.webp`;

        console.log("Перевіряю:", imagePath);

        const image = document.createElement("img");

        image.className = "day-image";

        image.alt =
            `Характерники — День ${dayNumber}, ілюстрація ${number}`;

        image.decoding = "async";

        /*
         * ВАЖЛИВО:
         * Спочатку додаємо картинку в DOM,
         * і тільки після цього задаємо src.
         */
        container.appendChild(image);

        image.onload = function () {

            console.log(
                `OK: День ${dayNumber}, ілюстрація ${number}`
            );

            imageNumber++;

            loadNextImage();
        };

        image.onerror = function () {

            console.log(
                `Кінець Дня ${dayNumber}. Наступної картинки немає:`,
                imagePath
            );

            image.remove();
        };

        image.src = imagePath;
    }

    loadNextImage();
}
