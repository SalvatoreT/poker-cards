import { defineWorkspace } from 'bunup'

// https://bunup.dev/docs/guide/workspaces

export default defineWorkspace([
	{
		name: 'card',
		root: 'packages/card'
	}
])
