import { Schema } from '@/金庸群侠传/schema';
import { defineMvuDataStore } from '@util/mvu';

export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
