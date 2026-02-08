export interface CardRenderOptions {
	/** Card ID string, e.g. "AS" (Ace of Spades), "QH" (Queen of Hearts), "ACE-OF-SPADES" */
	cid?: string;
	/** Suit: 0=spades, 1=hearts, 2=diamonds, 3=clubs, or a name/letter string */
	suit?: number | string;
	/** Rank: 0=back, 1=ace, 2-10=number, 11=jack, 12=queen, 13=king, or a name/letter string */
	rank?: number | string;
	/** Custom rank display characters. Comma-separated or individual characters. */
	letters?: string | false;
	/** Suit variant string per suit position, e.g. "0123" */
	suits?: string;
	/** Court card art style per court, e.g. "012" */
	courts?: string;
	/** Hide the rank indicator in the corner */
	norank?: boolean | number;
	/** Card back pattern color */
	backcolor?: string;
	/** Card face background color */
	cardcolor?: string;
	/** Suit symbol colors, comma-separated per suit, e.g. "#000,#f00,#f00,#000" */
	suitcolor?: string;
	/** Rank indicator stroke colors, comma-separated per suit */
	rankcolor?: string;
	/** Corner border radius in SVG units */
	borderradius?: number;
	/** Border stroke color */
	bordercolor?: string;
	/** Border stroke width */
	borderline?: string | number;
	/** Pip/symbol opacity (0-1) */
	opacity?: number;
	/** Court card layer colors: gold,red,blue,black,outline-color,outline-width */
	courtcolors?: string;
	/** Text displayed on the card back */
	backtext?: string;
	/** Color of the back text */
	backtextcolor?: string;
	/** Show debug pip position labels (non-zero to enable) */
	showpips?: number;
	/** Vertical pip position offset */
	pipy?: number;
	/** Additional SVG attributes for the root svg element */
	svg?: string;
	/** Drop shadow: "dx,dy,stdDeviation" */
	shadow?: string;
}
