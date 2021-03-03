import React from 'react'

const DISABLE = false

// console.error('why-render.js NODE_ENV', process.env.NODE_ENV)
if (!DISABLE && /^(dev|development|test)$/.test(process.env.NODE_ENV)) {
	const whyDidYouRender = require('@welldone-software/why-did-you-render')
	whyDidYouRender(React, {
		// https://github.com/welldone-software/why-did-you-render
		// track every pure component or you need to add Component.whyDidYouRender = true
		// to each component you want to track.
		// Component.whyDidYouRender = {
		//  customName: 'BetterName', // if displayed component name is really bad
		//  // ...other options
		// }
		trackAllPureComponents: true,
	include: [
		/./, // turning this on can freeze up if there are huge lists which render needlessly
		// /MyComponentToTrack/,
		// RegExp to match display name of components to track
	],
	exclude: [
		// /ComponentToIgnore/,
	],
	// trackHooks: false,
	// logownerReasons: false,
	});
}
