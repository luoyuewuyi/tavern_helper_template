import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';
import { variableOption } from './context';

export const useDataStore = defineMvuDataStore(Schema, variableOption);
