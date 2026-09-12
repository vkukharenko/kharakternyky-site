document.addEventListener("DOMContentLoaded", function () {

    const gallery = document.getElementById("book-days");

    if (!gallery) {
        console.log("BOOK GALLERY: #book-days не знайдено");
        return;
    }

    console.log("BOOK GALLERY: script працює");

    const bookPath = "../../images/books/kharakternyky-1/";

    for (let day = 0; day <= 46; day++) {

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

    function loadNextImage() {

        const number = String(imageNumber).padStart(3, "0");

        const imagePath =
            `${bookPath}day-${dayNumber}-${number}.webp`;

        console.log("Завантажую:", imagePath);

        const image = document.createElement("img");

        image.className = "day-image";

        image.alt =
            `Характерники — День ${dayNumber}, ілюстрація ${number}`;

        image.decoding = "async";

        /*
         * Спочатку додаємо IMG у сторінку
         */
        container.appendChild(image);

        image.onload = function () {

            console.log(
                `OK: День ${dayNumber} / ${number}`
            );

            imageNumber++;

            loadNextImage();
        };

        image.onerror = function () {

            console.log(
                `Кінець Дня ${dayNumber}: ${imagePath}`
            );

            image.remove();
        };

        /*
         * src задаємо після додавання в DOM
         */
        image.src = imagePath;
    }

    loadNextImage();
}
