document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("book-days");
    if (!gallery) return;

    const bookPath = gallery.dataset.bookPath;
    const firstDay = Number.parseInt(gallery.dataset.firstDay, 10);
    const lastDay = Number.parseInt(gallery.dataset.lastDay, 10);
    const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");

    if (!bookPath || Number.isNaN(firstDay) || Number.isNaN(lastDay) || lastDay < firstDay) return;

    for (let day = firstDay; day <= lastDay; day++) {
        const dayNumber = String(day).padStart(3, "0");
        const details = document.createElement("details");
        details.className = "book-day";

        const summary = document.createElement("summary");
        summary.textContent = isEnglish ? `Day ${dayNumber}` : `День ${dayNumber}`;

        const imagesContainer = document.createElement("div");
        imagesContainer.className = "day-images";
        details.append(summary, imagesContainer);
        gallery.appendChild(details);

        details.addEventListener("toggle", function () {
            if (!details.open || imagesContainer.dataset.loaded === "true") return;
            imagesContainer.dataset.loaded = "true";
            loadDayImages(dayNumber, imagesContainer, bookPath, isEnglish);
        });

        // Show illustrations immediately for the first available day so the gallery
        // never looks empty when the page opens.
        if (day === firstDay) {
            details.open = true;
            imagesContainer.dataset.loaded = "true";
            loadDayImages(dayNumber, imagesContainer, bookPath, isEnglish);
        }
    }
});

function loadDayImages(dayNumber, container, bookPath, isEnglish) {
    let imageNumber = 1;
    let consecutiveMisses = 0;
    let loadedImages = 0;
    const maxImageNumber = 100;
    const maxConsecutiveMisses = 3;

    function loadNextImage() {
        if (imageNumber > maxImageNumber || consecutiveMisses >= maxConsecutiveMisses) {
            if (loadedImages === 0) {
                const note = document.createElement("p");
                note.className = "book-note";
                note.textContent = isEnglish
                    ? "No illustrations were found for this day."
                    : "Для цього дня ілюстрацій не знайдено.";
                container.appendChild(note);
            }
            return;
        }

        const number = String(imageNumber).padStart(3, "0");
        const image = document.createElement("img");
        image.className = "day-image";
        image.alt = isEnglish
            ? `Kharakternyky — Day ${dayNumber}, illustration ${number}`
            : `Характерники — День ${dayNumber}, ілюстрація ${number}`;
        image.decoding = "async";
        image.loading = "lazy";

        image.onload = function () {
            loadedImages++;
            consecutiveMisses = 0;
            loadNextImage();
        };

        image.onerror = function () {
            image.remove();
            consecutiveMisses++;
            loadNextImage();
        };

        image.src = `${bookPath}day-${dayNumber}-${number}.webp`;
        imageNumber++;
        container.appendChild(image);
    }

    loadNextImage();
}
