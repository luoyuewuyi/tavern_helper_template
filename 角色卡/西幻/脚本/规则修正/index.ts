import { normalizeStateData } from '../../schema';

$(() => {
  void (async () => {
    await waitGlobalInitialized('Mvu');

    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, variables => {
      variables.stat_data = normalizeStateData(variables.stat_data);
    });

    console.info('[west-fantasy-rules] loaded');
  })();
});
