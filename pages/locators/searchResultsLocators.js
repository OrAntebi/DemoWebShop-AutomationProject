export default {
    priceMinInput: [
        '.search-input #Pf',
        'input[name="Pf"]',
        'input#Pf',
    ],
    priceMaxInput: [
        '.search-input #Pt',
        'input[name="Pt"]',
        'input#Pt',
    ],
    advancedSearchCheckbox: [
        '.search-input #As',
        'input[name="As"]',
        'input#As',
    ],
    priceSubmitButton: [
        '.search-input input.button-1.search-button',
        '.search-input input[type="submit"]',
        'form[action="/search"] input.search-button',
    ],
    nextPageButton: [
        'li.next-page a',
        '.pager li.next-page > a',
        'xpath=//li[contains(@class,"next-page")]//a',
    ],
};
