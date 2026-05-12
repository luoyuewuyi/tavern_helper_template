import { DefaultData, Schema, normalizeStateData } from '../../schema';

$(() => {
  initializeGlobal('WestFantasySchema', {
    DefaultData,
    Schema,
    normalizeStateData,
  });
  console.info('[west-fantasy-schema] loaded');
});
