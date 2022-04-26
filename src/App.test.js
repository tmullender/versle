import App from "./App";
import {act, render, screen, within} from "@testing-library/react";

beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve([{text: "A verse from the bible", bookname: "Book", chapter: "1", verse: "2"}])
        })
    );
})

afterEach(() => {
    localStorage.clear();
});

test('the words of the verse are rendered', async () => {
    await act(async () => {
        render(<App />);
    });
    const wordList = document.getElementsByClassName("WordList")[0];

    const wrongOrder = [/A/, /bible/, /verse/, /from/, /the/];
    for (let i=0; i<7; i++) {
        wrongOrder.forEach(word => {
            within(wordList).getByText(word).click();
        })
    }
    const rightOrder = [/A/, /verse/, /from/, /the/, /bible/];
    rightOrder.forEach(word => {
        within(wordList).getByText(word).click();
    })
    const statistics = JSON.parse(localStorage.getItem("statistics"));
    expect(statistics.distribution[7]).toBe(1);
});