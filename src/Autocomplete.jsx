import React, {
	useRef,
	useState,
	useEffect,
	useCallback
} from "react";
import noop from 'lodash/noop'
import PropTypes from 'prop-types'
import { fetchSuggestions } from './utils/api'
import './Autocomplete.css'

// let renders = 0;

const displayName = 'Autocomplete'

const EMPTY = []; // prevent unnecessary hook state re-renders

let instance = 0;
const mounted = {};

const Suggest = React.memo(({ id, title, onClick }) => {
	return (
		<button
			className="search-suggestion"
			data-id={id}
			data-testid={`${displayName}-suggestion`}
			type="button"
			onClick={onClick}
		>
			{title}
		</button>
	)
})
Suggest.displayName = 'Suggest'
Suggest.propTypes = {
	id: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func,
}
Suggest.defaultProps = {
	onClick: noop,
}

const THROTTLE = 300

function Autocomplete({ onClickProduct }) {
	const lastLookupRef = useRef(null)
	const [ident] = useState(instance++)
	const [productId, setProductId] = useState(null)
	const [searchError, setSearchError] = useState({})
	const [searchTerm, setSearchTerm] = useState('')
	const [suggestions, setSuggestions] = useState(EMPTY)

  // Track mounted state to prevent async state change afterward.
  useEffect(() => {
    mounted[ident] = `${displayName}${ident}`
    return () => {
      delete mounted[ident]
    }
  })

	const handleChange = useCallback(
		(event) => {
			setSearchTerm(event.target.value)
		},
		[setSearchTerm]
	)

	const cancelApi = useCallback(() => {
		if (lastLookupRef.current) {
			clearTimeout(lastLookupRef.current);
			lastLookupRef.current = null;
		}
	}, [lastLookupRef])

	const lookup = useCallback(
		(term) => {
			cancelApi()
			lastLookupRef.current = setTimeout(() => {
        if (!mounted[ident]) {
          return
        }
				lastLookupRef.current = null
				fetchSuggestions(term)
					.then((suggestions) => {
						// throw new Error("simulate an error");
						if (suggestions.length > 10) {
							suggestions.length = 10
						}
            if (mounted[ident]) {
							setSuggestions(suggestions)
            }
					})
					.catch((error) => {
            if (mounted[ident]) {
							setSearchError({
								error,
								term,
								message:
									'error trying to search, please try later.',
							})
						}
					})
			}, THROTTLE)
		},
		[setSuggestions, setSearchError, cancelApi]
	)

	useEffect(() => {
		const term = searchTerm.trim()
		if (searchError.message) {
			setSearchError({})
		}
		if (term.length) {
			if (productId) {
				setProductId(null)
				onClickProduct && onClickProduct(null)
			}
			lookup(term)
		} else {
			cancelApi()
			setSuggestions(EMPTY)
		}
	}, [
		lookup,
		cancelApi,
		productId,
		searchTerm,
		searchError,
		setSearchError,
		setSuggestions,
		onClickProduct,
	])

	const onClickSuggestion = useCallback(
		(event) => {
			const id =
				event && event.target && event.target.getAttribute('data-id')
			cancelApi()
			setSearchTerm('')
			setSuggestions(EMPTY)
			setProductId(id)
			id && onClickProduct && onClickProduct(id)
		},
		[onClickProduct, cancelApi]
	)

	function renderSuggestions() {
		return (
			<div
				className="search-suggestion-list"
				data-testid={`${displayName}-suggestion-list`}
				title="Choose now, while supplies last!"
			>
				{suggestions.map((suggestion) => {
					return (
						<Suggest
							key={suggestion.id}
							id={suggestion.id}
							title={suggestion.title}
							onClick={onClickSuggestion}
						/>
					)
				})}
			</div>
		)
	}

	//console.warn(`${displayName}.render`, renders, productId);
	const details = productId ? 'showing-details' : ''
	// ++renders;
	return (
		<div className={`search-container ${details}`.trim()}>
			{/*<input
				data-testid={`${displayName}-renders`}
				type="hidden"
				value={renders}
			/>*/}
			<input
				className="search-box"
				placeholder="Search for a product"
				title="Don’t hesitate, search now!"
				type="text"
				value={searchTerm}
				onChange={handleChange}
			/>
			{searchError.message && (
				<div
					className="search-error"
					data-internal-error={searchError.error}
					data-testid={`${displayName}-error`}
				>
					{searchError.message}
				</div>
			)}
			{suggestions && renderSuggestions()}
		</div>
	)
}
Autocomplete.propTypes = {
	onClickProduct: PropTypes.func,
}
Autocomplete.defaultProps = {
	onClickProduct: noop,
}

export default Autocomplete
