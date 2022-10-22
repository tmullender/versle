import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import Menu from "./Menu";
import React from "react";

const statistics = {played: 2, distribution: [1, 2], currentStreak: 0, longestStreak: 2};

test('the menu should be rendered', async () => {
    const updateSettings = jest.fn()
    await act(async () => {
        render(<Menu settings={{randomVerse:false}} update={updateSettings} statistics={statistics} hideStatistics={()=>{}} />);
    });
    expect(document.getElementsByClassName("menuIcon").length).toBe(3);
});

test('the help text should be visible when help is clicked', async () => {
    const updateSettings = jest.fn()
    await act(async () => {
        render(<Menu settings={{randomVerse:false}} update={updateSettings} statistics={statistics} hideStatistics={()=>{}} />);
    });
    expect(screen.queryAllByText(/The words from a verse in the Bible/)).toHaveLength(0)
    fireEvent.click(screen.getByTitle("Help"))
    expect(screen.getByText(/The words from a verse in the Bible/)).toBeVisible()
    fireEvent.click(screen.getByLabelText("Close"))
    await waitFor(() => {
        expect(screen.queryAllByText(/The words from a verse in the Bible/)).toHaveLength(0)
    })
});

test('the statistics should be visible when statistics is clicked', async () => {
    const updateSettings = jest.fn()
    await act(async () => {
        render(<Menu settings={{randomVerse:true}} update={updateSettings} statistics={statistics} hideStatistics={()=>{}} />);
    });
    expect(screen.queryAllByText(/Played/)).toHaveLength(0)
    fireEvent.click(screen.getByTitle("Statistics"))
    expect(screen.getByText(/Played/)).toBeVisible()
    fireEvent.click(screen.getByLabelText("Close"))
    await waitFor(() => {
        expect(screen.queryAllByText(/Played/)).toHaveLength(0)
    })
});

test('the settings should be visible when settings is clicked', async () => {
    const updateSettings = jest.fn()
    await act(async () => {
        render(<Menu settings={{randomVerse:false}} update={updateSettings} statistics={statistics} hideStatistics={()=>{}} />);
    });
    expect(screen.queryAllByText(/Using Verse of the Day/)).toHaveLength(0)
    fireEvent.click(screen.getByTitle("Settings"))
    expect(screen.getByText(/Using Verse of the Day/)).toBeVisible()
    fireEvent.click(screen.getByRole("checkbox", {checked: false}))
    fireEvent.click(screen.getByLabelText("Close"))
    await waitFor(() => {
        expect(screen.queryAllByText(/Using /)).toHaveLength(0)
    })
});