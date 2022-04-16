import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import Game from './Game';

beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve([{text: "A verse from the bible", bookname: "Book", chapter: "1", verse: "2"}])
        })
    );
})

afterEach(() => {
    localStorage.clear();
})

test('the words of the verse are rendered', async () => {
    await act(async () => {
        render(<Game settings={{randomVerse:false}} onComplete={jest.fn()}/>);
    });

    await waitFor(() => {
        expect(screen.getByText(/A/)).toBeInTheDocument();
        expect(screen.getByText(/bible/)).toBeInTheDocument();
        expect(screen.getByText(/from/)).toBeInTheDocument();
        expect(screen.getByText(/the/)).toBeInTheDocument();
        expect(screen.getByText(/verse/)).toBeInTheDocument();
    });
});

test('words are available until clicked', async () => {
    await act(async () => {
        render(<Game settings={{randomVerse:false}} onComplete={jest.fn()}/>);
    });

    const words = [/A/, /verse/, /from/, /the/, /bible/];
    words.forEach(word => {
        const element = screen.getByText(word);
        expect(element.classList.contains("available"))
        element.click();
        expect(!element.classList.contains("available"))
    })
})

test('words are available until dragged', async () => {
    await act(async () => {
        render(<Game settings={{randomVerse:false}} onComplete={jest.fn()}/>);
    });

    const words = [/A/, /verse/, /from/, /the/, /bible/];
    words.forEach((word, index) => {
        const element = screen.getByText(word);
        const event = {}
        event.dataTransfer = {
            setData: (key, value) => event[key] = value,
            getData: (key) => event[key]
        }
        fireEvent.dragStart(element, event)
        const space = document.getElementsByClassName("Space")[index];
        fireEvent.drop(space, event)
        expect(!element.classList.contains("available"))
    })

    expect(screen.getByText("Book 1v2")).toBeVisible();
})

test('verse should be visible when words are clicked in order', async () => {
    await act(async () => {
        render(<Game settings={{randomVerse:false}} onComplete={jest.fn()}/>);
    });

    const words = [/A/, /verse/, /from/, /the/, /bible/];
    words.forEach(word => {
        screen.getByText(word).click();
    })

    expect(screen.getByText("Book 1v2")).toBeVisible();
})

test('verse should not be visible until words are clicked in order', async () => {
    await act(async () => {
        render(<Game settings={{randomVerse:false}} onComplete={jest.fn()}/>);
    });
    const wordList = document.getElementsByClassName("WordList")[0];

    const firstAttempt = [/A/, /bible/, /verse/, /from/, /the/];
    firstAttempt.forEach(word => {
        within(wordList).getByText(word).click();
        expect(screen.queryAllByText("Book 1v2").length).toBe(0)
    })

    const secondAttempt = [/A/, /verse/, /from/, /the/, /bible/];
    secondAttempt.forEach(word => {
        expect(screen.queryAllByText("Book 1v2").length).toBe(0)
        within(wordList).getByText(word).click();
    })
    expect(document.getElementsByClassName("incorrect").length).toBe(4);
    expect(document.getElementsByClassName("correct").length).toBe(6);
    expect(screen.queryAllByText("Book 1v2").length).toBe(1)
})

test('words are removed when a space is clicked on', async () => {
    await act(async () => {
        render(<Game settings={{randomVerse: false}} onComplete={jest.fn()} />);
    })

    const wordList = document.getElementsByClassName("WordList")[0];
    const words = [/A/, /bible/, /verse/, /from/];
    words.forEach(word => {
        within(wordList).getByText(word).click();
    })

    const solution = document.getElementsByClassName("Solution")[0];
    within(solution).getByText(/bible/).click()
    expect(within(solution).queryAllByText(/bible/).length).toBe(0)
    expect(within(wordList).getByText(/bible/).classList.contains("available"))
})

test('state is maintained on page refresh', async () => {
    await act(async () => {
        render(<Game settings={{randomVerse:false}} onComplete={jest.fn()}/>);
    });
    const wordList = document.getElementsByClassName("WordList")[0];

    const firstAttempt = [/A/, /bible/, /verse/, /from/, /the/, /A/, /verse/, /from/, /the/, /bible/];
    firstAttempt.forEach(word => {
        within(wordList).getByText(word).click();
    })

    const html = document.documentElement.innerHTML;
    cleanup()
    await act(async () => {
        render(<Game settings={{randomVerse:false}}/>);
    });
    expect(document.documentElement.innerHTML).toBe(html)
})
