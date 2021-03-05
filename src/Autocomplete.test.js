/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Autocomplete from './Autocomplete'

const displayName = 'Autocomplete'

jest.mock('./utils/api')

describe(displayName, () => {
	let clickSpy

	function renderForTest() {
		clickSpy = jest.fn()
		const tools = render(<Autocomplete onClickProduct={clickSpy} />)

		const input = screen.getByRole('textbox', {
			placeholder: /search for a product/i,
		})
		return { input, tools }
	}

	it('renders correctly with no search term', () => {
		renderForTest()

		screen.getByPlaceholderText('Search for a product')
	})

	it('handles a server error gracefully', async () => {
		const { input } = renderForTest()

		userEvent.clear(input)
		userEvent.paste(input, 'error')
		let error
		await waitFor(() => {
			error = screen.getByTestId(`${displayName}-error`)
		})

		expect(error).toHaveTextContent(
			'error trying to search, please try later.'
		)
	})

	it('renders correctly with a popular search term', async () => {
		const { input } = renderForTest()

		userEvent.clear(input)
		userEvent.paste(input, 'test')
		let suggestions
		await waitFor(() => {
			suggestions = screen.queryAllByTestId(`${displayName}-suggestion`)
			if (!suggestions.length) {
				throw new Error('awaiting suggestion list')
			}
		})

		expect(suggestions).toHaveLength(10)
		screen.getByText('SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s')
	})

	it('clears the search when a suggestion is clicked', async () => {
		const { input } = renderForTest()

		userEvent.clear(input)
		userEvent.paste(input, 'test')
		let suggestions
		await waitFor(() => {
			suggestions = screen.queryAllByTestId(`${displayName}-suggestion`)
			if (!suggestions.length) {
				throw new Error('awaiting suggestion list')
			}
		})

		expect(suggestions).toHaveLength(10)
		const select = screen.getByText(
			'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s'
		)

		userEvent.click(select)
		await waitFor(() => {
			suggestions = screen.queryAllByTestId(`${displayName}-suggestion`)
			if (suggestions.length) {
				throw new Error('awaiting suggestion list to vanish')
			}
		})

		expect(clickSpy).toHaveBeenCalledTimes(1)
		expect(clickSpy).toHaveBeenCalledWith('10')

		expect(input.value).toBe('')
	})

	it('clears the product detail when a new search is typed', async () => {
		const { input } = renderForTest()

		expect(clickSpy).toHaveBeenCalledTimes(0)

		userEvent.clear(input)
		userEvent.paste(input, 'test')
		let suggestions
		await waitFor(() => {
			suggestions = screen.queryAllByTestId(`${displayName}-suggestion`)
			if (!suggestions.length) {
				throw new Error('awaiting suggestion list')
			}
		})

		expect(clickSpy).toHaveBeenCalledTimes(0)

		expect(suggestions).toHaveLength(10)
		const select = screen.getByText(
			'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s'
		)

		userEvent.click(select)
		await waitFor(() => {
			suggestions = screen.queryAllByTestId(`${displayName}-suggestion`)
			if (suggestions.length) {
				throw new Error('awaiting suggestion list to vanish')
			}
		})

		expect(clickSpy).toHaveBeenCalledTimes(1)
		expect(clickSpy).toHaveBeenCalledWith('10')

		userEvent.clear(input)
		userEvent.paste(input, 'test')
		await waitFor(() => {
			suggestions = screen.queryAllByTestId(`${displayName}-suggestion`)
			if (!suggestions.length) {
				throw new Error('awaiting suggestion list again')
			}
		})

		expect(clickSpy).toHaveBeenCalledTimes(2)
		expect(clickSpy.mock.calls[1][0]).toBe(null)
	})
})
