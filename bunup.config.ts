import { defineWorkspace } from 'bunup'

// https://bunup.dev/docs/guide/workspaces

export default defineWorkspace([
	{
		name: 'poker-cards',
		root: 'packages/poker-cards'
	},
	{
		name: 'poker-card-element',
		root: 'packages/poker-card-element'
	}
])
