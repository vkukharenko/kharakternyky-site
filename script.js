document.addEventListener("DOMContentLoaded", function () {

    const gallery = document.getElementById("book-days");

    if (!gallery) {
        return;
    }

    const bookPath = gallery.dataset.bookPath;
    const firstDay = parseInt(gallery.dataset.firstDay, 10);
    const lastDay = parseInt(gallery.dataset.lastDay, 10);

    if (!bookPath || isNaN(firstDay) || isNaN(lastDay)) {
        return;
    }

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

    /*
     * Перевіряємо КОЖЕН номер окремо: 000–999.
     * Відсутність, наприклад, 002 не зупиняє завантаження 003, 004 і т.д.
     *
     * Спочатку шукаємо WebP, потім PNG.
     */
    for (let imageNumber = 0; imageNumber <= 999; imageNumber++) {

        const number = String(imageNumber).padStart(3, "0");

        loadImage(
            `${bookPath}day-${dayNumber}-${number}.webp`,
            number,
            container,
            bookPath,
            dayNumber
        );

    }

}


function loadImage(src, number, container, bookPath, dayNumber) {

    const image = document.createElement("img");

    image.className = "day-image";

    image.alt =
        `Характерники — День ${dayNumber}, ілюстрація ${number}`;

    image.decoding = "async";

    image.onload = function () {

        container.appendChild(image);

    };

    image.onerror = function () {

        /*
         * Якщо WebP не знайдено, пробуємо PNG.
         * Якщо немає і PNG — просто нічого не показуємо.
         */
        if (src.endsWith(".webp")) {

            const pngImage = document.createElement("img");

            pngImage.className = "day-image";

            pngImage.alt =
                `Характерники — День ${dayNumber}, ілюстрація ${number}`;

            pngImage.decoding = "async";

            pngImage.onload = function () {
                container.appendChild(pngImage);
            };

            pngImage.onerror = function () {
                pngImage.remove();
            };

            pngImage.src =
                `${bookPath}day-${dayNumber}-${number}.png`;

        }

        image.remove();

    };

    image.src = src;
}
