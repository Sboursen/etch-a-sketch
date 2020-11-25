const pageBody = document.querySelector('.main');
let cellPerRowAndColumn = 16;

function initialiseGrid(cellPerRowAndColumn) {
    pageBody.style.setProperty(
        'grid-template-rows',
        `repeat(${cellPerRowAndColumn}, 1fr)`
    );
    pageBody.style.setProperty(
        'grid-template-columns',
        `repeat(${cellPerRowAndColumn}, 1fr)`
    );
    pageBody.style.setProperty(
        'gap',
        `${Math.floor((100 - cellPerRowAndColumn) / 17)}px`
    );
}

function rgbTohsl(rgb) {
    // See https://css-tricks.com/converting-color-spaces-in-javascript/
    let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
    rgb = rgb.substr(4).split(')')[0].split(sep);

    for (let R in rgb) {
        let r = rgb[R];
        if (r.indexOf('%') > -1)
            rgb[R] = Math.round((r.substr(0, r.length - 1) / 100) * 255);
    }

    // Make r, g, and b fractions of 1
    r = rgb[0] / 255;
    g = rgb[1] / 255;
    b = rgb[2] / 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    // Calculate hue
    // No difference
    if (delta == 0) h = 0;
    // Red is max
    else if (cmax == r) h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g) h = (b - r) / delta + 2;
    // Blue is max
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0) h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
    //return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

function addHoverEffect(e) {
    if (!e.target.classList.contains('pixel-div__hover')) {
        e.target.classList.add('pixel-div__hover');
    } else {
        const divStyles = window.getComputedStyle(e.target);
        const hslArray = rgbTohsl(divStyles.backgroundColor);
        e.target.style.setProperty(
            'background-color',
            `hsl(240, ${hslArray[1] <= 100 ? hslArray[1] + 20 : 100}%, ${
                hslArray[2] >= 0 ? hslArray[2] - 20 : 0
            }%)`
        );
    }
}

function fillGridwDivs(cellPerRowAndColumn) {
    for (let row = 0; row < cellPerRowAndColumn; row++) {
        for (let col = 0; col < cellPerRowAndColumn; col++) {
            const div = document.createElement('div');
            div.classList.add('pixel-div');
            // div.style.height = `${pageBody.height / rows - pageBody.style.gap}`;
            // div.style.width = `${pageBody.width / rows - pageBody.style.gap}`;
            div.id = `${row}${col}`;
            pageBody.appendChild(div);
        }
    }

    const pixelDivs = document.querySelectorAll('.pixel-div');
    pixelDivs.forEach((pixel) =>
        pixel.addEventListener('mouseenter', addHoverEffect)
    );
}

function clearSketch(e) {
    const pixelDivs = document.querySelectorAll('.pixel-div');
    pixelDivs.forEach((pixel) => pixel.remove());

    let cellPerRowAndColumn = prompt(
        'Please enter the number of cells per column and row',
        '16'
    );

    if (
        cellPerRowAndColumn != null &&
        cellPerRowAndColumn <= 100 &&
        cellPerRowAndColumn > 5
    ) {
        initialiseGrid(cellPerRowAndColumn);
        fillGridwDivs(cellPerRowAndColumn);
    } else {
        cellPerRowAndColumn = 16;
        initialiseGrid(cellPerRowAndColumn);
        fillGridwDivs(cellPerRowAndColumn);
    }
}

const clearButton = document.querySelector('.clear-divs');
clearButton.addEventListener('click', clearSketch);
initialiseGrid(cellPerRowAndColumn);
fillGridwDivs(cellPerRowAndColumn);

function random_rgba() {
    let o = Math.round,
        r = Math.random,
        s = 255;
    return (
        'rgba(' +
        o(r() * s) +
        ',' +
        o(r() * s) +
        ',' +
        o(r() * s) +
        ',' +
        '1' +
        ')'
    );
}
