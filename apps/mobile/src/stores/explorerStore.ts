import { proxy, useSnapshot } from 'valtio';
import { proxySet } from 'valtio/utils';
import { resetStore } from '@sd/client';

// TODO: Add "media"
export type ExplorerLayoutMode = 'list' | 'grid';

export type ExplorerKind = 'Location' | 'Tag' | 'Space';

const state = {
	locationId: null as number | null,
	path: '',
	layoutMode: 'grid' as ExplorerLayoutMode,
	// Using gridNumColumns instead of fixed size. We dynamically calculate the item size.
	gridNumColumns: 3,
	listItemSize: 65,
	newThumbnails: proxySet() as Set<string>
};

function flattenThumbnailKey(thumbKey: string[]) {
	return thumbKey.join('/');
}

const explorerStore = proxy({
	...state,
	reset: () => resetStore(explorerStore, state),
	addNewThumbnail: (thumbKey: string[]) => {
		explorerStore.newThumbnails.add(flattenThumbnailKey(thumbKey));
	},
	// this should be done when the explorer query is refreshed
	// prevents memory leak
	resetNewThumbnails: () => {
		explorerStore.newThumbnails.clear();
	}
});

export function useExplorerStore() {
	return useSnapshot(explorerStore);
}

export function getExplorerStore() {
	return explorerStore;
}
