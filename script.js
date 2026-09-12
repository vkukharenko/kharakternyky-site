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

    let imageNumber = 1;

    function loadNextImage() {

        const number = String(imageNumber).padStart(3, "0");

        const image = document.createElement("img");

        image.className = "day-image";

        image.alt =
            `Характерники — День ${dayNumber}, ілюстрація ${number}`;

        image.decoding = "async";

        container.appendChild(image);

        image.onload = function () {

            imageNumber++;

            loadNextImage();

        };

        image.onerror = function () {

            image.remove();

        };

        image.src =
            `${bookPath}day-${dayNumber}-${number}.webp`;
    }

    loadNextImage();
}
