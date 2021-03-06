import memoize from 'lodash/memoize'
import React, { useState, useEffect } from 'react'
import { fetchProductDetail } from './utils/api'
import './ProductDetail.css'

const displayName = 'ProductDetail'
const BLOCKED = false

/* wipro site blocking... make a random image */
const image = memoize((image) => {
	if (!BLOCKED) {
		return image
	}
	if (!image) {
		return null
	}
	const range = 4
	const min = 400
	const step = 100
	const width = min + Math.round(range * Math.random()) * step
	const height = min + Math.round(range * Math.random()) * step
	return `https://picsum.photos/${width}/${height}`
})

const NOTHING = {} // prevent unnecessary hook state re-renders

// toLocaleString works in browser, but not under jest...
function formatMoney(
	amount,
	decimalCount = 2,
	decimal = '.',
	thousands = ',',
	unit = '£'
) {
	try {
		decimalCount = Math.abs(decimalCount)
		decimalCount = isNaN(decimalCount) ? 2 : decimalCount

		const negativeSign = amount < 0 ? '-' : ''

		let i = parseInt(
			(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
		).toString()
		let j = i.length > 3 ? i.length % 3 : 0

		return (
			unit +
			negativeSign +
			(j ? i.substr(0, j) + thousands : '') +
			i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
			(decimalCount
				? decimal +
				  Math.abs(amount - i)
						.toFixed(decimalCount)
						.slice(2)
				: '')
		)
	} catch (e) {
		console.log(e)
	}
}

function ProductDetail(props) {
	const { productId } = props
	const [errorInfo, setError] = useState(NOTHING)
	const [productInfo, setProductInfo] = useState(null)

	// for easier debugging, gather state together
	// eslint-disable-next-line no-unused-vars
	const state = { productInfo, errorInfo }

	useEffect(() => {
		if (!productId) {
			setProductInfo(null)
			return
		}

		fetchProductDetail(productId)
			.then((productInfo) => setProductInfo(productInfo))
			.catch((error) => {
				setError({
					error,
					message: 'error getting product details, please try later.',
				})
			})
	}, [productId])

	const renderProductInfo = () => {
		if (errorInfo && errorInfo.message) {
			return (
				<div
					className="detail-error"
					data-internal-error={errorInfo.error}
					data-testid={`${displayName}-error`}
				>
					{errorInfo.message}
				</div>
			)
		}

		const price =
			productInfo && productInfo.price
				? formatMoney(productInfo.price)
				: ''

		//console.warn(`${displayName}.render`, props, state)
		return (
			<div className="detail-container" data-testid={displayName}>
				{productInfo && productInfo.id && (
					<>
						<div
							className="row"
							data-testid={`${displayName}-image`}
						>
							<img
								alt={productInfo.title}
								className="product-image"
								src={image(productInfo.image)}
							/>
						</div>
						<div
							className="row"
							data-testid={`${displayName}-title`}
							title={productInfo.title}
						>
							<div
								className="row-title hidden"
								id={`${displayName}-title-${productInfo.id}`}
							>
								Name:
							</div>
							<div
								aria-labelledby={`${displayName}-title-${productInfo.id}`}
								className="row-body"
							>
								{productInfo.title}
							</div>
						</div>
						<div
							className="row"
							data-testid={`${displayName}-description`}
							title={productInfo.description}
						>
							<div
								className="row-title hidden"
								id={`${displayName}-description-${productInfo.id}`}
							>
								Description:
							</div>
							<div
								aria-labelledby={`${displayName}-description-${productInfo.id}`}
								className="row-body subtle ellipsis"
							>
								{productInfo.description}
							</div>
						</div>
						<div
							className="row"
							data-testid={`${displayName}-price`}
							title={`Yours for the low, low price of ${price} order now, we have operators standing by!`}
						>
							<div
								className="row-title hidden"
								id={`${displayName}-price-${productInfo.id}`}
							>
								Price:
							</div>
							<div
								aria-labelledby={`${displayName}-price-${productInfo.id}`}
								className="row-body"
							>
								{price}
							</div>
						</div>
					</>
				)}
			</div>
		)
	}

	return renderProductInfo()
}

export default ProductDetail
